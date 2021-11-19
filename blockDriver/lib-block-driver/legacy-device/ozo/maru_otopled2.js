const { ozoExec } = require("./ozo-util")

async function maru_otopled2(socket) {
    const result = await ozoExec('maru_otopled2')
    console.log(result)
    return {
        Type: 'maru_otopled2_wait',
        Data: { wait: result }
    }

}

module.exports = { maru_otopled2 }
