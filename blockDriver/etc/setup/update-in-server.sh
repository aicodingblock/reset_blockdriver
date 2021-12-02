#!/usr/bin/env bash

# last changed at 2021.12.01

# 서버에서 제공하는 업데이트 스크립트다.
# 루트 권한으로 실행되는 스크립트이므로 파일복사시 주의할 것

# 현재 폴더는 /home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver/blockDriver/
WORK=/home/pi/blockcoding/kt_ai_makers_kit_block_coding_driver
TMP_UPDATE=/home/pi/.tmp.updating

if [ ! -d "$WORK/blockDriver" ];then
    echo "기존 폴더가 없어서 업데이트 할 수 없습니다."
    echo "시스템 복구가 필요합니다."
    exit 1
fi
cd $WORK/blockDriver


echo "업데이트를 확인중입니다..."

get_latest_release_version() {
  lastVersion=`curl --silent "https://api.github.com/repos/aicodingblock/reset_blockdriver/releases/latest" | # Get latest release from GitHub api
    grep '"tag_name":' |                                            # Get tag line
    sed -E 's/.*"([^"]+)".*/\1/'`                                    # Pluck JSON value
    echo $lastVersion
}

doUpdate(){
    echo "최신 버전을 찾았습니다. 업데이트를 시작합니다."
    pushd $WORK

    # 임시 폴더 생성
    rm -rf $TMP_UPDATE  tmpBlockDriver
    mkdir -p $TMP_UPDATE

    # 기존 blockDriver 백업
    mv blockDriver $TMP_UPDATE/

    # 최신 버전 받기
    git reset --hard HEAD # remove commit
    git pull
    RES=$?
    if [ $RES -ne 0 ];then
        # 이런 경우는 발생하지 않을 듯
        find $WORK -user root -exec chown -R pi:pi {} \;
        echo
        echo "================"
        echo "일부 파일이 변경되어 업데이트를 할 수 없습니다"
        echo "시스템 초기화나 복구를 실행해주세요"
        echo "================"
        echo
        echo "업데이트 실패"
        exit 1
    fi

    # 업데이트는 재설치는 아니므로, 설치된 패키지 정보를 유지한다.
    # 복사할 때 아래 파일은 제외
    mv blockDriver tmpBlockDriver
    rm tmpBlockDriver/package.json tmpBlockDriver/package-lock.json 

    # 패키지 정보외에는 덮어 씌운다
    mv $TMP_UPDATE/blockDriver .
    cp -rf tmpBlockDriver/*  blockDriver/

    # 임시 폴더 제거
    rm -rf $TMP_UPDATE tmpBlockDriver
    
    # 소유자 변경
    find $WORK -user root -exec chown -R pi:pi {} \;
    popd

    copyShortcut
}

copyShortcut(){
    cp -r ${WORK}/blockDriver/etc/desktop/* /home/pi/Desktop/
    find /home/pi/Desktop -user root -exec chown -R pi:pi {} \;
}

INGIT=`git rev-parse --is-inside-work-tree`

if [ "$INGIT" = 'true' ];then
    localVersion=`git describe --tag 2> /dev/null`
    echo Current version: $localVersion
    serverVersion=$(get_latest_release_version)
    echo Server version: $serverVersion
    if [ "$localVersion" != "$serverVersion" ];then
        doUpdate
    else
        str="현재 버전이 최신 버전입니다."
        echo $str
        exit 0
    fi
else
    echo no inGit
    exit 1
fi

# 임시 로직
echo "하드웨어 라이브러리 점검 시작"
echo "잠시만 기다려주세요..."

npm install @ktaicoder/hw-proto @ktaicoder/hw-control 2> /dev/null || true
find ./ -user root -exec chown -R pi:pi {} \;

echo "하드웨어 라이브러리 점검 완료!"
# end of 임시로직

succ="false"
SETUP_DIR=${WORK}/blockDriver/etc/setup
if [ -f ${SETUP_DIR}/setup-aimk.sh ];then
    sudo chmod +x ${SETUP_DIR}/setup-aimk.sh
    ${SETUP_DIR}/setup-aimk.sh
    if [ $? -eq 0 ];then
        succ="true"
    fi
fi

if [ "$succ" = "true" ];then
    echo "업데이트 성공"
else
    echo "업데이트 실패"
fi
