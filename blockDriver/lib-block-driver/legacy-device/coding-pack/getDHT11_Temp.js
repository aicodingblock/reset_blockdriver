const { pin2bcm } = require("./codingpack-util")

async function getDHT11_Temp(socket, msg, extra) {
    const { sensor } = extra
    const { pin } = msg.data ?? {}
    const gpin = pin2bcm[pin]

    const result = sensor.initialize(11, gpin)
    const readout = sensor.read()
    if (result) {
        console.log(`temp: ${readout.temperature.toFixed(1)}°C, humidity:${readout.humidity.toFixed(1)}%`)
        return {
            Type: 'ktaimk_get_dht11_temp_data',
            Data: {
                ret: true,
                temp: readout.temperature.toFixed(1),
                pin,
            }
        }
    } else {
        console.warn('Failed to initialize DHT11 sensor')
    }
}

module.exports = { getDHT11_Temp }
