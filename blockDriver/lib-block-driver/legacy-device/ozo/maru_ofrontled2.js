const { ozoExec } = require("./ozo-util")

async function maru_ofrontled2(socket) {
    const result = await ozoExec('maru_ofrontled2')

    return {
        Type: 'maru_ofrontled2_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_ofrontled2 }
