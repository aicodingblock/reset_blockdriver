const { exec } = require('child_process')

async function autoRunRemove(socket, msg) {
    const { requestId } = msg
    const cmd = `/usr/local/bin/aimk-auto-run-file.sh remove`
    return new Promise((resolve, reject) => {
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                resolve({
                    success: false,
                    requestId,
                    error: error.message ?? 'unknown error'
                })
            }
            else {
                resolve({
                    success: true,
                    requestId,
                })
            }
        })
    })

}

module.exports = { autoRunRemove }
