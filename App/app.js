/*
* Include all needed modules
*/
const electron = require('electron')
const app = electron.app
const os = require('os')
const BrowserWindow = electron.BrowserWindow
const windowStateKeeper = require('electron-window-state')
const dialog = electron.dialog
const ipc = electron.ipcMain

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

  // Emitted before closed
  mainWindow.on('close', function (e) {
    // ask the renderer for files are saved
    mainWindow.webContents.send('files-saved-request')

    var noIdea = this

    // prevent closing window
    e.preventDefault();

    ipc.once('files-saved-reply', function (event, isSaved) {
      // Ceck if is saved if so no need to display warning
      if (isSaved === true) { mainWindow.destroy(); return}

      //Ask to save
      var result = dialog.showMessageBox(noIdea,
        {
          type: 'warning',
          noLink: true,
          title: 'Unsaved File(s)',
          message: 'At least one File is unsaved.\nDo you want to go back and save ?',
          buttons: ['Save', 'Exit']
        })
        if (result == 1){
          // close window
          // TODO: I think destroy() is a too brutal method
          mainWindow.destroy()
        }
      })
    })


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
