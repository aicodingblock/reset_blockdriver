#!/usr/bin/env bash

AUTO_RUN_FILE=/home/pi/autorun/url.txt

# AUTO_RUN_FILE을 생성
create() {
    echo $1 > ${AUTO_RUN_FILE}
}

# AUTO_RUN_FILE을 제거
remove() {
    sudo rm -f $AUTO_RUN_FILE
}

# AUTO_RUN_FILE을 출력
print() {
    if [ -r $AUTO_RUN_FILE ];then
        cat ${AUTO_RUN_FILE}
        exit 0
    else
        exit 1
    fi
}


case "$1" in
    create)
        create $2
    ;;
    remove)
        remove
    ;;
    print)
        print
    ;;
    *)
        ## If no parameters are given, print which are avaiable.
        echo "Usage: $0 {create|remove|print}"
        exit 1
    ;;
esac
