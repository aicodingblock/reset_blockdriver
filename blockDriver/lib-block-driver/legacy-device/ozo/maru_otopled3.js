const { ozoExec } = require("./ozo-util")

async function maru_otopled3(socket) {
    const result = await ozoExec('maru_otopled3')
    return {
        Type: 'maru_otopled3_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_otopled3 }
