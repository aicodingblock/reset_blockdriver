#!/usr/bin/env bash

INFO_FILE=/tmp/aimk-ttyUSB0

udevadm info /dev/ttyUSB0 > $INFO_FILE

if [ $? -ne 0 ];then
    sudo systemctl stop serial-getty@ttyUSB0.service
    rm -f $INFO_FILE
    exit
fi

is_serial_console="false"

check_pc(){
    grep -q 'serial/by-id/usb-1a86_USB_Serial' $INFO_FILE
    if [ $? -ne 0 ];then
        is_serial_console="false"
        return
    fi
    grep -q 'ID_MODEL=USB_Serial' $INFO_FILE
    if [ $? -ne 0 ];then
        is_serial_console="false"
        return
    fi
    grep -q 'ID_USB_DRIVER=ch34' $INFO_FILE
    if [ $? -ne 0 ];then
        is_serial_console="false"
        return
    fi

    is_serial_console="true"
}

check_pc

rm -f $INFO_FILE

echo "is_serial_console = ${is_serial_console}" > /home/pi/log.txt

if [ "$is_serial_console" = "true" ];then
    # systemctl stop serial-getty@ttyS0.service
    systemctl start serial-getty@ttyUSB0.service
else
    # systemctl start serial-getty@ttyS0.service
    systemctl stop serial-getty@ttyUSB0.service
fi
