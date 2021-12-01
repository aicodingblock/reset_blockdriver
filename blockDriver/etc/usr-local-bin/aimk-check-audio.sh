#!/usr/bin/env bash

# last changed at 2021.12.01

# PC 프로그램에서 오디오 점검할 때 호출한다.

cd /home/pi/.aicodingblock/bin

TMPDIR="/home/pi/Music"
TEST_SOUND="/home/pi/.aicodingblock/bin/sample_sound.wav"
TEMP_WAV="/home/pi/Music/.test.wav"

echo "[오디오 기능 점검]"
echo "> 재생 기능을 점검합니다."
sleep 1

aplay -q -D plughw:0 $TEST_SOUND
sleep 1

echo "> 방금 소리를 들으셨나요?"
sleep 1

echo
echo
echo "> 이제 녹음 기능을 점검합니다"
sleep 1

echo "> 2초 후에 녹음을 시작합니다"
sleep 1
echo "> 1초 후에 녹음을 시작합니다"
sleep 1

sudo rm -f ${TEMP_WAV}

echo
echo
echo "> 지금부터 5초간 녹음을 시작합니다."
echo "> 지금 소리를 내주세요."
sleep 1
arecord -q -D plughw:0 -d 5 -c2 -r 48000 -f S16_LE -t wav $TEMP_WAV
echo
echo
echo "> 녹음을 마쳤습니다"
sleep 1

echo "> 이제 녹음된 소리를 재생합니다"
sleep 1

aplay -q ${TEMP_WAV}
rm -f ${TEMP_WAV}
echo "> 방금 녹음된 소리를 들으셨나요?"
sleep 1
echo
echo
echo "> 오디오 점검 기능을 종료합니다"
