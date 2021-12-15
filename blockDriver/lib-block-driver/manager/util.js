const os = require('os');
const { exec } = require('child_process')
const fs = require('fs')

const CODINGPACK_MANAGER_REQUEST = 'manager:request'
const CODINGPACK_MANAGER_RESPONSE = 'manager:response'

const RPI_3B = "Raspberry Pi 3 Model B"
const RPI_3B_PLUS_V13 = "Raspberry Pi 3 Model B Plus Rev 1.3"
const RPI_4B = "Raspberry Pi 4 Model B"
let deviceId = null
let deviceModel = null


function cleanText(str) {
    if (!str) return str
    return str.replace(/[\x00-\x1F\x7F-\x9F]/g, "")
}

function getDeviceModel() {
    return new Promise((resolve, reject) => {
        if (deviceModel && deviceModel.length > 0) {
            return resolve(deviceModel)
        }
        fs.readFile('/proc/device-tree/model', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                reject(err)
                return
            }
            data = cleanText(data) // 제어문자가 포함되어 있으므로 주의
            deviceModel = data
            resolve(data)
        })
    })
}

function getPrimaryInterfaceName() {
    const interfacesNames = ['eth0', 'en0', 'wlan0']
    for (let iface of interfacesNames) {
        if (fs.existsSync(`/sys/class/net/${iface}/address`)) {
            return iface
        }
    }
    return null
}

/**
 * 디바이스ID는 eth0의 맥주소
 * @returns Promise<string|null>
 */
function getDeviceId() {
    return new Promise((resolve, reject) => {
        if (deviceId && deviceId.length > 0) {
            return resolve(deviceId)
        }
        let iface = getPrimaryInterfaceName()
        if (!iface || iface.length === 0) {
            resolve(null)
            return
        }
        fs.readFile(`/sys/class/net/${iface}/address`, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                reject(err)
                return
            }
            data = cleanText(data) // 제어문자가 포함되어 있으므로 주의
            deviceId = data
            resolve(data)
        })
    })
}

function getInterfaceIp(interfaces, ifname) {
    let infos = interfaces[ifname]
    if (!infos || infos.length === 0) return null
    let info = infos.find(it => it.family === 'IPv4')
    if (info) {
        return info.address
    }
    return null
}

function getIp() {
    const interfaces = os.networkInterfaces();
    let ip = getInterfaceIp(interfaces, 'eth0');
    if (ip != null) return ip;
    ip = getInterfaceIp(interfaces, 'en0');
    if (ip != null) return ip;
    return getInterfaceIp(interfaces, 'wlan0');
}

module.exports = {
    CODINGPACK_MANAGER_REQUEST,
    CODINGPACK_MANAGER_RESPONSE,
    RPI_3B,
    RPI_3B_PLUS_V13,
    RPI_4B,
    getDeviceModel,
    getDeviceId,
    getIp
}
