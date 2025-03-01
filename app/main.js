const { app, BrowserWindow, ipcMain } = require("electron");


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
    width: 400,
    height: 450,
    transparent: true,
    alwaysOnTop: true,
    frame: false,
    resizable: true,
    minWidth: 200,
    minHeight: 200,
    skipTaskbar: true, // Hide from Taskbar
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/preload.js",
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.setIgnoreMouseEvents(false, { forward: true });
  mainWindow.webContents.openDevTools();
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