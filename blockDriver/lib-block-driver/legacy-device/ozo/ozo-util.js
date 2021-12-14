const { exec } = require('child_process')
const { execAsync } = require("../../process-utils")

function _unquote(str, q) {
    if (!str || str.length <= 1) return str
    if (str.charAt(0) === q && str.charAt(str.length - 1) === q) {
        return str.substr(1, str.length - 2)
    }
}

function unquote(str) {
    str = _unquote(str, "'")
    return _unquote('"')
}



const M_TIMEOUT = 500
class OzoStatusChecker {

    static timerId = null

    static clearInterval() {
        console.log('All Stop Ozobot Waiting Loop...')
        const timerId = OzoStatusChecker.timerId
        OzoStatusChecker.timerId = null
        if (timerId) {
            clearInterval(timerId)
        }
    }

    static checkInterval(socket, ret_msg_str) {
        OzoStatusChecker.timerId = setInterval(() => {
            OzoStatusChecker.maruo_waiting_status_check(socket, ret_msg_str)
        }, M_TIMEOUT)
    }

    static maruo_waiting_status_check(socket, ret_msg_str) {
        exec(
            'python3 ./ozocommand.py maru_ocheck',
            (error, stdout, stderr) => {
                if (error || stderr) {
                    // Handle error.
                } else {
                    ret = stdout
                    //console.log(stdout);
                    console.log('time_id' + ozo_timer_id)
                    result = ret.replace(/\n/g, '')
                    console.log(result)
                    if (result == 'True' || result == 'False') {
                        if (OzoStatusChecker.timerId) {
                            OzoStatusChecker.clearInterval()
                            socket.emit('receiveData', { Type: ret_msg_str, Data: { wait: result } })
                        }
                    } else if (result == 'waiting') {
                        console.log('Still waiting.....')
                    }
                }
            }
        )
    }
}


/**
 * ozo_command를 실행하는 함수
 * @param {string} cmd
 * @param  {...any} args
 * @returns Promise {stdout, stderr}
 */
function ozoExec(cmd, ...args) {
    return execAsync('python3 ./ozocommand.py', cmd, ...args).stdout
}


module.exports = {
    OzoStatusChecker,
    ozoExec,
    unquote
}
