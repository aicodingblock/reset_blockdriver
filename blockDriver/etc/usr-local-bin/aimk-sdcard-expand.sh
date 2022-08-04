#!/usr/bin/env bash

# last changed at 2022.08.04
# 바탕화면의 SD카드 확장 버튼을 클릭할 때 실행된다.
# SD카드를 확장한 후에 재부팅한다.

echo "SD카드를 확장합니다"
echo "부팅 후 한번만 실행하시면 됩니다"
sleep 2

sudo raspi-config --expand-rootfs


echo "SD카드를 확장했습니다"
echo "재부팅합니다"
sleep 2
sudo reboot
