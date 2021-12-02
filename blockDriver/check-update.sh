#!/usr/bin/env bash

check_internet(){
    echo "checking internet..."
    if ping -q -c 1 -W 1 github.com >/dev/null; then
        echo "internet connectivity ok"
    else
        echo "인터넷 연결을 확인해주세요"
        read _unused
        exit 1
    fi
}

check_internet

echo "최신 업데이트 코드를 받습니다."

curl -kfsSL https://aicodingblock.kt.co.kr/update/update.sh | sudo bash

echo "업데이트를 종료합니다. 아무키나 입력해 주세요"
read var
