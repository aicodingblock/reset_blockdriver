#!/usr/bin/env bash

# last changed at 2021.12.12

# aimk_auto.service는 GPIO 버튼 데몬 서비스인데, 더이상 사용하지 않는다.
# /etc/xdg/lxsession/LXDE-pi/autostart 에서 aimk-button-daemon-mgr.sh을 실행하여 GPIO 버튼 데몬을 관리한다.
# 이렇게 하는 이유는 브라우저를 띄워야 하기 때문이다.
# aimk_auto systemd에서 브라우저를 띄우는 작업을 실패했다.
# xdg 시작할 때 실행되는 프로그램으로 직접 데몬을 관리하도록 변경했다.

CHILD_PID=""

start_daemon(){
    echo "start"
    alreadyRun='false'
    if [ ! -z "${CHILD_PID}" ]; then
        if [ $(ps --pid ${CHILD_PID} 2>/dev/null | grep -c ${CHILD_PID} 2>/dev/null) -gt '0' ]; then
            alreadyRun='true'
        fi
    fi
    
    if [ "${alreadyRun}" != "true" ];then
        setsid python3 /home/pi/autorun/py_script/python3/button_trigger_4share3.py > /dev/null &
        CHILD_PID=$!
        echo "button daemon started"
    else
        echo "button daemon already running"
    fi
}

stop_daemon(){
    echo "stop $CHILD_PID"
    if [ ! -z "${CHILD_PID}" ]; then
        kill -9 $CHILD_PID
        echo "button daemon stopped"
    else
        echo "button daemon already stopped"
    fi
    CHILD_PID=""
}

MGR_PID=$$
sudo mkdir -p /tmp/aimk
echo $MGR_PID | sudo tee -a /tmp/aimk/button-daemon-mgr-pid

trap start_daemon SIGUSR1
trap stop_daemon  SIGUSR2

start_daemon

while true;
do
    sleep 1
done
