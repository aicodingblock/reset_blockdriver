const config = require('../config')
const DEBUG = config.debug

function broadcastGpioEvent(io, gpio) {
    //기본 GPIO 설정
    gpio.setup(29, gpio.DIR_IN, gpio.EDGE_BOTH) //버튼 핀은 입력으로

    gpio.on('change', function (channel, value) {
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
