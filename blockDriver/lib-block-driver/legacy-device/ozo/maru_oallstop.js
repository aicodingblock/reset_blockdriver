const { OzoStatusChecker, ozoExec } = require("./ozo-util")

async function maru_oallstop(socket) {
    try {
        await ozoExec('maru_oallstop')
    } catch (ignore) {
        console.log(ignore.message)
    }
    OzoStatusChecker.stop()
}
module.exports = { maru_oallstop }
