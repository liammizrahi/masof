const { app, BrowserWindow, ipcMain } = require('electron');
const pty = require('node-pty');

let mainWindow = null;
let shell = null;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html').then(() => {
        console.log("INDEX LOADED");
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const shellPath = process.env[process.platform === 'win32' ? 'COMSPEC' : 'SHELL'];
    shell = pty.spawn(shellPath, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.cwd(),
        env: process.env
    });

    ipcMain.on('termInput', (event, input) => {
        shell.write(input);
    });

    shell.on('data', function(data) {
        mainWindow.webContents.send('termOutput', data);
    });
}

app.on('ready', createWindow);
