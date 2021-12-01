#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "${SCRIPT_DIR}"

## for serial console
bash ../systemd/aimk-serial-console-setup.sh 

echo "copy aimk scripts to /usr/local/bin"

## for /usr/local/bin 
sudo cp ../usr-local-bin/* /usr/local/bin/

## chmod scripts for aimk prefix
sudo chmod +x /usr/local/bin/aimk*.sh
