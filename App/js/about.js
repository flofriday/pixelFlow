// load the app version
var electron = require('electron')
var windowConfig = require('../js/windowconfig')
var appInfo = require('../package')
var BrowserWindow = electron.remote.BrowserWindow

// Handle the DOM
var versionElement = document.getElementById('version')
var closeElement = document.getElementById('close')
versionElement.innerText = appInfo.version

// Close the window
closeElement.addEventListener('click', function () {
  BrowserWindow.getFocusedWindow().close();
})
