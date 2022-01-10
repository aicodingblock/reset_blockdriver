async function gpioWrite(socket, msg, extra) {
    const { gpio } = extra;
    const { pin, value = 0} = msg.data ?? {};

    if(typeof pin === 'undefined') {
        console.log('gpio write invalid param', msg);
        return
    }

    gpio.write(pin,  +value === 1, function (err) {
        if (err) {
            //retry
            gpio.setup(pin, gpio.DIR_OUT, function () {
                gpio.write(pin, value, function (err) {
                    if (err) {
                        console.log(`gpio write error pin:${pin} value:${value}`);
                    }
                });
            });
        }
    });
}

module.exports = { gpioWrite };
