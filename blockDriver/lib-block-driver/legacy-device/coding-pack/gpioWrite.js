async function gpioWrite(socket, msg, extra) {
    const { gpio } = extra
    const { pin, value } = msg.data ?? {}
    value = value == 1 ? true : false
    gpio.write(pin, value, function (err) {
        if (err) {
            //retry
            gpio.setup(pin, gpio.DIR_OUT, function () {
                gpio.write(pin, value, function (err) {
                    if (err) {
                        console.log(`gpio write error pin:${pin} value:${value}`)
                    }
                })
            })
        }
    })
}

module.exports = { gpioWrite }
