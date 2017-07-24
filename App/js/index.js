const remote = require('electron').remote
const {webFrame} = require('electron')
const matrix = require('../js/mainmatrix')
matrix.start()  //start it up
const frame = require('../js/frame')
const pack = require('../js/pack')
const colorPicker = require('../js/colorpicker')
const player = require('../js/player')
const hardware = require('../js/hardware')


// Set up colorpicker
colorPicker.start()

webFrame.setZoomFactor(1.25)
var btnDeveloper = document.getElementById("btn-developer");
var btnLiveUpdate =  document.getElementById("btn-live-update");


btnDeveloper.addEventListener("click", function() {remote.getCurrentWindow().toggleDevTools();}, false);
btnLiveUpdate.addEventListener("click", toggleLiveUpdate, false);
document.addEventListener("keydown", globalKeyHandler, false);

var liveUpdate = false;
function toggleLiveUpdate() {
  if (liveUpdate) {
    liveUpdate = false;
    btnLiveUpdate.className = "btn btn-default";
  } else {
    liveUpdate = true;
    btnLiveUpdate.className = "active btn btn-default";
  }
}

function globalKeyHandler(e) {
  if (e.key === "+" && e.ctrlKey) {
    webFrame.setZoomFactor(webFrame.getZoomFactor() + 0.25);
    if (webFrame.getZoomFactor() > 5) {webFrame.setZoomFactor(5)}
    console.log("Zoom: " + (webFrame.getZoomFactor() * 100) + "%");
  } else if (e.key === "-" && e.ctrlKey) {
    webFrame.setZoomFactor(webFrame.getZoomFactor() - 0.25);
    if (webFrame.getZoomFactor() < 0.25) {webFrame.setZoomFactor(0.25)}
    console.log("Zoom: " + (webFrame.getZoomFactor() * 100) + "%");
  }
}
