async function gpioMode(socket, msg, extra) {
    const { gpio } = extra
    const { pin, mode } = msg.data ?? {}
    if (mode == 1) {
        // INPUT
        gpio.setup(pin, gpio.DIR_IN, gpio.EDGE_BOTH) //버튼 핀은 입력으로
        console.log('set gpio input mode: pin:' + pin)
    } else {
        //OUTPUT
        gpio.setup(pin, gpio.DIR_OUT) //버튼 핀은 입력으로
        console.log('set gpio output mode: pin:' + pin)
    }
}

module.exports = { gpioMode }
