/*
* Load Modules
*/
const colorpicker = require('../js/colorpicker')
const hardware = require('../js/hardware')

/*
* Include DOM objects
*/
var canvas = document.getElementById("matrix")
var ctx = canvas.getContext("2d")
var btnBrush = document.getElementById("btn-brush")
var btnPipette = document.getElementById("btn-pipette")
var btnText = document.getElementById("btn-text-frame")
var btnFillFrame = document.getElementById("btn-fill-frame")
var btnClearFrame = document.getElementById("btn-clear-frame")


/*
* Dealing with the Inputs
*/
canvas.addEventListener("mousemove", mouseHandler, false)
canvas.addEventListener("mousedown", mouseHandler, false)
window.addEventListener('resize', resizeHandler, false)
btnBrush.addEventListener("click", function(){activatePipette(false)}, false)
btnPipette.addEventListener("click", function(){activatePipette(true)}, false)
btnFillFrame.addEventListener("mousedown", function(){fillPixels(colorSelected);}, false);
btnClearFrame.addEventListener("mousedown", clearPixels, false);

// Dealing with the pipette
var isPipette = false
function activatePipette(input) {
  if (input) {
    isPipette = true;
    btnBrush.classList.remove('active')
    btnPipette.classList.add('active')
  }
  else {
    isPipette = false;
    btnPipette.classList.remove('active')
    btnBrush.classList.add('active')
  }
}

function mouseHandler(e) {
  var x = e.clientX - canvas.offsetLeft - canvas.offsetParent.offsetLeft - canvas.style.padding
  var y = e.clientY - canvas.offsetTop -canvas.offsetParent.offsetTop - canvas.style.padding
  var row = 0;
  var colum = 0;

  //simple error checking
  if (x < 0 || x > canvas.offsetWidth || y < 0 || y > canvas.offsetHeight || (e.buttons != 1 && e.buttons !=2)) {
    return;
  }

  // calculating the row and colum of the clicked pixel
  row = Math.floor(y / (canvas.offsetHeight / pixelNumber))
  colum = Math.floor(x / (canvas.offsetWidth / pixelNumber))
  // correct errors caused by the calculation above
  if (row > 15) {row = 15}
  if (colum > 15) {colum = 15}

  /*
  * Now we know which pixel but we don't know if the pipette or the brush is
  * selected. So lets do this
  */
  if (isPipette) {
    if (e.buttons) {
      colorPicker.setColor(pixelList[colum][row].color)
      activatePipette(false)
    }
  }
  else {
    var newColor
    e.buttons == 1 ? newColor = colorSelected : newColor = "#000000"

    // check if the color even has to change
    if (newColor !== pixelList[colum][row].color) {
      // write matrix
      pixelList[colum][row].color = newColor

      // write to hardware
      hardware.updatePixel(row, colum, newColor)
    }
  }
}

function resizeHandler () {
  totalX = canvas.offsetParent.offsetWidth
  totalY = canvas.offsetParent.offsetHeight - 52
  if (totalX < totalY) {
    canvas.style.height = (totalX - 40) + "px"
    canvas.style.width = (totalX - 40) + "px"
    canvas.style.marginLeft = "20px"
    canvas.style.marginTop = ((totalY - (totalX - 40)) / 2) + "px"
  } else {
    canvas.style.height = (totalY - 40) + "px"
    canvas.style.width = (totalY - 40) + "px"
    canvas.style.marginTop = "20px"
    canvas.style.marginLeft = ((totalX - (totalY - 40)) / 2) + "px"
  }
}

/*
* The color
*/
colorSelected = '#000000'
function setColor(color) {
  colorSelected = color
}

/*
* This function is needed because shitty JS has only one dimensioal arrays.
*/
function Create2DArray(rows) {
  var arr = []
  for (var i=0;i<rows;i++) {
    arr[i] = []
  }
  return arr
}


/*
* The Pixels
*/
var pixelNumber = 16
var pixelBorder = 2
var pixelList = Create2DArray(pixelNumber)
spawnPixel()
function Pixel (color) {
  this.color = color
}

function spawnPixel() {
  for (var c = 0; c < pixelNumber; c++) {
    for (var r = 0; r < pixelNumber; r++) {
      pixelList[c][r] = new Pixel("#000000")
    }
  }
}

function fillPixels(color){
  for (var c = 0; c < pixelNumber; c++) {
    for (var r = 0; r < pixelNumber; r++) {
      pixelList[c][r].color = color
    }
  }
  hardware.updateFrame(pixelList)
}

function clearPixels(){
  fillPixels("#000000")
}

function loadContent(input) {
  var x = 0;
  for (var r = 0; r < pixelNumber; r++) {
    for (var c = 0; c < pixelNumber; c++) {
      pixelList[c][r].color = input[x]
      x++
    }
  }
  hardware.updateFrame(pixelList)
}

function getContent() {
  var obj = []
  for (var r = 0; r < pixelNumber; r++) {
    for (var c = 0; c < pixelNumber; c++) {
      obj[obj.length] = pixelList[c][r].color
    }
  }
  return obj
}

function getPixelList() {
  return pixelList
}

function drawPixel() {
  for (var c = 0; c < pixelNumber; c++) {
    for (var r = 0; r < pixelNumber; r++) {
      ctx.beginPath()
      ctx.rect(c * (canvas.width / pixelNumber), r * (canvas.height / pixelNumber), canvas.width / pixelNumber, canvas.height / pixelNumber)
      ctx.fillStyle = pixelList[c][r].color
      ctx.fill()
      ctx.lineWidth="2"
      ctx.strokeStyle="#999999"
      ctx.stroke()
      ctx.closePath()
    }
  }

  // make the outline black
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.lineWidth="2"
  ctx.strokeStyle="#000000"
  ctx.stroke()
  ctx.closePath()
}



/*
* The main drawing function
*/
function draw() {
  drawPixel()
  requestAnimationFrame(draw)
}

function start() {
  resizeHandler()
  draw()
}

/*
* Export all necessesary functions
*/
module.exports.start = start
module.exports.setColor = setColor
module.exports.clearPixels = clearPixels
module.exports.fillPixels = fillPixels
module.exports.getContent = getContent
module.exports.loadContent = loadContent
module.exports.getPixelList = getPixelList
