// 현재 폴더는 blockDriver이다.

const WISE_PY_SCRIPT_FOLDER = './lib-block-driver/legacy-device/wise-xboard/py'

function pythonWise(scriptName, ...args) {
    let param = ''
    if (args.length > 0) {
        param = args.join(' ')
    }
    if (scriptName.startsWith('./')) {
        scriptName = scriptName.substring(2)
    }

    return `python ${WISE_PY_SCRIPT_FOLDER}/${scriptName} ${param}`
}

function python3Wise(scriptName, ...args) {
    let param = ''
    if (args.length > 0) {
        param = args.join(' ')
    }
    if (scriptName.startsWith('./')) {
        scriptName = scriptName.substring(2)
    }

    return `python3 ${WISE_PY_SCRIPT_FOLDER}/${scriptName} ${param}`
}

module.exports = {
    WISE_PY_SCRIPT_FOLDER,
    pythonWise,
    python3Wise
}
