#!/usr/bin/env bash

BRANCH=release

set -e 

NOW=`date +"%G%m%d%H%M%S"`

check_internet(){
    echo "checking internet..."
    if ping -q -c 1 -W 1 google.com >/dev/null; then
        echo "internet connectivity ok"
    else
        echo "인터넷 연결을 확인해주세요"
        read _unused
        exit 1
    fi
}

check_internet

RESCUE=/home/pi/.tmp.rescue

rm -rf $RESCUE
mkdir $RESCUE
cd $RESCUE

curl --silent -O https://raw.githubusercontent.com/aicodingblock/reset_blockdriver/${BRANCH}/blockDriver/reset.sh
chmod +x reset.sh

./reset.sh
