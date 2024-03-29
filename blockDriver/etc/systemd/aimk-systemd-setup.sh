#!/usr/bin/env bash

# last changed at 2021.12.01

# 시리얼 콘솔의 자동 설정을 위해 필요한 파일들을 복사한다.
# udev에 등록하고, USB 장착/탈착하면 aimk-serial-console.service가 실행되고
# 시리얼 콘솔 서비스인 serial-getty@ttyUSB0.service의
# 실행 여부를 판단한다. 최종적으로 /usr/local/bin/button-serial-console.sh가 실행된다.

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "${SCRIPT_DIR}"

echo "setup aimk serial console"

sudo cp aimk-serial-console.service /etc/systemd/system/
sudo cp serial-getty@ttyUSB0.service /etc/systemd/system/

sudo cp 99-aimk-serial-console.rules /etc/udev/rules.d/
sudo cp aimk-serial-console-updown.sh /home/pi/.aicodingblock/bin/


# aimk auto는 제거
# echo "setup aimk auto"
# sudo cp aimk_auto.service /lib/systemd/system/
if [ -f /lib/systemd/system/aimk_auto.service ]; then
    sudo systemctl stop aimk_auto || true
    sudo systemctl disable aimk_auto || true
    sudo rm -f /lib/systemd/system/aimk_auto.service
fi


echo "setup aimk daemon mgr"
sudo cp aimk-daemon-mgr.service /etc/systemd/system/
sudo cp aimk-daemon-mgr.sh /home/pi/.aicodingblock/bin/

echo "setup aimk button daemon mgr"
sudo cp aimk-button-daemon-mgr.sh /home/pi/.aicodingblock/bin/

sudo chown pi:pi /home/pi/.aicodingblock/bin/*.sh
sudo chmod +x /home/pi/.aicodingblock/bin/*.sh

sudo systemctl daemon-reload
sudo systemctl enable aimk-daemon-mgr
sudo systemctl restart aimk-daemon-mgr
