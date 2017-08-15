// Load modules
const electron = require('electron')
const remote = electron.remote
const webFrame = electron.webFrame
const BrowserWindow = electron.remote.BrowserWindow
const ipc = electron.ipcRenderer
const os = require('os')
const path = require('path')
const windowConfig = require('../js/windowconfig')
const matrix = require('../js/mainmatrix')
matrix.start()  //start it up
const frame = require('../js/frame')
const pack = require('../js/pack')
const colorPicker = require('../js/colorpicker')
const player = require('../js/player')
const hardware = require('../js/hardware')
const frameText = require('../js/frametext')


// Set up colorpicker
colorPicker.start()

// Handle the DOM
webFrame.setZoomFactor(1.25)
var btnDeveloper = document.getElementById("btn-developer")
var btnAbout = document.getElementById('btn-about')
var btnBluetooth =document.getElementById('btn-bluetooth')
var allLinks = document.querySelectorAll('a[href]')


btnDeveloper.addEventListener("click", function() {remote.getCurrentWindow().toggleDevTools()})
btnAbout.addEventListener("click", openAbout)
btnBluetooth.addEventListener("click", openConnection)
document.addEventListener("keydown", globalKeyHandler)


// Handle all App shortcuts
function globalKeyHandler(e) {
  if (e.key === "+" && (e.ctrlKey || e.metaKey)) {
    // Zoom in
    webFrame.setZoomFactor(webFrame.getZoomFactor() + 0.25);
    if (webFrame.getZoomFactor() > 5) {webFrame.setZoomFactor(5)}
    console.log("Zoom: " + (webFrame.getZoomFactor() * 100) + "%")
  }
  else if (e.key === "-" && (e.ctrlKey || e.metaKey)) {
    // Zoom out
    webFrame.setZoomFactor(webFrame.getZoomFactor() - 0.25);
    if (webFrame.getZoomFactor() < 0.25) {webFrame.setZoomFactor(0.25)}
    console.log("Zoom: " + (webFrame.getZoomFactor() * 100) + "%")
  }
  else if((e.key === "r" && (e.ctrlKey || e.metaKey) ) || e.keyCode === 116) {
    // Reload ouput
    hardware.updateFrame(matrix.getPixelList())
  }
}


// Create a new Window when the about button clicked
var aboutWinId = null
function openAbout() {
  // check if the aboutwindow is just in background
  if (aboutWinId !== null)
  {
    //just focus the opend window
    BrowserWindow.fromId(aboutWinId).focus()
    return
  }

  const modalPath = path.join('file://', __dirname, 'about.html')
  let win = new BrowserWindow({
    width: 600,
    height: 450,
    frame: false,
    show: false,
    resizable: false,
    minimizable: false,
    titleBarStyle: 'hidden',
  })
  win.loadURL(modalPath)
  //win.webContents.openDevTools()  // Only for debugging
  win.once('ready-to-show', function () { win.show() })
  win.on('close', function () { win = null; aboutWinId = null })
  aboutWinId = win.id
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
var connectWinId = null
function openConnection() {
  // check if the connectionwindow is allready open
  if (connectWinId != null)
  {
    //close the window
    BrowserWindow.fromId(connectWinId).close()
    connectWinId = null
    return
  }

  const modalPath = path.join('file://', __dirname, 'connection.html')
  let win = new BrowserWindow({
    width: 600,
    height: 400,
    resizable: false,
    minimizable: false,
    title: "Select Hardware",
    icon: getIconPath(),
    backgroundColor: '#ffffff',
    parent: BrowserWindow.getFocusedWindow(),
    show: false
  })
  win.setMenu(null)
  win.loadURL(modalPath)
  //win.webContents.openDevTools()  // Only for debugging
  win.once('ready-to-show', function () { win.show() })
  win.on('close', function () { win = null; connectWinId = null })
  connectWinId = win.id
}

// The drag and drop support
var dragIndex = 0

document.ondragenter = () => {
  if (dragIndex == 0)
  {
    document.getElementById('drag-indicator').classList.remove('hidden')
    document.getElementById('window').classList.add('blur')
  }
  dragIndex++
  return false
}

document.ondragleave = () => {
  dragIndex--
  if (dragIndex == 0)
  {
    document.getElementById('drag-indicator').classList.add('hidden')
    document.getElementById('window').classList.remove('blur')
  }
  return false
}

document.body.ondrop = (e) => {
  e.preventDefault()
  document.getElementById('drag-indicator').classList.add('hidden')
  document.getElementById('window').classList.remove('blur')
  dragIndex = 0

  for(let i = 0; i < e.dataTransfer.files.length; i++)
  {
    pack.loadFile(e.dataTransfer.files[i].path)
  }
  return false
}
