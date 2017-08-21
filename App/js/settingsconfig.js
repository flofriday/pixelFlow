/*
* This file sets the default values for all settings, just in case there aren't
* any settings.
*/
const settings = require('electron-settings')

// Zoom
if (settings.has('zoom') == false) {
  settings.set('zoom', {
    factor: 1
  })
}

// FileList
if (settings.has('fileList') == false) {
  settings.set('fileList', {
    open: [],
    recentOpen: []
  })
}

// Player
if (settings.has('player') == false) {
  settings.set('player', {
    isLoop: false,
    isLiveUpdate: false
  })
}

// Hardware
if (settings.has('hardware') == false) {
  settings.set('hardware', {
    usbConnected: '',
    bluetoothConnected: ''
  })
}
