#!/bin/sh

start_lighttpd()
{
	lighttpd -f /usr/local/config/lighttpd.conf
}

while true
do
        lighttpd_pid=`cat /var/run/lighttpd/lighttpd.pid`
        if ! [ -f "/proc/${lighttpd_pid}/status" ]; then
                echo "Process lighttpd not found, start it"
                start_lighttpd
                sleep 40
        fi

        result=`ps | grep Z | grep cloud`
        if [ $? -eq "0" ]; then
                echo "Found cloud zombie process, killall cloud"
        killall -9 cloud
        fi

        sleep 10

        result=`ps | grep Z | grep ipcamera`
        if [ $? -eq "0" ]; then
                echo "Found ipcamera zombie process, kill lighttpd"
        kill ${lighttpd_pid}
        fi

        if [ $(find  /tmp/ -mmin +1 | grep uri) ]
        then
                find /tmp | grep uri | xargs rm -f
                cat /var/run/lighttpd/lighttpd.pid | xargs kill
        fi

done
