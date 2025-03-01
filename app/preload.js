const { contextBridge, ipcRenderer } = require("electron");
const axios = require("axios");

contextBridge.exposeInMainWorld("electron", {
  dragWindow: () => ipcRenderer.send("drag-window"),
});

window.addEventListener("mousedown", "electron", (e) => {
  ipcRenderer.send("drag-window");
});

 

// contextBridge.exposeInMainWorld("electronAPI", {
 
//   enableDrag: () => ipcRenderer.send("drag-window"),
//   // setIgnoreMouseEvents: (ignore) =>
//   //   ipcRenderer.send("ignore-mouse-events", ignore),
// });

 