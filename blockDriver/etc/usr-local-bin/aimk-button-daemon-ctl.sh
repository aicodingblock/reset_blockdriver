#!/usr/bin/env bash

MGR_PID_FILE=/tmp/aimk/button-daemon-mgr-pid

# MGR에 시작 요청하기(SIGUSR1)
start() {
    if [ -r $MGR_PID_FILE ]; then
        read mgrPid < $MGR_PID_FILE
        kill -USR1 $mgrPid 2> /dev/null
        sleep 1
    else
        exit 1
    fi
}

# MGR에 종료 요청하기(SIGUSR2)
stop() {
    if [ -r $MGR_PID_FILE ]; then
        read mgrPid < $MGR_PID_FILE
        kill -USR2 $mgrPid 2> /dev/null
        sleep 1
    else
        exit 1
    fi
}



case "$1" in
    start)
        start $2
    ;;
    stop)
        stop
    ;;
    *)
        ## If no parameters are given, print which are avaiable.
        echo "Usage: $0 {start|stop}"
        exit 1
    ;;
esac
