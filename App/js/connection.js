const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer
const BrowserWindow = electron.remote.BrowserWindow
const serialPort = require('serialport')
const biu = require('biu.js')

var btnClose = document.getElementById('btn-close')
var btnConnect = document.getElementById('btn-connect')
var btnRefresh = document.getElementById('btn-refresh')
var table = document.getElementById('table-content')

btnClose.addEventListener('click', () => {BrowserWindow.getFocusedWindow().close()})
btnConnect.addEventListener('click', connect)
btnRefresh.addEventListener('click', loadDevices)
document.addEventListener("keydown", globalKeyHandler)

// Check which row was clicked
table.onmousedown = function (e) {
  var el = e.target;
  while (el != document.body && el.tagName.toLowerCase() != "tr") {
    el = el.parentNode;
  }
  changeSelectedDevice(parseInt([].indexOf.call(el.parentNode.children, el)));
}

// Handle all key shortcuts
function globalKeyHandler(e) {
  if((e.key === "r" && (e.ctrlKey || e.metaKey) ) || e.keyCode === 116) {
    // Reload devices
    loadDevices()
  }
  else if(e.keyCode === 123) {
    // Open Dev Tools
    remote.getCurrentWindow().toggleDevTools()
  }
}


function spawnDeviceUI(name, manufacturer) {
  var row = table.insertRow(deviceList.length - 1)
  var cell1 = row.insertCell(0)
  var cell2 = row.insertCell(1)
  cell1.innerHTML = name
  cell2.innerHTML = manufacturer
}

function loadDevices() {
  serialPort.list(function (err, ports) {

    // clear the UI
    table.innerHTML = ""
    deviceSelected = null
    deviceList = []

    // create the UI
    ports.forEach(function(port) {
      deviceList.push(port.comName)
      spawnDeviceUI(port.comName, port.manufacturer)
    })
  })
}

var deviceSelected = null
var deviceList = []
function changeSelectedDevice(input) {
  // check if there is even a device selected
  if (deviceSelected != null) {
    // remove the active class
    table.children[deviceSelected].classList.remove('active')
  }


  if (deviceSelected === input) {
    // if clicked on the selected device it should now be unselected
    deviceSelected = null
  }
  else {
    // add the active class to the nuw selected
    deviceSelected = input
    table.children[deviceSelected].classList.add('active')
  }
}

function connect() {
  // check if any device is selected
  if (deviceSelected == null) {
    biu('You musst select a device to connect to it.', {type: 'warning', pop: true, el: document.getElementById('window')})
    return
  }

  // connect to the device
  var port = deviceList[deviceSelected]
  console.log('connect to: ' + port)
  var mainWindow = BrowserWindow.getFocusedWindow().getParentWindow()
  mainWindow.webContents.send('connect-usb', port)

  // close the window
  window.close()
}

loadDevices()
