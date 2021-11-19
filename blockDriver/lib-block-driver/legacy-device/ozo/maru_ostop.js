const { ozoExec } = require("./ozo-util")

async function maru_ostop(socket) {
    const result = await ozoExec('maru_ostop')
    return {
        Type: 'maru_ostop_wait',
        Data: { wait: result }
    }
}

module.exports = { maru_ostop }
