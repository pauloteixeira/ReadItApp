// modules
const {app, ipcMain} = require('electron')
const mainWindow = require('./mainWindow')
const readItem = require('./readItem')

// Enable Electron-Reload
//require('electron-reload')(__dirname)

ipcMain.on('new-item', (e, itemURL) => {
    // Get read item with readItem module
    readItem(itemURL, (item) => {
        // send to renderer
        e.sender.send('new-item-success', item)
    })
})

// Run when Electron has finished initialization
app.on('ready', mainWindow.createWindow)

// Run when all windowrs are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd+Q
    if( process.platform !== 'darwin' ) app.quit()
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // doc icon is clicked and there are no other window open
    if( mainWindow === null ) mainWindow.createWindow()
})