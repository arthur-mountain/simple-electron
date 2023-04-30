(() => {
  window.addEventListener("DOMContentLoaded", () => {
    // verisons
    handleVersionTexts();
    // set title
    document
      .querySelector("[data-set-title]")
      .addEventListener("click", handleSetTitle);
    // open file
    document
      .querySelector("[data-open-file]")
      .addEventListener("click", handleOpenFile);
    // handle update count
    handleUpdateCounter();

    // // invoke function that send message form ipcRenderer to ipcMain handle
    // (async () => {
    //   const res = await electronAPI.ping();
    //
    //   console.log(res); // will receive message form ipcMain handle
    // })();
  });

  function handleSetTitle(e) {
    e.preventDefault();
    e.stopPropagation();
    const title = document.querySelector("#title").value;
    electronAPI.setTitle(title);
  }

  async function handleOpenFile(e) {
    e.preventDefault();
    e.stopPropagation();
    const filePath = await electronAPI.openFile();
    document.querySelector("[data-file-path]").textContent = filePath;
  }

  function handleUpdateCounter() {
    const count = document.querySelector("[data-counter-value]");

    electronAPI.updateCounter((event, value) => {
      count.textContent = +count.textContent + value;

      // send message to main process, if main process has listened this event
      event.sender.send("counter-value", count.textContent);
    });
  }

  function handleVersionTexts() {
    const versions = electronAPI.versions;
    const replaceText = (selector = "", text = "") => {
      const element = document.querySelector(selector);
      if (element) element.innerText = text;
    };

    const deps = ["chrome", "node", "electron"];

    deps.forEach((dep) => {
      if (versions[dep]) replaceText(`#${dep}-version`, versions[dep]());
    });
  }
})();
