#!/usr/bin/env bash

# last changed at 2021.12.01

# aimk-serial-console.service에서 호출하는 스크립트
# root 권한으로 실행된다.
# USB에 콘솔용 시리얼이 연결되면, 콘솔 시리얼 서비스를 실행한다.
# web.cn사의 CH34x 드라이버를 통해 연결되므로 
# 이 조건을 체크한다. 현재 라즈베리3,4에서 사용가능하다.

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

# for debug
# echo "is_serial_console = ${is_serial_console}" > /home/pi/log.txt

#  if [ "$is_serial_console" = "true" ];then
#      # systemctl stop serial-getty@ttyS0.service
#      systemctl start serial-getty@ttyUSB0.service
#  else
#      # systemctl start serial-getty@ttyS0.service
#      systemctl stop serial-getty@ttyUSB0.service
#  fi

if [ "$is_serial_console" = "true" ];then
    # systemctl start serial-getty@ttyUSB0.service
    echo "serial_console true"
else
    # systemctl stop serial-getty@ttyUSB0.service
    echo "serial_console false"
fi
