/*
* Export the module
*/
module.exports.loadFile = loadFile

/*
* Include all needed modules
*/
const frame = require('../js/frame')
const hardware = require('../js/hardware')
const biu = require('biu.js')
const app = require('electron').remote
const dialog = app.dialog
const fs = require('fs')
const path = require('path')
const shell = electron.shell
const settings = require('electron-settings')
const ipc = electron.ipcRenderer

/*
* All DOM related stuff
*/
var packUIContainer = document.getElementById('pack-container')
var inputBrightness = document.getElementById('input-brightness')
var btnSavePack = document.getElementById('btn-save-pack')
var btnOpenPack =  document.getElementById('btn-open-pack')
var btnAddPack = document.getElementById('btn-add-pack')
var btnCopyPack = document.getElementById('btn-copy-pack')
var btnDeletePack = document.getElementById('btn-delete-pack')

btnSavePack.addEventListener('click', saveFile)
btnOpenPack.addEventListener('click', openFile)
btnAddPack.addEventListener('click', addCurPack)
btnCopyPack.addEventListener('click', copyCurPack)
btnDeletePack.addEventListener('click', deleteCurPack)
inputBrightness.addEventListener('click', updateBrightness)
inputBrightness.addEventListener('change', updateBrightness)

function updateBrightness() {
  hardware.updateBrightness(inputBrightness.valueAsNumber)
}

packUIContainer.onclick = function (e) {
  var el = e.target;
  while (el != document.body && el.tagName.toLowerCase() != "li") {
    el = el.parentNode;
  }
  changeSelectedPack(parseInt([].indexOf.call(el.parentNode.children, el)));
}

function spawnPackUI(index, name, type) {
  var newPack = document.createElement("li")
  newPack.classList.add('list-group-item')
  if (packUIContainer.children.length === 0 ){
    newPack.classList.add('active')
  }
  newPack.innerHTML = '<img class="img-circle media-object pull-left" src="../img/logo64.png" width="32" height="32"><div class="media-body"><strong contenteditable="true" tabindex="-1" placeholder="Enter a name">' + name + '</strong><p>' + type + '</p></div>'
  packUIContainer.insertBefore(newPack, packUIContainer.children[index])
}

function removePackUI(index) {
  packUIContainer.removeChild(packUIContainer.children[index])
}

/*
*  The Pack
*/
var packList = []
var packSelected = 0
var packDefaultName = "New File"
var packDefaultPath = null
var packDefaultIsSaved = false
var packDefaultBrightness = 40
var packDefaultSelected = 0
var packDefaultType = "Picture"
var packDefaultFrameList = frame.getDefaultFrameList()
function Pack(name, path, isSaved, brightness, selectedFrame, type, frameList) {
  this.name = name
  this.path = path
  this.brightness = brightness
  this.selectedFrame = selectedFrame
  this.type = type
  this.frameList = frameList
}

// Open a save-dialog and save the pack
function saveAsFile() {
  var index = packSelected
  updatePack()

  // Create the string to save
  var content = JSON.parse(JSON.stringify(packList[index]))
  delete content.name
  delete content.path
  delete content.type
  delete content.selectedFrame
  content = JSON.stringify(content)

  // create the options for the dialog
  var options = {
    title: 'Save the file "' + packList[index].name + '"',
    defaultPath: packList[index].path ,
    filters: [
      { name: 'pixelflow', extensions: ['pixelflow'] }
    ]
  }

  // check if the path exists
  if (fs.existsSync(options.defaultPath) === false) {
    //delete options.defaultPath
    options.defaultPath = packList[index].name + '.pixelflow'
  }

  // show the save dialog
  dialog.showSaveDialog(options, function(fileName) {
    // error checking
    if (fileName === undefined) {return}

    // Save the file
    fs.writeFile(fileName, content, function (err) {
      if(err){
        biu('Error at saving file"' + packList[index].name + '": ' + err, {type: 'danger', pop: true, el: document.getElementById('window')})
      }
      else
      {
        packList[index].name = path.basename(fileName, '.pixelflow')
        packList[index].path = fileName
        packList[index].isSaved = true
        biu('Saved successfully.', {type: 'success', pop: true, el: document.getElementById('window')})

        // Update the settings
        settings.set('fileList.open', getAllFilesPaths())
      }
    })
  })
}

// Save the file without a dialog
function saveFile() {
  var index = packSelected
  updatePack()

  // Create the string to save
  var content = JSON.parse(JSON.stringify(packList[index]))
  delete content.name
  delete content.path
  delete content.type
  delete content.selectedFrame
  content = JSON.stringify(content)

  // check if the path exists
  if (fs.existsSync(packList[index].path) === false) {
    // the path doesn't exist so do 'save as'
    saveAsFile()
    return
  }

  // check if the path is a file


  // Save the file
  fileName = packList[index].path
  fs.writeFile(fileName, content, function (err) {
    if(err){
      biu('Error at saving file"' + packList[index].name + '": ' + err, {type: 'danger', pop: true, el: document.getElementById('window')})
    }
    else
    {
      packList[index].name = path.basename(fileName, '.pixelflow')
      packList[index].path = fileName
      packList[index].isSaved = true
      biu('Saved successfully.', {type: 'success', pop: true, el: document.getElementById('window')})

      // Update the settings
      settings.set('fileList.open', getAllFilesPaths())
    }
  })
}

// Open a open-dialog and load a file
function openFile() {
  var options = {
    title: 'Open a file',
    filters: [
      { name: 'pixelflow', extensions: ['pixelflow'] }
    ],
    properties : [
      'openFile',
      'multiSelections',
      'createDirectory'
    ]
  }


  dialog.showOpenDialog(options, function (fileNames) {
    // error checking
    if (fileNames === undefined) {return}

    for (i = 0; i < fileNames.length; i++) {
      loadFile(fileNames[i])
    }
  })
}

// Load a file given the path as input
function loadFile(fileName) {
  // check for right file-type
  if (path.extname(fileName).toLowerCase() !== '.pixelflow') {
    // wrong fily-type
    biu('The file "' + path.basename(fileName) + '" is not a .pixelflow file!', {type: 'danger', pop: true, el: document.getElementById('window')})
    return
  }


  fs.readFile(fileName, 'utf-8', function (err, data) {
    // error checking
    if (err) {
      biu('Error at opening the file "' + fileName + '": ' + err, {type: 'danger', pop: true, el: document.getElementById('window')})
    }
    else {
      var obj = JSON.parse(data)
      var name = path.basename(fileName, '.pixelflow')
      var type
      if (obj.frameList.length > 2) {
        type = "Animation"
      }
      else {
        type = "Picture"
      }

      var newPackId = packSelected + 1
      var newPack = new Pack(name, fileName, true, obj.brightness, packDefaultSelected, type, obj.frameList)
      packList.splice(newPackId, 0, newPack)
      spawnPackUI(newPackId, newPack.name, type)
      changeSelectedPack(newPackId)

      // Update the settings
      settings.set('fileList.open', getAllFilesPaths())
    }
  })
}

function loadFirstFile (fileName) {
  // check for right file-type
  if (path.extname(fileName).toLowerCase() !== '.pixelflow') {
    // wrong fily-type
    biu('The file "' + path.basename(fileName) + '" is not a .pixelflow file!', {type: 'danger', pop: true, el: document.getElementById('window')})
    return
  }


  fs.readFile(fileName, 'utf-8', function (err, data) {
    // error checking
    if (err) {
      biu('Error at opening the file "' + fileName + '": ' + err, {type: 'danger', pop: true, el: document.getElementById('window')})
    }
    else {
      var obj = JSON.parse(data)
      var name = path.basename(fileName, '.pixelflow')
      var type
      if (obj.frameList.length > 2) {
        type = "Animation"
      }
      else {
        type = "Picture"
      }

      var newPackId = 0
      var newPack = new Pack(name, fileName, true, obj.brightness, packDefaultSelected, type, obj.frameList)
      packList.push(newPack)
      spawnPackUI(newPackId, newPack.name, type)
      packSelected = 0
      showPack()

      // Update the settings
      settings.set('fileList.open', getAllFilesPaths())
    }
  })
}

function updatePack() {
  var oldPack = JSON.stringify(packList[packSelected]);
  packList[packSelected].name = packUIContainer.children[packSelected].children[1].children[0].innerText
  packList[packSelected].brightness = inputBrightness.valueAsNumber
  packList[packSelected].frameList = frame.getFrameList()
  packList[packSelected].selectedFrame = frame.getframeSelected()


  newPack = JSON.stringify(packList[packSelected]);
  if (oldPack !== newPack) {
    packList[packSelected].isSaved = false
    console.log('Not the same')
  }

  // Delete Path when renamed
  if (packList[packSelected].path != null) {
    if (packList[packSelected].name !== path.basename(packList[packSelected].path, '.pixelflow')) {
      packList[packSelected].path = null
    }
  }
}

function showPack() {
  packUIContainer.children[packSelected].children[1].children[0].innerText = packList[packSelected].name
  inputBrightness.value = packList[packSelected].brightness
  frame.loadFrameList(packList[packSelected].frameList)
  frame.changeSelectedFrame(packList[packSelected].selectedFrame)
}

function spawnPack() {
  spawnPackUI(packUIContainer.children.length, packDefaultName, packDefaultType)
  packList[packList.length] = new Pack(packDefaultName, packDefaultPath, packDefaultIsSaved, packDefaultBrightness, packDefaultSelected, packDefaultType, frame.getDefaultFrameList())
  showPack()
}

function addCurPack() {
  var newPack = new Pack(packDefaultName, packDefaultPath, packDefaultIsSaved, packDefaultBrightness, packDefaultSelected, packDefaultType, frame.getDefaultFrameList())
  packList.splice(packSelected + 1, 0, newPack)
  spawnPackUI(packSelected + 1, packDefaultName, packDefaultType)
  changeSelectedPack(packSelected + 1)
}

function copyCurPack() {
  updatePack()
  var newPack = JSON.parse(JSON.stringify(packList[packSelected]));
  newPack.path = null // The new copy can't have the same path
  newPack.isSaved = false
  packList.splice(packSelected + 1, 0, newPack)
  spawnPackUI(packSelected + 1, packDefaultName, packDefaultType)
  changeSelectedPack(packSelected + 1)
}

function deleteCurPack() {
  // There musst be allways at least one frame
  if (packList.length <= 1) {
    biu('There must be at least one file open.', {type: 'warning', pop: true, el: document.getElementById('window')})
    return
  }

  packList.splice(packSelected, 1)
  if (packSelected === packList.length) {
    packSelected--
  }
  showPack()
  removePackUI(packSelected)
  packUIContainer.children[packSelected].classList.add('active')

  // Update the settings
  settings.set('fileList.open', getAllFilesPaths())
}

// Open the filemanager in the directory where the current file is
function showInManager() {
  index = packSelected

  // check if the path exists
  if (fs.existsSync(packList[index].path) === false) {
    // the path doesn't exist so drop an message
    biu('File \"' + packList[index].name + '\" has not been saved yet.', {type: 'warning', pop: true, el: document.getElementById('window')})
    return
  }

  // Open the filemanager
  shell.showItemInFolder(packList[index].path)
}

function changeSelectedPack(number) {
  // check if number is useable (this check is needed even though I have no idea why)
  if (number > packList.length || number < 0) {return}

  if (packUIContainer.children[packSelected].classList.contains('active'))
  {
    packUIContainer.children[packSelected].classList.remove('active')
  }
  updatePack()

  packSelected = number
  packUIContainer.children[packSelected].classList.add('active')
  showPack()
}

// Functions other modules need to interact with this module
function setTypeCurPack(input) {
  packList[packSelected].type = input

  // Change the text in the HTML
  packUIContainer.children[packSelected].children[1].children[1].textContent = input
}

function getAllFilesPaths() {
  var out = []

  packList.forEach((e) => {
    if (e.path != 'null') {
      out.push(e.path)
    }
  })

  // Reomove duplicates
  out = out.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
  })

  return out
}

// Returns a bool wether or not all files are saved
function areAllFilesSaved() {
  updatePack()
  for (var i = 0; i < packList.length; i++) {
    if (packList[i].path == null || packList[i].isSaved === false)  {
      // At least one file is unsaved
      console.log(packList[i])
      return false
    }
  }
  // All files are saved
  return true
}

// Tries to open the files saved in the settings
function startup() {
  var found = false
  var fileList = settings.get('fileList.open')

  for (var i = 0; i < fileList.length; i++) {
    if (fs.existsSync(fileList[i]) === true) {
      i == 0 ? loadFirstFile(fileList[i]) : loadFile(fileList[i])
      found = true
    }
  }

  // Update the settings
  settings.set('fileList.open', getAllFilesPaths())

  if (found === false) {
    // spawn one pack
    spawnPack()
  }
}

module.exports.newFile = addCurPack
module.exports.openFile = openFile
module.exports.saveFile = saveFile
module.exports.saveAsFile = saveAsFile
module.exports.loadFile = loadFile
module.exports.closeFile = deleteCurPack
module.exports.copyFile = copyCurPack
module.exports.showInManager = showInManager
module.exports.setTypeCurPack = setTypeCurPack
module.exports.areAllFilesSaved = areAllFilesSaved

// IPC communication
ipc.on('files-saved-request', function(event, arg) {
  console.log()
   event.sender.send('files-saved-reply', areAllFilesSaved())
})

startup()
