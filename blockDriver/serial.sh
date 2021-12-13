#!/usr/bin/env bash

# sudo systemctl restart serial-getty@ttyUSB0.service

SERVICE=serial-getty@ttyUSB0.service

/usr/local/bin/aimk-button-daemon-ctl.sh start

# 콘솔모드 토글, 소리가 나므로 메시지는 표시할 필요 없음
/usr/local/bin/aimk-button-serial-console.sh start

if systemctl is-active ${SERVICE} >/dev/null; then
    echo "콘솔 모드가 실행되었습니다."
else
    echo "콘솔 모드가 종료되었습니다."
fi

echo
echo "Enter키를 누르면 종료합니다."
read _unuse

# echo "PC 연결 준비가 완료되었습니다..."
# echo "Enter키를 누르면 종료합니다."
# read choice; case "$choice" in *) exit; esac;
