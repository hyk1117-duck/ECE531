# Makefile for cross-compiling simplenet.c to 32-bit ARM (armhf) using a
# Buildroot-generated toolchain.
#
# Prerequisite: build Buildroot with libcurl enabled (Target packages ->
# Libraries -> Networking -> libcurl), e.g.:
#   git clone https://git.buildroot.net/buildroot
#   cd buildroot && make menuconfig   # set ARM / EABIhf / enable libcurl
#   make
#
# Point BUILDROOT_OUTPUT at that buildroot repo's output/ directory, either
# by editing the default below or overriding on the command line:
#   make BUILDROOT_OUTPUT=/path/to/buildroot/output
#
# The Buildroot toolchain wrapper already knows its own sysroot, so no
# manual --sysroot flag is needed (unlike a plain apt-installed toolchain).

TARGET  = netcall
SRC     = netcall.c

BUILDROOT_OUTPUT ?= /home/hyk1117/buildroot/output
TOOLCHAIN_PREFIX  = arm-buildroot-linux-gnueabi

CC      = $(BUILDROOT_OUTPUT)/host/bin/$(TOOLCHAIN_PREFIX)-gcc
CFLAGS  = -Wall
LDLIBS  = -lcurl

.PHONY: all clean

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(CFLAGS) $(SRC) -o $(TARGET) $(LDFLAGS) $(LDLIBS)

clean:
	rm -f $(TARGET)