// load the app version
var appInfo = require('../package')
var electron = require('electron')
var remote = electron.remote
var shell = electron.shell
var BrowserWindow = electron.remote.BrowserWindow

// Handle the DOM
var versionElement = document.getElementById('version')
var closeElement = document.getElementById('close')
versionElement.innerText = appInfo.version
const links = document.querySelectorAll('a[href]')

document.addEventListener("keydown", globalKeyHandler)

// Handle all key shortcuts
function globalKeyHandler(e) {
if(e.keyCode === 123) {
    // Open Dev Tools
    remote.getCurrentWindow().toggleDevTools()
  }
}

// Open links in OS default Browser
Array.prototype.forEach.call(links, function (link) {
  const url = link.getAttribute('href')
  if (url.indexOf('http') === 0) {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})

// Close the window
closeElement.addEventListener('click', function () {
  BrowserWindow.getFocusedWindow().close();
})
