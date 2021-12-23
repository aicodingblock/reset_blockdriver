const { LegacyDeviceController } = require("./LegacyDeviceController")
const { ozo, codingPack, wiseXboard } = require('./legacy-device')
const lodash = require('lodash')

const DEBUG = false

function register(controller, obj) {
    lodash.toPairs(obj).forEach(([msgId, msgHandler]) => {
        if (DEBUG) console.log('msgId=', msgId, 'msgHandler=', msgHandler)
        controller.add(msgId, msgHandler)
    });
}

function createLegacyDeviceController() {
    console.log('createLegacyDeviceController')
    const c = new LegacyDeviceController()
    register(c, ozo)
    register(c, codingPack)
    register(c, wiseXboard)
    c.addCloseHandler(() => {
        ozo.maru_oallstop()
    })

    return c
}

module.exports = {
    createLegacyDeviceController,
}
