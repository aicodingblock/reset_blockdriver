const { exec } = require('child_process')
async function getDHT11_Humidity(socket, msg, extra) {
    exec('python ./bh1750.py', function (error, stdout, stderr) {
        if (!stderr) {
            socket.emit('receiveData', {
                Type: 'ktaimk_get_bh1750_data',
                Data: { ret: true, data: stdout },
            })
        } else {
            socket.emit('receiveData', {
                Type: 'ktaimk_get_bh1750_data',
                Data: { ret: true, data: -1 },
            })
        }
    })

}

module.exports = { getDHT11_Humidity }
