const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");

const createWindow = () => {
  // create browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preloads/preload-context.js"),
    },
  });

  // setup menu
  setUpMenu(mainWindow);

  // load view of window
  mainWindow.loadFile("views/index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

function setUpMenu(mainWin) {
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          label: "incre",
          click: () => mainWin.webContents.send("update-counter", 1),
        },
        {
          label: "decre",
          click: () => mainWin.webContents.send("update-counter", -1),
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

// handle main process events
const handleMainProcessEvents = () => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
};

const windowEventUtils = {
  handleDiaLogOpen: async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog();
    if (canceled) return;

    return filePaths[0];
  },
  // 始終驗證傳入的 ipc sender attribute
  validateSender: (frame) => {
    // Value the host of the URL using an actual URL parser and an allowlist
    return new URL(frame.url).host === "electronjs.org";
  },
};

// handle window preocess events(renderer process)
const handleWindowEvents = () => {
  // handler render process lisnter before load html file
  ipcMain.handle("ping", () => "pong");

  // listen set title
  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });

  // listen open dialog
  ipcMain.handle("dialog:openFile", windowEventUtils.handleDiaLogOpen);

  // menu events
  ipcMain.on("counter-value", (_evt, val) => {
    console.log("receive val: ", val);
  });
};

app.on("ready", () => {
  createWindow();
  handleMainProcessEvents();
  handleWindowEvents();
});
