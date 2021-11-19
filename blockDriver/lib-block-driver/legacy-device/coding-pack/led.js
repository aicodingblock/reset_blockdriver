const { execQuietlyAsync } = require("../../process-utils")

async function led(socket, msg) {
    const { duration, type } = msg.data ?? {}
    console.log('led on')
    execQuietlyAsync('python ./ledDriver.py ', type, duration)
}

module.exports = { led }
