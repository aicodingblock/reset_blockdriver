#!/bin/sh

WORK=/home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver

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

# check nodejs upgrade
reinstall_nodejs() {
    node_version=`node --version 2>/dev/null`
    echo "node=$node_version"
    if echo "$node_version" | egrep -q '^v14.'
    then
        echo "nodejs version check ok"
        return
    fi
    echo "nodejs upgrade required"
    echo "start nodejs reinstall"
    sudo apt purge -y nodejs nodejs.*
    sudo rm -f /etc/apt/sources.list.d/nodesource.list /usr/share/keyrings/nodesource.gpg
    sudo apt -y update
    curl -sSL https://deb.nodesource.com/setup_14.x | sudo bash -
    sudo apt install -y nodejs
    sudo npm install -g yarn
    echo "nodejs install finished"
}

reinstall_nodejs

touch ${WORK}/.upgrading

cd ${WORK}/blockDriver
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

# chown pi
find ${WORK} -user root -exec chown -R pi:pi {} \;

sudo cp -r ${WORK}/blockDriver/etc/desktop/* /home/pi/Desktop/
sudo chown -R pi:pi ${WORK}/amk /home/pi/Desktop/
sudo cp -r ${WORK}/amk/* /home/pi/ai-makers-kit/python3/
find /home/pi/ai-makers-kit/python3 -user root -exec chown -R pi:pi {} \;

mkdir -p key
npm install

cd /home/pi
sudo apt-get install -y autoconf

rm -rf /home/pi/pi-blaster
git clone https://github.com/sarfata/pi-blaster.git
cd /home/pi/pi-blaster/
./autogen.sh
./configure
make
sudo ./pi-blaster

echo "${NOW}" > ${WORK}/.upgrade-completed
rm -f ${WORK}/.upgrading

echo "system reset success!"
sleep 1
sudo reboot
