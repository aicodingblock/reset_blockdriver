#!/usr/bin/env bash

# last changed at 2021.12.01

# PC 프로그램에서 WIFI 목록을 로드할 때 호출한다.

sec="$1"

sudo nmcli d wifi rescan > /dev/null 2>&1  || true

[ "$sec" -ge 0 ] 2>/dev/null && sleep $sec || true;

LANG=C nmcli -c no -e no -f security,signal,ssid d wifi list | grep WPA2 | grep -v '\-\-'
