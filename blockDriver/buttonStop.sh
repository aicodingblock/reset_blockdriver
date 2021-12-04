#!/bin/sh

sudo systemctl stop aimk_auto

# 콘솔모드 종료, 소리가 나므로 메시지는 표시할 필요 없음
/usr/local/bin/aimk-button-serial-console.sh stop

sudo killall python3

echo "Button 실행하기 기능을 끕니다...."
echo "Enter키를 누르면 종료합니다."
read _unuse
