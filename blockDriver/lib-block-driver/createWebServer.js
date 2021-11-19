const cors = require('cors')
const express = require('express')
const fs = require('fs')
const multer = require('multer')


function createWebServer(options) {
    const { uploadDir } = options // for devkey
    const upload = multer({ dest: uploadDir })
    fs.mkdir(uploadDir, function () { })

    const app = express()

    app.use(cors())
    app.post('/upload', upload.single('file'), function (req, res, next) {
        fs.rename(
            uploadDir + req.file.filename,
            uploadDir + 'clientKey.json',
            function () {
                io.sockets.emit('update_complete', '')
                //aikit.initializeJson(json_path,cert_path,proto_path);
            }
        )
    })

    app.get('/test', function (req, res) {
        res.status(200).send('express test')
    })

    return app
}

module.exports = {
    createWebServer
}
