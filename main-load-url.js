const { app, BrowserWindow } = require("electron");

app.on("ready", () => {
  const { BrowserWindow } = require("electron");

  const win = new BrowserWindow({ width: 800, height: 1500 });
  win.loadURL("https://github.com");
  console.log("win", win);

  const contents = win.webContents;
  console.log("win.webContents", contents);
});
