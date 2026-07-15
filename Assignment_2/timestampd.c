//gcc timestampd.c -o timestampd -Wall 
// Simple timestamp daemon that prints the current time to syslog every second
// This code is based on the example code provided in lectures from ECE-531, with modifications to implement the required functionality by Harrison Keith.

//Setting up the necessary includes for the daemon to function properly
#include <errno.h>
#include <signal.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <syslog.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <time.h>
#include <unistd.h>
// Defining constants for the daemon name, error format, and error codes
#define DAEMON_NAME "timestampd"
#define ERROR_FORMAT "%s"
#define OK 0
#define ERR_FORK 1
#define ERR_SETSID 2
#define ERR_CHDIR 3
#define ERR_WTF 4

// This is where the main work of this daemon is done. It prints the current time to syslog every second.
// Time function based on https://www.geeksforgeeks.org/c/time-h-header-file-in-c-with-examples/
static void _do_work(void) {
    while (1) {
        struct tm* ptr;
        time_t t;
        t = time(NULL);
        ptr = localtime(&t);
        syslog(LOG_INFO, "Current time: %s", asctime(ptr));
        sleep(1);
    }
}


// This handles the  signals sent to the daemon. SIGHUP continues as normal, SIGTERM exits the daemon, and any other signal is logged as unhandled.
static void _signal_handler(const int signal) {
    switch (signal) {
        case SIGHUP:
            break;
        case SIGTERM:
            syslog(LOG_INFO, "received SIGTERM, exiting.");
            closelog();
            exit(OK);
            break;
        default:
            syslog(LOG_INFO, "received unhandled signal");
    }
}

//The main function sets up the daemon, including forking, setting up signal handling, and calling the _do_work function.
int main(void) {
    openlog(DAEMON_NAME, LOG_PID | LOG_NDELAY | LOG_NOWAIT, LOG_DAEMON);
    syslog(LOG_INFO, "starting timestampd");

// Forking to not take over syslogd or initd
pid_t pid = fork();
if (pid < 0) {
    syslog(LOG_ERR, ERROR_FORMAT, strerror(errno));
    return ERR_FORK;
}

// If we are the parent process, we can exit and let the child continue as a daemon
if (pid > 0) {
    return OK;
}

// if the setsid call fails, we log the error and return an error code. 
if(setsid() < -1) {
    syslog(LOG_ERR, ERROR_FORMAT, strerror(errno));
    return ERR_SETSID;
}

// Close out unneeded file pointers
close(STDIN_FILENO);
close(STDOUT_FILENO);
close(STDERR_FILENO);

// Setting UMASK to reasonable permissions
umask(S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH);


//Setting file directory to root 
if(chdir("/") < 0) {
    syslog(LOG_ERR, ERROR_FORMAT, strerror(errno));
    return ERR_CHDIR;
}

// Setting up signal handling 
signal(SIGTERM, _signal_handler);
signal(SIGHUP, _signal_handler);

// Calling the main work function
_do_work();


//If we get here then everything is broken and I will cry 
return ERR_WTF;
}
