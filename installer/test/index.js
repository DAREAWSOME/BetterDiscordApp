const { ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');

const axios = require('axios'), fs = require('fs');
ipcMain.on('ghdl', (e, args) => {
    const { url, filename } = args;
    axios({
        url,
        method: 'GET',
        headers: { 'Accept': 'application/octet-stream' },
        responseType: 'stream'
    }).then(res => {
        res.data.pipe(fs.createWriteStream(filename));
        e.sender.send('dlcomplete', args);
    });
});

app.on('window-all-closed', () => {
    app.quit();
});

const devMode = true;
const options = {
    width: 800,
    height: 400,
    fullscreenable: false,
    maximizable: false,
    frame: false,
    resizable: devMode ? true : false,
    // alwaysOnTop: devMode ? true : false,
    backgroundColor: '#101013',
    transparent: false
};

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow(options);
    mainWindow.loadURL(`file://${path.resolve(__dirname, '..', 'dist', 'index.html')}`);
});
