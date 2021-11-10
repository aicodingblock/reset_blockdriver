const { exec } = require('child_process')

async function analogRead(socket, msg, extra) {
    const { data } = msg.data ?? {}

    const cmd = 'python ./analogRead.py ' + data
    exec(cmd, function (error, stdout, stderr) {
        if (!stderr) {
            socket.emit('receiveData', {
                Type: 'ktaimk_get_analogRead',
                Data: { ret: true, data: stdout },
            })
        } else {
            socket.emit('receiveData', {
                Type: 'ktaimk_get_analogRead',
                Data: { ret: true, data: -1 },
            })
        }
    })
}

module.exports = { analogRead }
