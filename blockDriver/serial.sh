#!/usr/bin/env bash

# sudo systemctl restart serial-getty@ttyUSB0.service

# 소리가 나므로 메시지는 표시할 필요 없음
/usr/local/bin/aimk-button-serial-console.sh toggle
echo
echo
echo
echo "Enter키를 누르면 종료합니다."
echo
read _unuse

# echo "PC 연결 준비가 완료되었습니다..."
# echo "Enter키를 누르면 종료합니다."
# read choice; case "$choice" in *) exit; esac;
