
const io = require('socket.io-client')

const sock = io('ws://127.0.0.1:3001', {
    autoConnect: true
})

sock.on('connect', () => {
    console.log('connect')
    sock.emit('deviceCtlMsg', { type: 'led', data: { type: '1', duration: 5 } })
})

sock.on('disconnect', () => {
    console.log('disconnect')
})

sock.on('receiveData', (msg) => {
    console.log('receiveData', msg)
})