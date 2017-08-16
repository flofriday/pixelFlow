const {remote} = require('electron')
const {Menu, MenuItem} = remote
const electron = require('electron')
const pack = require('../js/pack')
const frame = require('../js/frame')
const matrix = require('../js/mainmatrix')
const frameText = require('../js/frametext')

//const platform = process.platform
const platform = 'darwin' // darwin, freebsd, linux, win32

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
        role: 'about'
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
    /* TODO: Open recent*/
    /* TODO: Open in explorer*/
    {
      label: 'Save As...',
      accelerator: 'CmdOrCtrl+S',
      click(){pack.saveFile()}
    },
    {
      label: 'Duplicate',
      accelerator: 'CmdOrCtrl+D',
      click(){pack.saveFile()}
    },
    /* TODO: Rename */
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
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
      click(){  }
    },
    {
      label: 'Refresh Output',
      accelerator: 'CmdOrCtrl+R',
      click() {}
    },
    {
      type: 'separator'
    },
    {
      label: 'Play / Pause',
      click(){  }
    },
    {
      label: 'Toggle LiveUpdate',
      click(){  }
    },
    {
      label: 'Toggle Loop',
      click(){  }
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
      role: 'zoomin'
    },
    {
      role: 'zoomout'
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
    click () {}
  }
)}
template.push(helpMenu)


// Apply the menu
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
