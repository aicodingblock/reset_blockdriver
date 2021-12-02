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

# 임시 폴더에서 업데이트 스크립트 실행
WORK=/home/pi/.aicodingblock/.codingpack-update
rm -rf $WORK
mkdir -p $WORK
cd $WORK

echo "최신 업데이트 코드를 받습니다."

curl -kfsSL https://aicodingblock.kt.co.kr/update/update.sh -o update.sh && chmod +x ./update.sh && ./update.sh

rm -rf $WORK

echo "업데이트를 종료합니다. 아무키나 입력해 주세요"
read var
