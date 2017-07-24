/*
* Include all needed modules
*/
const electron = require('electron')
const app = electron.app
const webContents = electron.webContents
const os = require('os')
const BrowserWindow = electron.BrowserWindow

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
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: getIconPath(),
    backgroundColor: '#ffffff',
    title: "pixelFlow",
    webPreferences: {
      webgl: false,
      webaudia: false
    }
  })

  // disable the default menu bar
  mainWindow.setMenu(null)

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/html/index.html`)

  // open dev tools (you can do this also in html only use it here if render.js breaks)
  mainWindow.webContents.openDevTools()


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // exit the app if the main window is gone
    mainWindow = null
    app.quit()
  })


  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault()
    let result = deviceList.find((device) => {
      return device.deviceName === 'test'
    })
    if (!result) {
      callback('')
    } else {
      callback(result.deviceId)
    }
  })
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
