const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;
const urlFilePath = path.join(app.getPath('userData'), 'settings.txt');

function createWindow() {
    const customSession = require('electron').session.fromPartition('persist:no-cache');

    // Set headers to disable cache
    customSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        callback({ requestHeaders: details.requestHeaders });
    });

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreen: true,
        frame: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            webviewTag: true,
            session: customSession,  // Using custom session to disable cache
        },
    });

    // Load the last saved URL or a default one
    if (fs.existsSync(urlFilePath)) {
        const savedUrl = fs.readFileSync(urlFilePath, 'utf-8');
        const cacheBustedUrl = `${savedUrl}?_=${Date.now()}`;  // Add timestamp to URL to avoid caching
        
        // Load index.html and set the webview src
        mainWindow.loadFile('index.html').then(() => {
            mainWindow.webContents.executeJavaScript(`
                const webview = document.getElementById('webview');
                if (webview) {
                    webview.src = '${cacheBustedUrl}';
                }
            `).catch((err) => console.error('Failed to set webview src:', err));
        });
    } else {
        mainWindow.loadFile('index.html');
    }
}

// IPC listener to retrieve URL
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
