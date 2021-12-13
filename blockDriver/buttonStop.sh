#!/bin/sh

sudo mkdir -p /tmp/aimk/
sudo touch /tmp/aimk/.button-daemon-disabled

/usr/local/bin/aimk-button-daemon-ctl.sh stop

# 콘솔모드 종료, 소리가 나므로 메시지는 표시할 필요 없음
/usr/local/bin/aimk-button-serial-console.sh stop

sudo killall python3 2> /dev/null

echo "Button 실행하기 기능을 끕니다."
echo "Enter키를 누르면 종료합니다."
read _unuse
