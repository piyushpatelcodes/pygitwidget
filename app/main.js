const { app, BrowserWindow, ipcMain } = require("electron");
const dotenv = require("dotenv");
const path = require('path');
const dotenvExpand = require("dotenv-expand");
if (process.resourcesPath) {
  dotenvExpand.expand(dotenv.config({ path: path.join(process.resourcesPath, ".env") }));
} else {
  dotenvExpand.expand(dotenv.config());
}
 
// dotenv.config();

 
let mainWindow;
const AutoLaunch = require("electron-auto-launch");

const vibexAutoLauncher = new AutoLaunch({
  name: "VIBEX",
  isHidden: true,
});

vibexAutoLauncher.isEnabled().then((isEnabled) => {
    if (!isEnabled) {
        vibexAutoLauncher.enable().then(() => {
          console.log("[✅] AutoLaunch Enabled");
        }).catch((err) => {
          console.log("[❌] AutoLaunch Error:", err);
        });
      }
});

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 259,
    height: 500,
    transparent: true,
    alwaysOnTop: true,
    frame: false,
    resizable: true,
    minWidth: 200,
    minHeight: 200,
    skipTaskbar: true, // Hide from Taskbar
    webPreferences: {
      nodeIntegration: true,
      contextIsolation:false,
      preload:  "/preload.js",
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.setIgnoreMouseEvents(false, { forward: true });
 });

ipcMain.on("drag-window", () => {
  const bounds = mainWindow.getBounds();
  mainWindow.webContents.send("dragged");
  mainWindow.setBounds(bounds);
});

 

ipcMain.on("save-setting", (event, key, value) => {
  console.log(`Setting Saved: ${key} = ${value}`);
  mainWindow.webContents.send("toggle-component", key, value);
});