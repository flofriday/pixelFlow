/*
* This file creates svg files from the pixelList.
* The vector graphics will be than used to preview a frame / file.
*/
const matrix = require('../js/mainmatrix.js')

// draw the svg
function drawSvg (input) {
var vector

}

// loads the current content from the matrix and creates the svg
function getFromMatrix () {
  return drawSvg( matrix.getPixelList() )
}

// creates the svg from the input given
function getFromContent (content) {
  // create the pixelList
  var obj = []
  const arr = []
  var x = 0
  for (var r = 0; r < 16; r++) {
    obj.push(arr)
    for (var c = 0; c < 16; c++) {
      pixelList[c][r].color = input[x]
      x++
    }
  }

  return drawSvg(obj)
}

module.exports.getFromMatrix = getFromMatrix
module.exports.getFromContent = getFromContent
