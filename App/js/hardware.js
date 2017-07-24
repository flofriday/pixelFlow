const usb = require('../js/usb')
//const bluetooth = require('../js/bluetooth')

var connection = 'usb';

var liveUpdate = true
function setLiveUpdate(state) {
  liveUpdate = state;
}

function updatePixel(row, col, color) {
  if (liveUpdate !== true) {return}

  var firstByte = '4'
  var output = ''
  row = 15 - row
  row = row.toString(16)
  col = col.toString(16)
  color = color.substring(1, color.length)

  output = firstByte + row + col + color

  // check if the instruction is too long / short
  if (output.length !== 9) {return}

  if (connection === 'usb') {
    usb.println(output)
  }
  else  if (connection === 'bluetooth'){
    // bluetooth.println(output)
  }
}

function updateFrame(pixelList) {
  if (liveUpdate !== true) {return}

  var firstByte = '1'
  var output = firstByte

  // Create the output string
  for (var r = 15; r >= 0; r--) {
    for (var c = 0; c < 16; c++) {
      output += pixelList[c][r].color.substring(1)
    }
  }
  console.log(output)

  // check if the instruction is too long / short
  if (output.length !== 1537) {
    console.error('Output is: ' + output.length)
    return
  }

  if (connection === 'usb') {
    usb.println(output)
  }
  else  if (connection === 'bluetooth'){
    // bluetooth.println(output)
  }
}

function updateBrightness(brightness) {
  if (liveUpdate !== true) {return}
  var firstByte = '0'
  var output = '' + brightness

  // so the instruction has the needed length
  while(output.length < 3) {
    output = '0' + output
  }

  // Add the first Byte
  output = firstByte + output

  if (connection === 'usb') {
    usb.println(output)
  }
  else  if (connection === 'bluetooth'){
    // bluetooth.println(output)
  }
}

module.exports.updatePixel = updatePixel
module.exports.updateFrame = updateFrame
module.exports.updateBrightness = updateBrightness
module.exports.setLiveUpdate = setLiveUpdate
