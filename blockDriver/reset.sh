#!/bin/sh

WORK=/home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver
# BRANCH=release
BRANCH=dev

set -e 

NOW=`date +"%G%m%d%H%M%S"`

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

rpi_v3="Raspberry Pi 3 Model B"
rpi_v3b="Raspberry Pi 3 Model B Plus Rev 1.3"
rpi_v4="Raspberry Pi 4 Model B"

board_model=$(cat /proc/device-tree/model)
echo $board_model

touch ${WORK}/.upgrading

cd /home/pi/blockcoding
sudo rm -rf kt_ai_makers_kit_block_coding_driver/
git clone -b ${BRANCH} --depth=1 --single-branch https://github.com/aicodingblock/reset_blockdriver.git kt_ai_makers_kit_block_coding_driver
cd ${WORK}/blockDriver
chmod +x *.sh
./do_reset.sh
