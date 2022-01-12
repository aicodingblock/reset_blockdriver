async function gpioReadNow(socket, msg, extra) {
    const { gpio } = extra;
    const { pin } = msg.data ?? {};

    if (typeof pin === "undefined") {
        console.log("gpio gpioReadNow invalid param", msg);
        return;
    }

    gpio.read(pin, function (err, value) {
        if (err) {
            console.log("gpioReadNow fail, retry");
            gpio.read(pin, function (err, value) {
                if (err) {
                    console.log(`gpioReadNow error pin:${pin}`);
                } else {
                    socket.emit("receiveData", {
                        Type: "ktaimk_get_gpio_read_now",
                        Data: { pin, value },
                    });
                }
            });
        } else {
            socket.emit("receiveData", {
                Type: "ktaimk_get_gpio_read_now",
                Data: { pin, value },
            });
        }
    });
}

module.exports = { gpioReadNow };
