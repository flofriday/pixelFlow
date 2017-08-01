/*
* Include other modules
*/
//const pack = require('../js/pack')
const matrix = require('../js/mainmatrix')
const biu = require('biu.js')

/*
* All DOM relatet stuff
*/
var frameUIContainer = document.getElementById('frame-container')
var inputTime = document.getElementById('input-time')
var btnAddFrame = document.getElementById('btn-add-frame')
var btnCopyFrame = document.getElementById('btn-copy-frame')
var btnDeleteFrame = document.getElementById('btn-delete-frame')

//sdocument.addEventListener('keydown', globalKeyHandler)
btnAddFrame.addEventListener('click', addCurFrame)
btnCopyFrame.addEventListener('click', copyCurFrame)
btnDeleteFrame.addEventListener('click', deleteCurFrame)

function globalKeyHandler (e) {
  if (e.keyCode == 37 && frameSelected > 0)
  {
    changeSelectedFrame(frameSelected - 1)
  }
  else if (e.keyCode == 39 && frameSelected < frameUIContainer.children.length - 1)
  {
    changeSelectedFrame(frameSelected + 1)
  }
}

frameUIContainer.onclick = function (e) {
  var el = e.target;
  while (el != document.body && el.tagName.toLowerCase() != "div") {
    el = el.parentNode;
  }
  changeSelectedFrame(parseInt([].indexOf.call(el.parentNode.children, el)));
}

function spawnFrameUI() {
  var frameUI = document.createElement('div')
  frameUI.classList.add('frame')
  if (frameUIContainer.children.length === 0 ){
    frameUI.classList.add('active')
  }
  frameUI.innerHTML = frameUIContainer.children.length + 1
  frameUIContainer.appendChild(frameUI)
}

function removeFrameUI() {
  frameUIContainer.removeChild(frameUIContainer.lastChild)
}

/* Make the container scroll vertical */
frameUIContainer.addEventListener("wheel", wheelManager);
function wheelManager(e) {
  frameUIContainer.scrollLeft += e.deltaY;
}


/*
* The Frame
*/
var frameList = []
var frameSelected = 0
var frameDefaultTime = 200
var frameDefaultContent = []
for (x = 0; x < 256; x++) {frameDefaultContent[frameDefaultContent.length] = "#000000"}

function Frame(time, content) {
  this.time = time // this is the time the frame last in ms
  this.content = content // this is a array of 256 hex colors
}

function getDefaultFrameList() {
  //var defaultFrameList = [new Frame(frameDefaultTime, frameDefaultContent)]
  return [new Frame(frameDefaultTime, frameDefaultContent)]
}

/* This will load the current settings from the UI into this libary */
function updateFrame() {
  frameList[frameSelected].time = inputTime.valueAsNumber
  frameList[frameSelected].content = matrix.getContent()
}

/* This will load the selected frame to the UI */
function showFrame() {
  inputTime.value = frameList[frameSelected].time
  matrix.loadContent(frameList[frameSelected].content)
}

function getFrameList() {
  updateFrame()
  return frameList
}

function loadFrameList(input) {
  lengthDiff = input.length - frameList.length
  changeSelectedFrame(0)

  frameList = input
  matrix.loadContent(input[0].content)
  showFrame()

  if (lengthDiff > 0) {
    for (i = 0; i < lengthDiff; i++) {
      spawnFrameUI()
    }
  }
  else if (lengthDiff < 0) {
    lengthDiff *= -1
    for (i = 0; i < lengthDiff; i++) {
      removeFrameUI()
    }
  }
}

function spawnFrame() {
  spawnFrameUI();
  frameList[frameList.length] = new Frame(frameDefaultTime, frameDefaultContent)
}

function addCurFrame() {
  newframe = new Frame(frameDefaultTime, frameDefaultContent)
  frameList.splice(frameSelected + 1, 0, newframe)
  spawnFrameUI()
  changeSelectedFrame(frameSelected + 1)
  if(frameList.length === 2) {pack.setTypeCurPack('Animation')}
}

function copyCurFrame() {
  updateFrame();
  spawnFrameUI();
  var newframe = JSON.parse(JSON.stringify(frameList[frameSelected]))
  frameList.splice(frameSelected + 1, 0, newframe)
  changeSelectedFrame(frameSelected + 1)
  if(frameList.length === 2) {pack.setTypeCurPack('Animation')}
}

function deleteCurFrame() {
  // There musst be allways at least one frame
  if (frameList.length <= 1) {
    biu('There must be at least one frame.', {type: 'warning', pop: true, el: document.getElementById('window')})
    return
  }

  frameList.splice(frameSelected, 1)
  if (frameSelected === frameList.length) {
    frameSelected--
    frameUIContainer.children[frameSelected].classList.add('active')
  }
  showFrame()
  removeFrameUI()
  if(frameList.length === 1) {pack.setTypeCurPack('Picture')}
}

function changeSelectedFrame(number) {
  // error checking
  if (number >= frameList.length) {number = frameList.length - 1}

  // dealing with the old frame
  if (frameUIContainer.children[frameSelected].classList.contains('active'))
  {
    frameUIContainer.children[frameSelected].classList.remove('active')
  }
  updateFrame()

  // the new selected frame
  frameSelected = number
  frameUIContainer.children[frameSelected].classList.add('active')
  showFrame()
}

function getframeSelected() {
  return frameSelected
}

function getFrameListLength() {
  return frameList.length
}

function getFrame() {
  return JSON.parse(JSON.stringify(frameList[frameSelected]))
}

/*
* Export of this module
*/
module.exports.updateFrame = updateFrame
module.exports.showFrame = showFrame
module.exports.getFrameList = getFrameList
module.exports.loadFrameList = loadFrameList
module.exports.getDefaultFrameList = getDefaultFrameList
module.exports.changeSelectedFrame= changeSelectedFrame
module.exports.getFrameListLength = getFrameListLength
module.exports.getframeSelected = getframeSelected
module.exports.getFrame = getFrame

spawnFrame()
