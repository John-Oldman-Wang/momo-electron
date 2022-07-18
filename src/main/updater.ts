import { app, BrowserWindow, ipcMain, WebContents } from 'electron';
import { autoUpdater } from 'electron-updater';

export default function checkForUpdates() {
    if (app.isPackaged) {
        autoUpdater.addListener('update-downloaded', () => {
            setTimeout(() => {
                autoUpdater.quitAndInstall();
            }, 0);
        });
        autoUpdater.setFeedURL({
            provider: 'github',
            owner: 'nokisnojok',
            repo: 'momo-electron',
            token: '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',
            updaterCacheDirName: 'momo-electron-updater',
        });
        autoUpdater.checkForUpdates();
    }
}
