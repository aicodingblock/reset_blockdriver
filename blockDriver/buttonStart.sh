#!/bin/sh

sudo mkdir -p /tmp/aimk/
sudo rm -f /tmp/aimk/.button-daemon-disabled

/usr/local/bin/aimk-button-daemon-ctl.sh start

# 콘솔모드 체크, 소리가 나므로 메시지는 표시할 필요 없음
/usr/local/bin/aimk-button-serial-console.sh check

echo "Button 실행하기 기능을 켭니다."
echo "Enter키를 누르면 종료합니다."
read _unuse
