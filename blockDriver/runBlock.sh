#!/usr/bin/env bash

/usr/local/bin/aimk-button-daemon-ctl.sh stop
sudo modprobe bcm2835-v4l2

# count=$(find /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/key/ -maxdepth 1 -type f -name 'clientKey.json'| wc -l)
START_PAGE=$1

if [ -z "${START_PAGE}" ];then
    START_PAGE=https://aicodingblock.kt.co.kr/
fi

echo "AI 코딩블럭을 시작합니다.";

setsid /usr/bin/chromium-browser --profile-directory=Default ${START_PAGE}  > /dev/null 2>&1 &
sudo node /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/blockDriver.js
