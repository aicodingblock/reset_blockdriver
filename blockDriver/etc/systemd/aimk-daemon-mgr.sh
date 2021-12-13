#!/usr/bin/env bash

# last changed at 2021.12.01

# aimk-daemon-mgr는 블록코딩을 하는 동안 aimk_auto 데몬이 kill되는데 ,
# 블록코딩을 마친 후에 aimk-button-daemon을 자동으로 재시작하는 용도이다.

BLOCK_DRIVER_PID_FILE=/var/run/aimk/blockDriver.pid
BUTTON_DISABLED_MARK_FILE=/tmp/aimk/.button-daemon-disabled

check() {
    read CHK_PID <$BLOCK_DRIVER_PID_FILE
    if [ "$CHK_PID" != "" ]; then
        if [ $(ps --pid ${CHK_PID} 2>/dev/null | grep -c ${CHK_PID} 2>/dev/null) -eq '0' ]; then
            sudo rm -f $BLOCK_DRIVER_PID_FILE
            if [ ! -f $BUTTON_DISABLED_MARK_FILE ]; then
                /usr/local/bin/aimk-button-daemon-ctl.sh start
            fi
        fi
    fi
}

while true; do
    if [ -r $BLOCK_DRIVER_PID_FILE ]; then
        check
    fi
    sleep 3
done
