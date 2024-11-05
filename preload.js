const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendButtonClick: (buttonName) => ipcRenderer.send('button-clicked', buttonName),
});
