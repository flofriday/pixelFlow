// Load modules
const electron = require('electron')
const remote = electron.remote
const webFrame = electron.webFrame
const ipc = electron.ipcRenderer
const os = require('os')
const settings = require('electron-settings')
const windowConfig = require('../js/windowconfig')
const matrix = require('../js/mainmatrix')
matrix.start()  //start it up
const frame = require('../js/frame')
const pack = require('../js/pack')
const colorPicker = require('../js/colorpicker')
const player = require('../js/player')
const hardware = require('../js/hardware')
const frameText = require('../js/frametext')
const app_menu = require('../js/app_menu')
const settingsConfig = require('../js/settingsconfig')
const windowMaker = require('../js/windowmaker')


// Set up colorpicker
colorPicker.start()

// Handle the DOM
var btnDeveloper = document.getElementById("btn-developer")
var btnAbout = document.getElementById('btn-about')
var btnBluetooth =document.getElementById('btn-bluetooth')
var allLinks = document.querySelectorAll('a[href]')


btnDeveloper.addEventListener("click", function() {remote.getCurrentWindow().toggleDevTools()})
btnAbout.addEventListener("click", windowMaker.openAbout)
btnBluetooth.addEventListener("click", windowMaker.openConnection)
document.addEventListener("keydown", globalKeyHandler)


// Handle all App shortcuts
function globalKeyHandler(e) {
  if (e.key === "+" && (e.ctrlKey || e.metaKey)) {
    // Zoom in
    webFrame.setZoomFactor(webFrame.getZoomFactor() + 0.1);
    if (webFrame.getZoomFactor() > 5) {webFrame.setZoomFactor(5)}
    settings.set('zoom.factor', webFrame.getZoomFactor())
    console.log("Zoom: " + (webFrame.getZoomFactor() * 100) + "%")
  }
  else if (e.key === "-" && (e.ctrlKey || e.metaKey)) {
    // Zoom out
    webFrame.setZoomFactor(webFrame.getZoomFactor() - 0.1);
    if (webFrame.getZoomFactor() < 0.20) {webFrame.setZoomFactor(0.20)}
    settings.set('zoom.factor', webFrame.getZoomFactor())
    console.log("Zoom: " + (webFrame.getZoomFactor() * 100) + "%")
  }
  else if(e.keyCode === 116) {
    // Reload output (F5)
    hardware.updateFrame(matrix.getPixelList())
  }
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
