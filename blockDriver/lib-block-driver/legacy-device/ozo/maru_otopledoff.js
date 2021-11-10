const { ozoExec } = require("./ozo-util")

async function maru_otopledoff(socket) {
    const result = await ozoExec('maru_otopledoff')
    return {
        Type: 'maru_otopledoff_wait',
        Data: { wait: result },
    }
}


module.exports = { maru_otopledoff }
