const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  },
  // should expose helper function, not entire ipcRenderer api module
  ping: () => ipcRenderer.invoke("ping"),
  setTitle: (title) => ipcRenderer.send("set-title", title),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  updateCounter: (cb) => ipcRenderer.on("update-counter", cb),
});
