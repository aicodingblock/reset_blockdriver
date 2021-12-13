#!/usr/bin/env bash

# last changed at 2021.12.01

# 코딩팩에 필요한 스크립트나 설정 파일들을 복사한다.
# 코딩팩 업데이트할 때와 시스템 초기화 시에 호출한다.
# 코딩팩 업데이트는 가벼운 복사의 개념이므로
# 설치하는 기능은 포함하지 않는 것이 좋다.

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "${SCRIPT_DIR}"

WORK=/home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver
ETC=$WORK/blockDriver/etc

## for serial console
bash ${ETC}/systemd/aimk-systemd-setup.sh

## 콘솔모드가 적용된 버튼 트리거 파이썬
sudo cp ${ETC}/autorun/button_trigger_4share3.py /home/pi/autorun/py_script/python3/
sudo cp ${ETC}/autorun/*.wav /home/pi/autorun/py_script/data/

echo "setup aimk xdg autostart"
sudo cp ${ETC}/xdg/autostart /etc/xdg/lxsession/LXDE-pi/

# 라파3의 autostart 위치에도 복사
if [ -r /home/pi/.config/lxsession/LXDE-pi/autostart ];then
    cp ${ETC}/xdg/autostart /home/pi/.config/lxsession/LXDE-pi/
fi

echo "copy aimk scripts to /usr/local/bin"
sudo cp ${ETC}/usr-local-bin/* /usr/local/bin/

## chmod scripts for aimk prefix
sudo chmod +x /usr/local/bin/*.sh

# copy desktop files
echo "copy desktop files"
sudo cp -r ${ETC}/desktop/* /home/pi/Desktop/
sudo chown -R pi:pi /home/pi/Desktop/

echo
echo "=========================="
echo "aimk script setup finished"
echo "=========================="
echo
