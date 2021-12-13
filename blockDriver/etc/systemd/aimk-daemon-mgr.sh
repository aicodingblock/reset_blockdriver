#!/usr/bin/env bash

# last changed at 2021.12.01

# aimk-daemon-mgr는 블록코딩을 하는 동안 aimk_auto 데몬이 kill되는데 ,
# 블록코딩을 마친 후에 aimk-button-daemon을 자동으로 재시작하는 용도이다.

BLOCK_DRIVER_PID_FILE=/var/run/aimk/blockDriver.pid
BUTTON_DISABLED_MARK_FILE=/tmp/aimk/.button-daemon-disabled

# 코딩블록이 실행될 때, 시리얼콘솔을 중지하는데
# 중지하기 전에 현재 실행중인 시리얼 콘솔의 디바이스ID 파일을 백업해둔다.
# 코딩블록 실행을 마치면, 백업 파일을 체크해서 다시 실행한다.
ID_FILE=/home/pi/autorun/serial-console-device-current.txt
ID_FILE_BAK=/home/pi/autorun/serial-console-device-current.txt.bak

check() {
    read CHK_PID < $BLOCK_DRIVER_PID_FILE
    if [ "$CHK_PID" != "" ]; then
        if [ $(ps --pid ${CHK_PID} 2>/dev/null | grep -c ${CHK_PID} 2>/dev/null) -eq '0' ]; then
            sudo rm -f $BLOCK_DRIVER_PID_FILE
            if [ ! -f $BUTTON_DISABLED_MARK_FILE ]; then
                /usr/local/bin/aimk-button-daemon-ctl.sh start
                if [ -f $ID_FILE_BAK ]; then
                    sudo mv $ID_FILE_BAK $ID_FILE
                    /usr/local/bin/aimk-button-serial-console.sh check
                fi
            fi
        fi
    fi
}

while true; do
    if [ -r $BLOCK_DRIVER_PID_FILE ]; then
        check
    fi
    sleep 2
done
