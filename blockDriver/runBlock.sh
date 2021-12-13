#!/usr/bin/env bash

ID_FILE=/home/pi/autorun/serial-console-device-current.txt
ID_FILE_BAK=/home/pi/autorun/serial-console-device-current.txt.bak


# 시리얼 콘솔 디바이스ID가 등록되어 있다면 백업한다
sudo rm -f $ID_FILE_BAK
if [ -f $ID_FILE ]; then
    sudo mv $ID_FILE $ID_FILE_BAK
fi

# 시리얼 콘솔 중지
/usr/local/bin/aimk-button-serial-console.sh stop || true

# 버튼 데몬 중지
/usr/local/bin/aimk-button-daemon-ctl.sh stop || true

sudo modprobe bcm2835-v4l2

# count=$(find /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/key/ -maxdepth 1 -type f -name 'clientKey.json'| wc -l)
START_PAGE=$1

if [ -z "${START_PAGE}" ];then
    START_PAGE=https://aicodingblock.kt.co.kr/
fi

echo "AI 코딩블럭을 시작합니다.";

setsid /usr/bin/chromium-browser \
    --profile-directory=Default \
    --autoplay-policy=no-user-gesture-required \
    ${START_PAGE}  > /dev/null 2>&1 &

sudo node /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/blockDriver.js
