/*
* Load some Module
*/
const frame = require('../js/frame')

/*
* DOM Elements
*/
var btnPlay = document.getElementById('btn-play-player')
var btnLoop = document.getElementById('btn-loop-player')

btnPlay.addEventListener('click', togglePlayPause)
btnLoop.addEventListener('click', toggleLoop)

var isPlaying = false
function togglePlayPause() {
  var btnText = btnPlay.children[0]
  if (isPlaying) {
    isPlaying = false
    btnText.classList.remove('icon-pause')
    btnText.classList.add('icon-play')
    clearTimeout(playerTimer)
  }
  else {
    isPlaying = true
    btnText.classList.remove('icon-play')
    btnText.classList.add('icon-pause')
    startPlayer()
  }
}

var isLoop = false
function toggleLoop() {
  if (isLoop) {
    isLoop = false
    btnLoop.classList.remove('active')
  }
  else {
    isLoop = true
    btnLoop.classList.add('active')
  }
}

var playerTimer = null
function displayNextFrame() {
  var current = frame.getframeSelected()
  var next
  var length = frame.getFrameListLength(9)

  // some error checking
  if (current === length - 1) {
    if (isLoop) {
      // start at the first frame
      next = 0
    }
    else {
      // stop the player
      togglePlayPause()
      return
    }
  }

  else {
    // next frame
    next = current + 1
  }

  // show the frame
  frame.changeSelectedFrame(next)

  // next frame after the timeout
  playerTimer = setTimeout(displayNextFrame, frame.getFrame().time)
}

function startPlayer() {
  setTimeout(displayNextFrame, frame.getFrame().time)
}
