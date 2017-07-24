module.exports.start = start
module.exports.setColor = setColor

const matrix = require('../js/mainmatrix')

var picker
var canvas = document.getElementById('picker')

canvas.addEventListener('mousedown', updateSelectedColor);

function updateSelectedColor() {
  matrix.setColor(picker.getCurColorHex())
}

function setColor(input) {
 picker.setColorByHex(input)
}

function start () {
  picker = new KellyColorPicker({
    place : 'picker',
    input : 'color',
    method : 'triangle',
    size : 160
  });
  picker.addUserEvent("change",  updateSelectedColor)
  matrix.setColor(picker.getCurColorHex())
}
