const { pin2bcm } = require("./codingpack-util")

/**
 *
 * @param {*} socket
 * @param {Object} msg
 * @param {number} msg.angle 각도 0-180
 * @param {number} msg.pin
 * @param {*} extra
 */
async function setServo(socket, msg, extra) {
    const { pin, angle } = msg.data ?? {}
    const gpin = pin2bcm[pin]
    const PiServo = require('pi-servo')
    const sv = new PiServo(gpin)
    console.log(`pin: ${pin}, gpin: ${gpin}, angle:${angle}`)
    sv.open()
        .then(function () {
            sv.setDegree(angle) // 0 - 180
            socket.emit('receiveData', {
                Type: 'ktaimk_setServo_finish',
                Data: { ret: true, pin: msg.data['pin'] },
            })
        })
        .catch(function (error) {
            console.log(error)
        })
}

module.exports = { setServo }
