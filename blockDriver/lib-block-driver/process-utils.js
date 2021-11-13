const config = require('../config')
const DEBUG = config.debug
const exec = require('child_process').exec

function debugResult(error, stdout, stderr) {
    if (!DEBUG) return

    if (error) {
        console.log(`${process.cwd()} $ error=`, error.message)
        return
    }

    if (stdout) {
        console.log(`${process.cwd()} $ stdout=`, stdout)
    }

    if (stderr) {
        console.log(`${process.cwd()} $ stderr=`, stderr)
    }
}


/**
 * 비동기로 명령을 실행한다
 * execShellCommand()를 대체하기 위해 만들었다.
 */
function execAsync(cmd, ...args) {
    let cmdline = cmd
    if (args.length > 0) {
        cmdline += ' ' + args.join(' ')
    }

    if (DEBUG) console.log(`${process.cwd()} $ execAsync:`, cmdline)
    return new Promise((resolve, reject) => {
        exec(cmdline, function (error, stdout, stderr) {
            debugResult(error, stdout, stderr)
            if (error) {
                reject(error)
                return
            }
            resolve({ stdout, stderr })
        })
    })
}

/**
 * 비동기로 명령을 실행한다.
 */
async function execQuietlyAsync(cmd, ...args) {
    try {
        await execAsync(cmd, ...args)
    } catch (ignore) {
        console.log('ignore error: ', ignore.message)
    }
}

/**
 * exec 함수 wrapper, Promise를 리턴한다
 * 기존에 있던 함수다
 * @param {string!} cmd
 * @param  {...any} args
 * @returns {Promise} result stream output as promise
 */
function execShellCommand(cmd, ...args) {
    let cmdline = cmd
    if (args.length > 0) {
        cmdline += ' ' + args.join(' ')
    }

    if (DEBUG) console.log(`${process.cwd()} $ execShellCommand:`, cmdline)
    return new Promise((resolve, reject) => {
        exec(cmdline, (error, stdout, stderr) => {
            debugResult(error, stdout, stderr)
            if (error) {
                console.warn(error)
            }
            resolve(stdout ? stdout : stderr)
        })
    })
}


module.exports = {
    execAsync,
    execQuietlyAsync,
    execShellCommand
}
