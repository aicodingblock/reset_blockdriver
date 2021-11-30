#!/usr/bin/env bash

sec="$1"

sudo nmcli d wifi rescan > /dev/null 2>&1  || true

[ "$sec" -ge 0 ] 2>/dev/null && sleep $sec || true;

LANG=C nmcli -c no -e no -f security,signal,ssid d wifi list | grep WPA2 | grep -v -- '--'
