const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_oallstop(socket) {
    await ozoExec('maru_oallstop')
    OzoStatusChecker.clearInterval()
}
module.exports = { maru_oallstop }
