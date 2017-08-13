'use strict';
const SerialPort = require('serialport');
const biu = require('biu.js')


var port = null
var lastPortName = ""
var isConnected = false

function onOpen() {
  console.log('Connected to port \"' + port.path + '\"');
  biu('Port \"' + port.path + '\" Open', {type: 'success', pop: true, el: document.getElementById('window')})
  lastPortName = port.path
}

function onData(data) {
  console.log(`Received:\t${data}`);
  console.log(`Read Events:\t${byteCount}`);
}

function onClose() {
  console.log('port closed');
  biu('Disconnected from port \"' + lastPortName + '\"', {type: 'danger',pop: true, el: document.getElementById('window')})
}

function onError(error) {
  console.log(`there was an error with the serial port: ${error}`);
  if (port != null) {
    port.close();
    port = null;
  }
}


function connect(path) {
  var options =  {
    baudRate: 250000
  }

  if (port != null)
  {
    disconnect()
  }

  port = new SerialPort(path, options); // open the serial port:
  isConnected = true

  port.on('open', onOpen);
  //port.on('data', onData);
  port.on('close', onClose);
  port.on('error', onError);
}

function disconnect() {
  isConnected = false
  port.close()
  port = null
  console.log('disconnect')
}

function print(message) {
  if (port == null){return}
  if (port.isOpen){
    port.write(message)
  }
}

function println(message) {
  if (port == null){return}
  if (port.isOpen){
    port.write(message + "\n")
  }
}

module.exports.connect = connect
module.exports.disconnect = disconnect
module.exports.print = print
module.exports.println = println
