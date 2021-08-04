#!/bin/sh
rpi_v3="Raspberry Pi 3 Model B"
rpi_v3b="Raspberry Pi 3 Model B Plus Rev 1.3"
rpi_v4="Raspberry Pi 4 Model B"

board_model=$(cat /proc/device-tree/model)
echo $board_model

cd /home/pi/blockcoding
sudo rm -rf kt_ai_makers_kit_block_coding_driver/
git clone -b release --single-branch https://github.com/aicodingblock/reset_blockdriver.git kt_ai_makers_kit_block_coding_driver
cd kt_ai_makers_kit_block_coding_driver/blockDriver/
check

case "${board_model}" in
  *"$rpi_v4"*)
     echo "Find Board Model: Raspberry Pi 4"
     cp /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package_rpi4.json /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package.json
     cp /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/ozolib3_7.so /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/ozolib.so
     #cp /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/bd_reset.js /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/blockDriver.js
     ;;
  *"$rpi_v3"*)
     echo "Find Board Model: Rasberry Pi 3"
     cp /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package_rpi3.json /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package.json
     ;;
esac

cp -r /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/etc/desktop/* /home/pi/Desktop/
sudo chown -R pi:pi /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/amk
cp -r /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/amk/* /home/pi/ai-makers-kit/python3/

mkdir key
npm install
