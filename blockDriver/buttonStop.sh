#!/bin/sh
sudo systemctl stop aimk_auto
sudo killall python3
echo "Button 실행하기 기능을 끕니다...."
echo "Enter키를 누르면 종료합니다."
read choice; case "$choice" in *) exit; esac;
