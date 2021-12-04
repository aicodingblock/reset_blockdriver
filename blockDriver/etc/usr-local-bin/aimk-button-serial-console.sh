#!/bin/sh

ID_FILE=/home/pi/autorun/serial-console-device-current.txt
SERVICE=serial-getty@ttyUSB0.service
SOUND_START=/home/pi/autorun/py_script/data/console_mode_start.wav
SOUND_STOP=/home/pi/autorun/py_script/data/console_mode_stop.wav
SOUND_NO_CABLE=/home/pi/autorun/py_script/data/no_cable.wav


# start는 ID_FILE 파일을 만들고, 서비스를 시작한다.
start(){
    if [ ! -r /dev/ttyUSB0 ];then
        aplay -q ${SOUND_NO_CABLE} &
        exit 1
    fi
    
    DEVICE_ID=`udevadm info /dev/ttyUSB0 | grep 'ID_SERIAL=' | awk -F'=' '{print $2}'`
    if [ -z "$DEVICE_ID" ];then
        exit 1
    fi
    
    sudo echo $DEVICE_ID > $ID_FILE
    if ! systemctl is-active ${SERVICE} >/dev/null; then
        sudo systemctl start ${SERVICE}
    fi
    systemctl is-active ${SERVICE}
    aplay -q ${SOUND_START} &
}

stop() {
    rm -f $ID_FILE
    if systemctl is-active ${SERVICE} >/dev/null; then
        sudo systemctl stop ${SERVICE}
        aplay -q ${SOUND_STOP} &
    fi
    
    systemctl is-active ${SERVICE}
    
}

# ttyUSB0가 없는 경우는 자동으로 중지되므로 무시해도 된다.
# ttyUSB0가 없다고, ID_FILE을 지우지 않는다. 나중에 다시 연결할 수도 있으므로
# ID_FILE이 없다면 무시하고 리턴한다.
# ttyUSB0와 ID_FILE의 ID가 동일하지 않으면 중지한다.(다른 USB를 꽂은 경우이다)
# ttyUSB0와 ID_FILE의 ID가 동일하면 서비스를 시작한다.
check() {
    if [ ! -r /dev/ttyUSB0 ];then
        # echo "ttyUSB0 not exists"
        exit 1
    fi
    
    if [ ! -r $ID_FILE ];then
        # echo "ID_FILE not exists"
        exit 1
    fi
    read devId < $ID_FILE
    if [ -z "$devId" ];then
        # echo "ID_FILE empty"
        exit 1
    fi
    
    DEVICE_ID=`udevadm info /dev/ttyUSB0 | grep 'ID_SERIAL=' | awk -F'=' '{print $2}'`
    if [ "$devId" != "$DEVICE_ID" ];then
        if systemctl is-active ${SERVICE} >/dev/null; then
            sudo systemctl stop ${SERVICE}
        fi
        rm -f $ID_FILE
        aplay -q ${SOUND_STOP} # foreground play
    else
        if ! systemctl is-active ${SERVICE} >/dev/null; then
            sudo systemctl start ${SERVICE}
        fi
        aplay -q ${SOUND_START} # foreground play
    fi
    systemctl is-active ${SERVICE}
}


toggle() {
    if [ -r $ID_FILE ];then
        stop
    else
        start
    fi
}


case "$1" in
    start)
        start
    ;;
    stop)
        stop
    ;;
    toggle)
        toggle
    ;;
    check)
        check
    ;;
    *)
        ## If no parameters are given, print which are avaiable.
        echo "Usage: $0 {start|stop|check|toggle}"
        exit 1
    ;;
esac
