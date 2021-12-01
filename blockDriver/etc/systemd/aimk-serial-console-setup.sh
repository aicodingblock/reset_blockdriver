#!/usr/bin/env bash

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
