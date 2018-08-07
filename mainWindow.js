// Modules
const {BrowserWindow} = require('electron')

// BrowserWindow instance
exports.win

exports.createWindow = () => {

    this.win = new BrowserWindow({
        width: 500,
        height: 650,
        minWidth: 350,
        maxWidth: 650,
        minHeight: 310,
        icon: `${__dirname}/icons/64x64.png`
    })

    // Devtools
    //this.win.webContents.openDevTools()


    // Load main window content
    this.win.loadURL(`file://${__dirname}/renderer/main.html`)

    // Handler window close
    this.win.on('close', () => {
        this.win = null
    })
}