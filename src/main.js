const { app, BrowserWindow, ipcMain } = require('electron');
const pty = require('node-pty');
const fs = require("fs");

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

    mainWindow.loadFile('static/html/index.html').then(() => {
        console.log("App started");
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

    let currentPath = '';
    let updatingPath = false;
    shell.on('data', function(data) {
        mainWindow.webContents.send('termOutput', data);
    });

    // setInterval(() => {
    //     shell.write(`while sleep 1; do pwd > /tmp/current-dir; done &\r`);
    //     fs.readFile('/tmp/current-dir', 'utf8', (err, data) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             mainWindow.setTitle(`Terminal - ${data}`);
    //         }
    //     });
    // }, 1000);
}

app.on('ready', createWindow);
