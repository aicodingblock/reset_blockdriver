#!/usr/bin/env bash

# last changed at 2021.12.01

# udev 서비스인 aimk-serial-console.service에서 호출하는 스크립트
# root 권한으로 실행된다.
# USB에 콘솔용 시리얼이 연결되면, 콘솔 시리얼 서비스를 실행한다.
# /usr/local/bin/aimk-button-serial-console.sh를 실행한다

/usr/local/bin/aimk-button-serial-console.sh check
