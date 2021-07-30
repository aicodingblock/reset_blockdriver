#!/bin/sh
rpi_v3="Raspberry Pi 3 Model B"
rpi_v3b="Raspberry Pi 3 Model B Plus Rev 1.3"
rpi_v4="Raspberry Pi 4 Model B"


cd /home/pi/blockcoding
sudo rm -rf kt_ai_makers_kit_block_coding_driver/
git clone -b release --single-branch https://github.com/aicodingblock/reset_blockdriver.git kt_ai_makers_kit_block_coding_driver
cd kt_ai_makers_kit_block_coding_driver/blockDriver/

if [ "${rpi_v3}" = "Raspberry Pi 3 Model B" ]; then
  echo "Raspberry Pi 3 Model B"
  cp /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package_rpi3.json /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package.json
elif [ "${rpi_v3b}" = "Raspberry Pi 3 Model B Plus Rev 1.3" ]; then
  echo "Raspberry Pi 3 Model B +"
  cp /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package_rpi3.json /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package.json
elif [ "${rpi_v4}" = "Raspberry Pi 4 Model B" ]; then
  echo "Raspberry Pi 4 Model B"
  cp /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package_rpi4.json /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/package.json
else
  echo "Not Defined Raspberry PI Model ..."
fi

cp -r /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/etc/desktop/* /home/pi/Desktop/
sudo chown -R pi:pi /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/amk
cp -r /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/amk/* /home/pi/ai-makers-kit/python3/

if [ "${rpi_v4}" = "Raspberry Pi 4 Model B" ]; then
  echo "Copy Raspberry Pi 4 Model B BlockDriver... "
  cp /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/bd_reset.js /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/blockDriver.js
fi

mkdir key
npm install
