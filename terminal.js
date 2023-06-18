const { ipcRenderer } = require('electron');
const Terminal = require('xterm').Terminal;
const FitAddon = require('xterm-addon-fit').FitAddon;

// Create xterm.js instance
const term = new Terminal({
    fontFamily: 'Courier, MesloLGS NF'
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

// Attach created terminal to a DOM element
term.open(document.getElementById('terminal'));

term.onData(data => ipcRenderer.send('termInput', data));
ipcRenderer.on('termOutput', (event, data) => term.write(data));

window.addEventListener('resize', () => fitAddon.fit());
