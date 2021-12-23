#!/usr/bin/env bash

# last changed at 2021.12.23

# PC 프로그램에서 코딩팩의 정보를 조회할 때 호출한다.
rp_model=$(tr < /proc/device-tree/model -d '[:cntrl:]')
echo "MODEL=${rp_model}"

rpi_v3="Raspberry Pi 3 Model B"
rpi_v3b="Raspberry Pi 3 Model B Plus Rev 1.3"
rpi_v4="Raspberry Pi 4 Model B"

case "${rp_model}" in
  *"$rpi_v4"*)
     echo "MODEL_TYPE=rp4"
     ;;
  *"$rpi_v3"*)
     echo "MODEL_TYPE=rp3"
     ;;
esac

for iface in $(LC_ALL=C nmcli -f DEVICE,STATE device status | grep connected | awk -F ' ' '{print $1}')
do
    # iface=eth0
    mac=$(tr < /sys/class/net/${iface}/address -d '[:cntrl:]')
    conn=$(LC_ALL=C nmcli  -e yes -f DEVICE,CONNECTION device status | grep -w $iface | sed 's/^[^ ]*//' | xargs)
    conn=$(echo ${conn} | grep -v '\-\-')
    ip=$(nmcli device show ${iface} | grep IP4.ADDRESS | awk -F ' ' '{print $2}' | awk -F '/' '{print $1}')
    echo "NET=${iface};${mac};${ip};${conn}"
done

disk=$(df -h | grep '/dev/root' | awk '{print $2,$3,$4,$5}')
echo "DISK=${disk}"


# cpuCount=$(grep -c processor /proc/cpuinfo)
cpuCount=$(lscpu | awk -F ':' '/CPU\(s\):/ {print $2}' | xargs)

# ex) Raspberry Pi 4 Model B Rev 1.4
cpuModel=$(awk -F ':' '/Model/ {print $2}' /proc/cpuinfo | xargs)

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

echo "CPU_COUNT=${cpuCount}"
echo "CPU_MODEL=${cpuModel}"
echo "CPU_MHZ=${cpuMHz}"
echo "CPU_ARCH=${cpuArch}"
echo "CPU_ARCH_MODEL=${cpuArchModel}"
echo "CPU_HARDWARE=${cpuHardware} (rev. ${cpuRevision})"
memTotal=$(awk -F ' ' '/MemTotal/ { print $2,$3 }' /proc/meminfo | xargs)
echo "MEMORY=${memTotal}"
