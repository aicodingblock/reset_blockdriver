const http = require('http')
const { execQuietlyAsync, execAsync } = require('./lib-block-driver/process-utils')
const { createWebServer } = require('./lib-block-driver/createWebServer')
const { createSocketIoServer } = require('./lib-block-driver/createSocketIoServer')
const { onNewClient, onReadyWebSocketServer } = require('./lib-block-driver/clientHandler')

execQuietlyAsync(`sudo mkdir -p /var/run/aimk && sudo echo ${process.pid} > /var/run/aimk/blockDriver.pid`)

// kill pi-blaster
function killPiBlaster() {
    return execQuietlyAsync(`sudo pkill pi-blaster`)
}

// kill ozo server
function killOzoServer() {
    return execQuietlyAsync(`ps -ef | grep "python3 ./ozo_server" | grep -v grep | awk '{print $2}' | xargs sudo kill -9 2> /dev/null`)
}


async function prepare() {
    try {
        await execAsync('/usr/local/bin/aimk-button-serial-console.sh stop')
    } catch (ignore) {
        console.log('aimk-button-serial-console.sh stop: ignore error,' + ignore.message)
    }

    try {
        await execAsync('/usr/local/bin/aimk-button-daemon-ctl.sh stop')
    } catch (ignore) {
        console.log('/usr/local/bin/aimk-button-daemon-ctl.sh stop: ignore error,' + ignore.message)
    }

    // restart pi-blaster on background
    killPiBlaster().finally(() => execQuietlyAsync('cd /home/pi/pi-blaster/ && sudo ./pi-blaster'))

    // restart ozo-server on background
    killOzoServer().finally(() => execQuietlyAsync('sudo python3 ./ozo_server.py'))
}

async function main() {
    // 준비 과정을 마친 후에 메인 함수를 실행한다
    try {
        await prepare()
    } catch (err) {
        console.log('error occured on preparing:', err.message)
    }

    const io = createSocketIoServer()

    io.on('connection', onNewClient)

    io.on('disconnect', function (arg) {
        console.log('on disconnect', arg)
    })

    // socket io server start
    io.listen(3001)

    // 서버가 준비되면 GPIO 이벤트를 감시하기 시작한다
    onReadyWebSocketServer(io)

    // for devkey
    const uploadDir = __dirname + '/key/'
    const app = createWebServer({ uploadDir })
    http.createServer(app).listen(3002, function () {
        console.log('http server start')
    })

    process.on('beforeExit', () => {
        killPiBlaster()
        killOzoServer()
    })

}


main()
