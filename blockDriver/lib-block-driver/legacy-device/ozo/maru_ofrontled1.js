const { ozoExec } = require("./ozo-util")

async function maru_ofrontled1(socket, msg) {
    const { pos, led1, led2, led3, led4, led5 } = msg.data ?? {}
    let result = await ozoExec(
        'maru_ofrontled1',
        ...led1,
        ...led2,
        ...led3,
        ...led4,
        ...led5,
    )
    return {
        Type: 'maru_ofrontled1_wait',
        Data: { wait: result }
    }
}
module.exports = { maru_ofrontled1 }
