/*
* Include all needed modules
*/
const electron = require('electron')
const app = electron.app
const os = require('os')
const BrowserWindow = electron.BrowserWindow
const windowStateKeeper = require('electron-window-state')

/*
* Keep a global reference of the window object, if you don't, the window will
* be closed automatically when the JavaScript object is garbage collected.
*/
let mainWindow


/*
* This function is needed thanks to the bad developer on the windows and mac
* side. Because the need their own "special" file format for the icons. That
* so useless because there aren't any benefits of having 3 fileformats for icons
* on 3 different operating systems. Why just they can't all use some standards
* like .png ???
*
* So this little function will return the right path of the icon for each OS.
*/
function getIconPath() {
  if (os.platform() === 'darwin') {
    return __dirname + '/img/icon.icns'
  }
  else if (os.platform() === 'win32') {
    return __dirname + '/img/icon.ico'
  }
  else {
    // For all other platforms like: linux, freebsd, openbsd
    return __dirname + '/img/icon.png'
  }
}

/*
* Create the main window
*/
function createWindow () {
  // Load the previous state with fallback to defaults
  var mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 950,
    minHeight: 650,
    icon: getIconPath(),
    backgroundColor: '#ffffff',
    title: "pixelFlow"
  })

  // disable the default menu bar
  mainWindow.setMenu(null)

  // maximize if it was the last time
  if (mainWindowState.isMaximized) {
        mainWindow.maximize()
    }

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/html/index.html`)

  // open dev tools (you can do this also in html, only use it here if render.js breaks)
  //mainWindow.webContents.openDevTools()


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // exit the app if the main window is gone
    mainWindow = null
    app.quit()
  })

  // Let the windowsStateManager handle the window
  mainWindowState.manage(mainWindow)
}

/*
* This method will be called when Electron has finished
* initialization and is ready to create browser windows.
* Some APIs can only be used after this event occurs.
*/
app.on('ready', createWindow)

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
