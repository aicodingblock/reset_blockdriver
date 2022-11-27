#!/bin/sh

WORK=/home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver
BRANCH=release

set -e 

check_internet(){
    echo "checking internet..."
    if ping -q -c 1 -W 1 google.com >/dev/null; then
        echo "internet connectivity ok"
    else
        echo "인터넷 연결을 확인해주세요"
        read _unused
        exit 1
    fi
}

check_internet

cd /home/pi/blockcoding
sudo rm -rf kt_ai_makers_kit_block_coding_driver/
git clone -b ${BRANCH} --depth=1 --single-branch https://github.com/aicodingblock/reset_blockdriver.git kt_ai_makers_kit_block_coding_driver

echo "copy inside_python3"
cp -rf ${WORK}/inside_python3 /home/pi/ai-makers-kit/
sudo find /home/pi/ai-makers-kit/inside_python3 -user root -exec chown -R pi:pi {} \;

cd ${WORK}/blockDriver
sudo chmod +x *.sh

./do_reset.sh
