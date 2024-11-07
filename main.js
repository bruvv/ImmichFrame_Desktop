const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;
const urlFilePath = path.join(app.getPath('userData'), 'settings.txt');

// Function to create the main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreen: true, // Start in fullscreen mode
        frame: false, // Remove the window frame (no title bar or menu)
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            webviewTag: true,
            session: require('electron').session.fromPartition('persist:no-cache')
        },
    });

    // Load the last saved URL or a default one
    if (fs.existsSync(urlFilePath)) {
        const savedUrl = fs.readFileSync(urlFilePath, 'utf-8');
        mainWindow.loadFile('index.html').then(() => {
            mainWindow.webContents.executeJavaScript(`document.getElementById('webview').setAttribute('src', '${savedUrl}');`);
        });
    } else {
        mainWindow.loadFile('index.html');
    }
}

// IPC listener to retrive URL
ipcMain.handle('get-saved-url', async () => {
    try {
        const url = fs.readFileSync(urlFilePath, 'utf-8');
        return url; // Return the saved URL
    } catch (error) {
        return 'https://immichframe.github.io/ImmichFrame/'; // Return the default URL
    }
});

// IPC listener to save URL
ipcMain.on('save-url', (event, url) => {
    fs.writeFileSync(urlFilePath, url, 'utf-8');
});

// IPC listener to quit
ipcMain.on('quit-app', () => {
    app.quit();
});

// Application lifecycle management
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
