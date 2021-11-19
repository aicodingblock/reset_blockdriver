const { OzoStatusChecker, ozoExec } = require("./ozo-util")

export async function maru_oallstop(socket) {
    await ozoExec('maru_oallstop')
    OzoStatusChecker.clearInterval()
}
