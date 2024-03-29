#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Date:2019.02.18
Example 8: 음성인식 TTS 대화 결합 예제
"""

from __future__ import print_function

import time

import MicrophoneStream as MS
import ex1_kwstest as kws
import ex6_queryVoice as dss


def main():
    # Example8 KWS+STT+DSS

    KWSID = ['기가지니', '지니야', '친구야', '자기야']
    while 1:
        recog = kws.test(KWSID[0])
        if recog == 200:
            print('KWS Dectected ...\n')
            dss_answer = dss.queryByVoice()
            if dss_answer == '':
                print('질의한 내용이 없습니다.\n\n\n')
            else:
                MS.play_file("result_mesg.wav")
            time.sleep(2)
        else:
            print('KWS Not Dectected ...')


if __name__ == '__main__':
    main()
