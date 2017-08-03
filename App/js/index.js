// Load modules
const electron = require('electron')
const remote = electron.remote
const webFrame = electron.webFrame
const shell = electron.shell
const BrowserWindow = electron.remote.BrowserWindow
const os = require('os')
const path = require('path')
const matrix = require('../js/mainmatrix')
matrix.start()  //start it up
const frame = require('../js/frame')
const pack = require('../js/pack')
const colorPicker = require('../js/colorpicker')
const player = require('../js/player')
const hardware = require('../js/hardware')



// Set up colorpicker
colorPicker.start()

// Handle the DOM
webFrame.setZoomFactor(1.25)
var btnDeveloper = document.getElementById("btn-developer")
var btnAbout = document.getElementById('btn-about')
var btnBluetooth =document.getElementById('btn-bluetooth')
var allLinks = document.querySelectorAll('a[href]')


btnDeveloper.addEventListener("click", function() {remote.getCurrentWindow().toggleDevTools();}, false);
btnAbout.addEventListener("click", openAbout)
btnBluetooth.addEventListener("click", openConnection)
document.addEventListener("keydown", globalKeyHandler, false);


// Handle all App shortcuts
function globalKeyHandler(e) {
  if (e.key === "+" && e.ctrlKey) {
    webFrame.setZoomFactor(webFrame.getZoomFactor() + 0.25);
    if (webFrame.getZoomFactor() > 5) {webFrame.setZoomFactor(5)}
    console.log("Zoom: " + (webFrame.getZoomFactor() * 100) + "%");
  }
  else if (e.key === "-" && e.ctrlKey) {
    webFrame.setZoomFactor(webFrame.getZoomFactor() - 0.25);
    if (webFrame.getZoomFactor() < 0.25) {webFrame.setZoomFactor(0.25)}
    console.log("Zoom: " + (webFrame.getZoomFactor() * 100) + "%");
  }
  else if((e.key === "r" && e.ctrlKey) || e.keyCode === 116) {
    hardware.updateFrame(matrix.getPixelList())
  }
}


// Open links in OS default browser instead of inside the electron app
Array.prototype.forEach.call(allLinks, function (link) {
  const url = link.getAttribute('href')
  if (url.indexOf('http') === 0) {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})


// Create a new Window when the about button clicked
function openAbout() {
  const modalPath = path.join('file://', __dirname, 'about.html')
  let win = new BrowserWindow({
    width: 600,
    height: 450,
    frame: false,
    hide: true,
    resizable: false,
    titleBarStyle: 'hidden',
  })
  win.loadURL(modalPath)
  //win.webContents.openDevTools()  // Only for debugging
  win.once('ready-to-show', function () { win.show() })
  //win.on('blur', function () { win.close() })
  win.on('close', function () { win = null })
  win.show()
}


// Function to get the Path for a Icon
function getIconPath() {
  if (os.platform() === 'darwin') {
    return path.join(__dirname, '../img/icon.icns')
  }
  else if (os.platform() === 'win32') {
    return path.join(__dirname, '../img/icon.ico')
  }
  else {
    // For all other platforms like: linux, freebsd, openbsd
    return path.join(__dirname, '../img/icon.png')
  }
}


// Create a new Window when the Connection button clicked
function openConnection() {
  const modalPath = path.join('file://', __dirname, 'connection.html')
  let win = new BrowserWindow({
    width: 600,
    height: 400,
    hide: false,
    title: "Select Hardware",
    icon: getIconPath(),
    backgroundColor: '#ffffff',
  })
  console.log(getIconPath())
  win.setMenu(null)
  win.loadURL(modalPath)
  win.webContents.openDevTools()  // Only for debugging
  win.once('ready-to-show', function () { win.show() })
  win.on('close', function () { win = null })
  win.show()
}
