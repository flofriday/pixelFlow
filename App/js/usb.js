'use strict';
const SerialPort = require('serialport');


var path = 'COM7'

var options =  {
  baudRate: 250000
}

const port = new SerialPort(path, options); // open the serial port:

function onOpen() {
  console.log('Port Open');
}

var buffer = ""
function onData(data) {
  console.log(`Received:\t${data}`);
  console.log(`Read Events:\t${byteCount}`);
}

function onClose() {
  console.log('port closed');
}

function onError(error) {
  console.log(`there was an error with the serial port: ${error}`);
  port.close();
}

port.on('open', onOpen);
//port.on('data', onData);
port.on('close', onClose);
port.on('error', onError);


function print(message) {
  port.write(message);
}

function println(message) {
  port.write(message + "\n");
}

module.exports.print = print
module.exports.println = println
