#!/usr/bin/env bash

# last changed at 2022.07.29

# 바탕화면의 모델 정보 버튼을 클릭할 때 실행된다.
# 하드웨어 정보를 출력한다.
rp_model=$(tr < /proc/device-tree/model -d '[:cntrl:]')
echo
echo "모델: ${rp_model}"

for iface in $(LC_ALL=C nmcli -f DEVICE,STATE device status | grep connected | awk -F ' ' '{print $1}')
do
    # iface=eth0
    if [ -f /sys/class/net/${iface}/address ];then
        mac=$(tr < /sys/class/net/${iface}/address -d '[:cntrl:]')
        conn=$(LC_ALL=C nmcli  -e yes -f DEVICE,CONNECTION device status | grep -w $iface | sed 's/^[^ ]*//' | xargs)
        ip=$(nmcli device show ${iface} | grep IP4.ADDRESS | awk -F ' ' '{print $2}' | awk -F '/' '{print $1}')
        echo "네트워크: ${iface}, ${mac}, ${ip}"
    fi
done

disk=$(df -h | grep '/dev/root' | awk '{print $2}')
echo "SD카드 전체 용량: ${disk}"
disk=$(df -h | grep '/dev/root' | awk '{print $4}')
echo "SD카드 남은 용량: ${disk}"

memTotal=$(awk -F ' ' '/MemTotal/ { print $2,$3 }' /proc/meminfo | xargs)
echo "메모리: ${memTotal}"

# cpuCount=$(grep -c processor /proc/cpuinfo)
cpuCount=$(lscpu | awk -F ':' '/CPU\(s\):/ {print $2}' | xargs)

# ex) BCM2835 
cpuHardware=$(awk -F ':' '/Hardware/ {print $2}' /proc/cpuinfo | xargs)

# ex) c03114
cpuRevision=$(awk -F ':' '/Revision/ {print $2}' /proc/cpuinfo | xargs)

# ex) 1500.000
cpuMHz=$(lscpu | awk -F ':' '/CPU max MHz:/ {print $2}' | xargs)

# ex) armv7l
cpuArch=$(lscpu | awk -F ':' '/Architecture:/ {print $2}' | xargs)

# ex) Cortex-A72
cpuArchModel=$(lscpu | awk -F ':' '/Model name:/ {print $2}' | xargs)

echo 
echo "CPU 코어수: ${cpuCount}"
echo "CPU 성능: ${cpuMHz} MHz"
echo "CPU 아키텍처: ${cpuArchModel} (${cpuArch})"
echo "CPU 하드웨어: ${cpuHardware} (rev. ${cpuRevision})"
echo

echo 'press any key to exit'
read _unuse
