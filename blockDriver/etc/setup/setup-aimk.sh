#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "${SCRIPT_DIR}"

WORK=/home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver
ETC=$WORK/blockDriver/etc

## for serial console
bash ${ETC}/systemd/aimk-serial-console-setup.sh 

echo "copy aimk scripts to /usr/local/bin"

## for /usr/local/bin 
sudo cp ${ETC}/usr-local-bin/* /usr/local/bin/

## chmod scripts for aimk prefix
sudo chmod +x /usr/local/bin/aimk*.sh

# copy desktop files
echo "copy desktop files"
sudo cp -r ${ETC}/desktop/* /home/pi/Desktop/
sudo chown -R pi:pi /home/pi/Desktop/

echo
echo "=========================="
echo "aimk script setup finished"
echo "=========================="
echo