#!/bin/sh

cd /home/pi/blockcoding
sudo rm -rf kt_ai_makers_kit_block_coding_driver/
git clone -b release --single-branch https://github.com/aicodingblock/reset_blockdriver.git kt_ai_makers_kit_block_coding_driver
cd kt_ai_makers_kit_block_coding_driver/blockDriver/
cp -r /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/etc/desktop/* /home/pi/Desktop/
sudo chown -R pi:pi /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/amk
cp -r /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/amk/* /home/pi/ai-makers-kit/python3/
cp /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/bd_reset.js ./blockDriver.js
mkdir key
npm install
