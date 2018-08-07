// Modules
const {BrowserWindow} = require('electron')

// Browserwindow
let bgItemWin

module.exports = (url, callback) => {
    // Create new offscreen BrowserWindow
    bgItemWin = new BrowserWindow({
        width: 1000,
        height: 1000,
        show: false,
        webPreferences: {
            offscreen: true
        }
    })

    // Load read item
    bgItemWin.loadURL( url )

    // Wait for page to finish loading
    bgItemWin.webContents.on('did-finish-load', () => {
        // Get screenshot (thumbnail)
        bgItemWin.webContents.capturePage((image) => {
            // Get image as dataURL
            let screenshot = image.toDataURL()

            // Get page title
            let title = bgItemWin.getTitle()

            // Return new item via Callback
            callback({title, screenshot, url, bgItemWin})

            // Clean Up
            bgItemWin.close()
            bgItemWin = null
        })
    })
} 