import { app, BrowserWindow, ipcMain, WebContents, autoUpdater } from 'electron';

type MenuActionType = 'minimize' | 'maximize' | 'unmaximize' | 'restore' | 'close';

function handleMenuAction(window: BrowserWindow) {
    const actions: Array<MenuActionType> = ['minimize', 'unmaximize', 'maximize', 'restore', 'close'];
    actions.forEach((action) => {
        window.on(action as any, (e) => {
            window.webContents.send('menu-actioned', {
                type: action,
            });
        });
    });
    window.webContents.on('ipc-message', (e, channel, message) => {
        if (channel !== 'menu-action') {
            return;
        }
        const json = JSON.parse(message) as { type: string };
        if (json.type === 'minimize') {
            window.minimize();
        }
        if (json.type === 'maximize') {
            window.maximize();
        }
        if (json.type === 'restore') {
            window.restore();
        }
        if (json.type === 'close') {
            window.close();
        }
    });
}
const createWindow = ({ preload, url }): Promise<void> => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        frame: false,
        hasShadow: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: preload, // MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url);

    if (process.env.NODE_ENV === 'development') {
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    }
    handleMenuAction(mainWindow);
    return new Promise((res) => {
        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
            res();
        });
    });
};

export default createWindow;
