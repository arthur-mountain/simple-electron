// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector = "", text = "") => {
    const element = document.querySelector(selector);
    if (element) element.innerText = text;
  };

  const deps = ["chrome", "node", "electron"];

  deps.forEach((dep) => {
    replaceText(`#${dep}-version`, process.versions[dep]);
  });
});
