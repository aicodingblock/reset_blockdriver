const { exec } = require('child_process')

async function autoRunCreate(socket, msg) {
    const { requestId, body } = msg
    const { url } = body
    const cmd = `/usr/local/bin/aimk-auto-run-file.sh create ${url}`
    return new Promise((resolve, reject) => {
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                resolve({
                    success: false,
                    requestId,
                    error: error.message ?? 'unknown error'
                })
            } else {
                resolve({
                    success: true,
                    requestId,
                })
            }
        })
    })

}

module.exports = { autoRunCreate }
