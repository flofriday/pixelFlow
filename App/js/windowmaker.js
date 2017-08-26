/*
* This file is reponsable to open windows like the about or connection window.
*/

/*
* Load needed modules
*/
const electron = require('electron')
const remote = electron.remote
const BrowserWindow = electron.remote.BrowserWindow
const path = require('path')
const settings = require('electron-settings')

/*
* Create the windows
*/


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

// Create the About Window
var aboutWinId = null
function openAbout() {
  // check if the aboutwindow is just in background
  if (aboutWinId !== null)
  {
    //just focus the opend window
    BrowserWindow.fromId(aboutWinId).focus()
    return
  }

  const modalPath = path.join('file://', __dirname, '../html/about.html')
  let win = new BrowserWindow({
    width: 600 * settings.get('zoom.factor'),
    height: 450 * settings.get('zoom.factor'),
    frame: false,
    show: false,
    resizable: false,
    minimizable: false,
    titleBarStyle: 'hidden',
    title: "About pixelFlow",
    icon: getIconPath()
  })
  win.loadURL(modalPath)
  //win.webContents.openDevTools()  // Only for debugging
  win.once('ready-to-show', function () { win.show() })
  win.on('close', function () { win = null; aboutWinId = null })
  aboutWinId = win.id
}

// Create the Connection Window
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

  const modalPath = path.join('file://', __dirname, '../html/connection.html')
  let win = new BrowserWindow({
    width: 400 * settings.get('zoom.factor'),
    height: 300 * settings.get('zoom.factor'),
    resizable: false,
    minimizable: false,
    title: "Select Hardware",
    icon: getIconPath(),
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

/*
* Export the Module
*/
module.exports.openAbout = openAbout
module.exports.openConnection = openConnection
