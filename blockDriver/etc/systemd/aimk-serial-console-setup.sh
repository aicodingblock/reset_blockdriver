#!/usr/bin/env bash

# last changed at 2021.12.01

# 시리얼 콘솔의 자동 설정을 위해 필요한 파일들을 복사한다.
# udev에 등록하고, USB 장착/탈착하면 aimk-serial-console.service가 실행되고
# 시리얼 콘솔 USB가 연결되었으면, serial-getty@ttyUSB0.service을 시작하고
# 그렇지 않으면 serial-getty@ttyUSB0.service을 중지시킨다.

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "${SCRIPT_DIR}"

echo "setup aimk serial console"

sudo cp aimk-serial-console.service /etc/systemd/system/
sudo cp serial-getty@ttyUSB0.service /etc/systemd/system/
sudo cp 99-aimk-serial-console.rules /etc/udev/rules.d/
sudo cp aimk-serial-console-updown.sh /home/pi/.aicodingblock/bin/aimk-serial-console-updown.sh

sudo chown pi:pi /home/pi/.aicodingblock/bin/*.sh
sudo chmod +x /home/pi/.aicodingblock/bin/*.sh

sudo systemctl daemon-reload
