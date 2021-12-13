const { BehaviorSubject, timer, take, NEVER, skip, switchMap, tap, filter } = require('rxjs')
const { execQuietlyAsync } = require('./process-utils')
const config = require('../config')
const DEBUG = config.debug

// 4초 동안 버튼을 누르고 있으면 코딩블록을 강제 종료한다.
const KILL_TRIGGER_TIME_MS = 4000

/**
 * 29번핀 눌림 상태 감지
 */
class Button29PressDetector {
    // 버튼을 누른 시점의 시간을 발행한다.
    _lastPressDownAt$ = new BehaviorSubject(0)

    // 버튼에서 손을 뗐을 때, 눌린 시간을 발행한다.
    _lastPressUp$ = new BehaviorSubject(0)

    observePressDownAt = () => {
        return this._lastPressDownAt$.pipe(skip(1))
    }

    observePressUpDuration = () => {
        return this._lastPressUp$.pipe(skip(1))
    }

    onChange = (buttonUp) => {
        if (buttonUp) {
            if (this._lastPressDownAt$.value === 0) {
                console.log('ignore pressUp, not ready')
                return
            }

            let diff = Date.now() - this._lastPressDownAt
            this._lastPressDownAt$.next(0)
            this._lastPressUp$.next(diff)
        } else {
            this._lastPressDownAt$.next(Date.now())
        }
    }
}

const dieDetector = new Button29PressDetector()
dieDetector.observePressDownAt()
    .pipe(
        switchMap((at) => at === 0 ? NEVER : timer(KILL_TRIGGER_TIME_MS)),
        take(1),
    ).subscribe(() => {
        console.log('stop codingblock, aimk-kill-coding-block.sh')
        execQuietlyAsync('aimk-kill-coding-block.sh')
    })

function broadcastGpioEvent(io, gpio) {
    //기본 GPIO 설정
    gpio.setup(29, gpio.DIR_IN, gpio.EDGE_BOTH) //버튼 핀은 입력으로
    gpio.on('change', function (channel, value) {
        if (channel === 29) dieDetector.onChange(value)

        //29번 핀에 변화가 있는 경우
        if (channel === 29 && value === false) {
            //console.log("Button Clicked!");
            io.sockets.emit('receiveData', {
                Type: 'ktaimk_button_push',
                Data: { ret: true },
            })
            //return;
        }

        if (typeof value === 'boolean') {
            console.log(`Boolean Type Vaule --- gpio Read Pin:${channel} Value:${value}`)
        } else if (typeof value === 'number') {
            console.log(`Number Type Value gpio Read Pin:${channel} Value:${value}`)
            value = value.toString()
        } else if (typeof value === 'string') {
            console.log(` String Type Vaule --- gpio Read Pin:${channel} Value:${value}`)
        } else if (value === null) {
            console.log(`gpio Read Data Empty..... --- gpio Read Pin:${channel} Value:${value}`)
        } else {
            console.log(`NaN Type Value --- gpio Read Pin:${channel} Value:${value}`)
        }

        io.sockets.emit('receiveData', { Type: 'ktaimk_gpio_data', Data: { pin: channel, value } })
    })
}


module.exports = {
    broadcastGpioEvent
}
