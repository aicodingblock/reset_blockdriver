#!/usr/bin/env bash

# last changed at 2022.08.03

# 코딩팩 배포 직전에 Private 정보를 삭제하는 스크립트

echo 
echo "-----------------------------"
echo "pi 사용자의 Private 정보를 삭제합니다."
echo "-----------------------------"
echo

echo "* pi 사용자 비밀번호를 초기화합니다"
echo 'pi:kt123!@#' | sudo chpasswd
echo 'root:kt123!@#' | sudo chpasswd

echo "* 다운로드 받은 clientKey 파일을 삭제합니다"
rm -rf /home/pi/Downloads/* /home/pi/Music/* /home/pi/Videos/* /home/pi/Public/* /home/pi/Templates/*

echo "* 오토런을 삭제합니다"
rm -f /home/pi/autorun/serial-console-device-current* /home/pi/autorun/url* 

echo "* user_auth.py의 키정보를 제거합니다"
sed -i "s;CLIENT_ID[[:space:]]*=.*$;CLIENT_ID = '';" /home/pi/ai-makers-kit/python3/user_auth.py
sed -i "s;CLIENT_KEY[[:space:]]*=.*$;CLIENT_KEY = '';" /home/pi/ai-makers-kit/python3/user_auth.py
sed -i "s;CLIENT_SECRET[[:space:]]*=.*$;CLIENT_SECRET = '';" /home/pi/ai-makers-kit/python3/user_auth.py

echo "* chromium-browser의 캐시를 삭제합니다"
rm -rf /home/pi/.cache/chromium /home/pi/.config/chromium

echo "* 기타 파일들을 삭제합니다"
rm -f /home/pi/.bash_history  /home/pi/.python_history /home/pi/.local/share/recently-used.xbel
rm -rf /home/pi/.local/share/nano

sudo rm -f  /root/.bash_history  /root/.python_history
sudo rm -rf /root/.local/share/nano

echo "* wifi 설정을 삭제합니다"
sudo rm  -f /etc/NetworkManager/system-connections/*

echo "* 휴지통을 비웁니다"
rm -rf ~/.local/share/Trash/

echo "* 명령어 히스토리를 삭제합니다"
history -c

echo
echo "pi 사용자의 개인정보를 삭제했습니다."
echo
echo "마지막 단계: 브라우저의 홈페이지를 codiny.com으로 변경해주세요"
echo "마지막 단계: root로 로그인하여 명령어 history를 삭제해주세요"
