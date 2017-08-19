const {remote} = require('electron')
const {Menu, MenuItem} = remote
const electron = require('electron')
const pack = require('../js/pack')
const frame = require('../js/frame')
const matrix = require('../js/mainmatrix')
const frameText = require('../js/frametext')
const player = require('../js/player')
const hardware = require('../js/hardware')
const windowMaker = require('../js/windowmaker')

const platform = process.platform
//const platform = 'win32' // darwin, freebsd, linux, win32

var template = []
const name = 'pixelFlow'

/*
* The App Menu (macOS)
*/
if (platform == 'darwin') {
  var appMenu = {
    label: name,
    submenu: [
      {
        lable: 'About ' + name,
        click() { windowMaker.openAbout() }
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit'
      }
    ]
  }
  template.push(appMenu)
}

/*
* The File Menu
*/
var fileMenu = {
  label: 'File',
  submenu: [
    {
      label: 'New',
      accelerator: 'CmdOrCtrl+N',
      click(){pack.newFile()}
    },
    {
      label: 'Open...',
      accelerator: 'CmdOrCtrl+O',
      click(){pack.openFile()}
    },
    /* TODO: Open recent */
    {
      label: 'Save...',
      accelerator: 'CmdOrCtrl+S',
      click(){pack.saveFile()}
    },
    {
      label: 'Save As...',
      accelerator: 'CmdOrCtrl+Shift+S',
      click(){pack.saveAsFile()}
    },
    {
      label: 'Duplicate',
      accelerator: 'CmdOrCtrl+D',
      click(){pack.copyFile()}
    },
    /* TODO: Rename */
    {
      // Show in filemanager
      label: (() => {
        if (platform == 'darwin') {
          // Finder for macOS
          return 'Show in Finder...'
        }
        else if (platform == 'win32') {
          // Explorer for windows
          return 'Show in Explorer...'
        }
        else {
          // Filemanager for linux and freebsd
          return 'Show in Filemanager...'
        }
      })(),
      click() { pack.showInManager() }
    },
    {
      label: 'Close',
      click(){pack.closeFile()}
    }
  ]
}
// Add exit item for non macOS
if (platform != 'darwin') {
  fileMenu.submenu.push({
    type: 'separator'
  },
  {
    label: 'Exit',
    accelerator: 'CmdOrCtrl+Q',
    role: 'quit'
  }
)}
template.push(fileMenu)


// The Frame Menu
var frameMenu = {
  label: 'Frame',
  submenu: [
    {
      label: 'New',
      accelerator: 'CmdOrCtrl+Alt+N',
      click(){ frame.newFrame() }
    },
    {
      label: 'Duplicate',
      accelerator: 'CmdOrCtrl+Alt+D',
      click(){ frame.copyFrame() }
    },
    {
      label: 'Delete',
      accelerator: 'CmdOrCtrl+Alt+W',
      click(){ frame.deleteFrame() }
    },
    {
      type: 'separator'
    },
    {
      label: 'Fill',
      click(){ matrix.fillPixelsSelectedColor() }
    },
    {
      label: 'Clear',
      click(){ matrix.clearPixels() }
    },
    {
      type: 'separator'
    },
    {
      label: 'Add Text',
      click(){ frameText.enterText() }
    }
  ]
}
template.push(frameMenu)


// The Device Menu
var deviceMenu = {
  label: 'Device',
  submenu: [
    {
      label: 'Connect...',
      click(){ windowMaker.openConnection() }
    },
    {
      label: 'Refresh Output',
      accelerator: 'CmdOrCtrl+R',
      click() { hardware.updateFrame(matrix.getPixelList()) }
    },
    {
      type: 'separator'
    },
    {
      label: 'Play / Pause',
      click(){ player.togglePlayPause() }
    },
    {
      label: 'Toggle LiveUpdate',
      click(){ hardware.toggleLiveUpdate() }
    },
    {
      label: 'Toggle Loop',
      click(){ player.toggleLoop() }
    }
  ]
}
template.push(deviceMenu)

// The View Menu
var viewMenu = {
  label: 'View',
  submenu: [
    {
      role: 'togglefullscreen'
    },
    {
      type: 'separator'
    },
    {
      lable: 'Reset Zoom',
      role: 'resetzoom'
    },
    {
      role: 'zoomin',
      accelerator: 'CmdOrCtrl+='
    },
    {
      role: 'zoomout',
      accelerator: 'CmdOrCtrl+-'
    },
    {
      type: 'separator'
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click (item, focusedWindow) {
        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
      }
    }
  ]
}
template.push(viewMenu)

// The Window Menu (macOS)
if (platform == 'darwin') {
  var winMenu = {
    role: 'window',
    submenu: [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Zoom',
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    ]
  }
  template.push(winMenu)
}

// The Help Menu
var helpMenu = {
  role: 'help',
  submenu: [
    {
      label: 'Github...',
      click () { require('electron').shell.openExternal('https://www.github.com/flofriday/pixelflow') }
    },
    {
      label: 'Report issue...',
      click () { require('electron').shell.openExternal('https://github.com/flofriday/pixelFlow/issues/new') }
    },
    {
      label: 'License...',
      click () { require('electron').shell.openExternal('https://www.github.com/flofriday/pixelflow/blob/master/LICENSE') }
      /* TODO Add link to handbook */
    }
  ]
}
// Add about item for non macOS
if (platform != 'darwin') {
  helpMenu.submenu.push({
    type: 'separator'
  },
  {
    label: 'About ' + name,
    click () { windowMaker.openAbout() }
  }
)}
template.push(helpMenu)


// Apply the menu
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
