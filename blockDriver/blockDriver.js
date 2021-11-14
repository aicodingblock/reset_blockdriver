const http = require('http')
const { exec } = require('child_process')
const { program } = require('commander')
const { execQuietlyAsync } = require('./lib-block-driver/process-utils')
const { createWebServer } = require('./lib-block-driver/createWebServer')
const { createSocketIoServer } = require('./lib-block-driver/createSocketIoServer')
const { onNewClient } = require('./lib-block-driver/clientHandler')

const programArg = program
    .version('0.1')
    .option('-a,--autorun', 'from Autorun')
    .parse(process.argv)

if (!programArg.autorun) {
    //if not autorun kill python button_trigger_4share3.py
    exec('sudo systemctl stop aimk_auto')
} else {
    console.log('disable stop python')
}


// pi-blaster process kill
function killPiBlaster() {
    return execQuietlyAsync(`sudo pkill pi-blaster`)
}

// ozo server process kill
function killOzoServer() {
    return execQuietlyAsync(`ps -ef | grep "python3 ./ozo_server" | grep -v grep | awk '{print $2}' | xargs sudo kill -9 2> /dev/null`)
}

// restart pi-blaster
killPiBlaster().finally(() => execQuietlyAsync('cd /home/pi/pi-blaster/ && sudo ./pi-blaster'))

// restart ozo-server
killOzoServer().finally(() => execQuietlyAsync('sudo python3 ./ozo_server.py'))

const io = createSocketIoServer()

io.on('connection', onNewClient)
io.on('disconnect', function (arg) {
    console.log('on disconnect', arg)
})

// socket io server start
io.listen(3001)

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
