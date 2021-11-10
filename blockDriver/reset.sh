#!/bin/sh

WORK=/home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver
# BRANCH=release
BRANCH=dev

rpi_v3="Raspberry Pi 3 Model B"
rpi_v3b="Raspberry Pi 3 Model B Plus Rev 1.3"
rpi_v4="Raspberry Pi 4 Model B"

board_model=$(cat /proc/device-tree/model)
echo $board_model

# check nodejs upgrade
reinstall_nodejs() {
    node_version=`node --version || true`
    echo "node=$node_version"
    if echo "$node_version" | egrep -q '^v14.'
    then
        echo "nodejs version ok. (${node_version})"
        return
    fi  
    echo "nodejs upgrade required.(current version is ${node_version})"
    echo "start nodejs reinstall"
    sudo apt purge -y nodejs nodejs.*
    sudo rm -f /etc/apt/sources.list.d/nodesource.list /usr/share/keyrings/nodesource.gpg
    curl -sSL https://deb.nodesource.com/setup_14.x | sudo bash -
    sudo apt install -y nodejs
}

reinstall_nodejs

cd /home/pi/blockcoding
sudo rm -rf kt_ai_makers_kit_block_coding_driver/
git clone -b ${BRANCH} --depth=1 --single-branch https://github.com/aicodingblock/reset_blockdriver.git kt_ai_makers_kit_block_coding_driver
cd kt_ai_makers_kit_block_coding_driver/blockDriver/
chmod +x *.sh

case "${board_model}" in
  *"$rpi_v4"*)
     echo "Find Board Model: Raspberry Pi 4"
     cp ${WORK}/blockDriver/package_rpi4.json ${WORK}/blockDriver/package.json
     cp ${WORK}/blockDriver/ozolib3_7.so ${WORK}/blockDriver/ozolib.so
     #cp ${WORK}/blockDriver/bd_reset.js ${WORK}/blockDriver/blockDriver.js
     ;;
  *"$rpi_v3"*)
     echo "Find Board Model: Rasberry Pi 3"
     cp ${WORK}/blockDriver/package_rpi3.json ${WORK}/blockDriver/package.json
     ;;
esac

sudo cp -r ${WORK}/blockDriver/etc/desktop/* /home/pi/Desktop/
sudo chown -R pi:pi ${WORK}/amk /home/pi/Desktop/
cp -r ${WORK}/amk/* /home/pi/ai-makers-kit/python3/

mkdir key
npm install

cd /home/pi
sudo apt-get install -y autoconf
git clone https://github.com/sarfata/pi-blaster.git
cd /home/pi/pi-blaster/
./autogen.sh
./configure
make
sudo ./pi-blaster
sudo reboot