const fs = require('fs')
var path = require('path')

var fileList = []
var folderNumber = 0
const blockedFolder = [
  'node_modules',
  'npm-debug.log',
  '.git',
  'todo.txt',
  'photon.css',
  'photon.min.css',
  'html5kellycolorpicker.min.js'
]
const fileTypes = [
  /*
  * Coding Languages
  */
  {
    name: 'Javascript',
    ending: '.js',
    type: 'Code'
  },
  {
    name: 'JavaScript Object Notation',
    ending: '.json',
    type: 'Code'
  },

  /*
  * Markdown Languages
  */
  {
    name: 'Hypertext Markup Language',
    ending: '.html',
    type: 'Code'
  },
  {
    name: 'Markdown',
    ending: '.md',
    type: 'Code'
  },

  /*
  * Style Languages
  */
  {
    name: 'Cascading Style Sheets',
    ending: '.css',
    type: 'Code'
  },

  /*
  * Images
  */
  {
    name: 'Portable Network Graphics',
    ending: '.png',
    type: 'Image'
  },
  {
    name: 'Scalable Vector Graphics',
    ending: '.svg',
    type: 'Image'
  },
  {
    name: 'Windows Icon',
    ending: '.ico',
    type: 'Image'
  },
  {
    name: 'Macintosh Icon',
    ending: '.icns',
    type: 'Image'
  },

  /*
  * Fonts
  */
  {
    name: 'Embedded OpenType',
    ending: '.eot',
    type: 'Font'
  },
  {
    name: 'True Type',
    ending: '.ttf',
    type: 'Font'
  },
  {
    name: 'Web Open Font Format',
    ending: '.woff',
    type: 'Font'
  }
]
var statObj = fileTypes

/*
* Since the stateObj is at the moment just a copy of the fileTypes it needs some
* more elements like a list of how many files are there per type
*/
function completeStatObj() {
  // Add elements to the filetypes
  statObj.forEach((i) => {
    i['file'] = []
    if (i.type === 'Code') {
      i['lines'] = 0
      i['characters'] = 0
    }
  })

  // Add the type 'unknown' for unknown file types
  var unknownObj = {
    name: 'Unknown',
    ending: '',
    file: []
  }
  statObj[statObj.length] = unknownObj
}

/*
* Get all files in the project directory
*/
function getFiles (dir) {
  var files = fs.readdirSync(dir)
  for (var i in files){

    //check if folder is blocked
    var block = false
    blockedFolder.forEach((e) => {
      if (e === files[i]) {
        block = true
      }
    })
    if (block == false) {

      var name = dir + '/' + files[i]
      if (fs.statSync(name).isDirectory()) {
        // load files of not blocked folder
        folderNumber++
        getFiles(name)
      } else {
        fileList.push(name)
      }
    }
  }
}

/*
* Analyse the Files (For example add a .js file to the type Javascript)
*/
function analyseFiles() {
  fileList.forEach((file) => {
    var match = false
    statObj.forEach((type) => {
      if (path.extname(file) === type.ending) {
        // got a match
        match = true
        type.file.push(file)
        if(type.type === 'Code')
        {
          var buf = fs.readFileSync(file, "utf8")
          type.lines += buf.toString().split('\n').length
          type.characters += buf.length
        }
      }
    })
    if (match === false)
    {
      statObj[statObj.length - 1].file.push(file)
    }
  })
}

/*
* Write out the statistics
*/
function writeStats() {
  console.log("\n\n\nPROJECT PIXELFLOW: ")
  console.log("\tFiles: " + fileList.length)
  console.log("\tFolder: " + folderNumber)

  var linesOfCode = 0;
  var charOfCode = 0;
  var imgNumber = 0;
  var codeNumber = 0;
  var fontNumber = 0;

  statObj.forEach((i) => {
    if (i.type === 'Code') {
      codeNumber += i.file.length
      linesOfCode += i.lines
      charOfCode += i.characters
    }
    else if (i.type === 'Image') {
      imgNumber += i.file.length
    }
    else if (i.type === 'Font') {
      fontNumber += i.file.length
    }
  })

  console.log("\tCode Files: " + codeNumber)
  console.log("\tLines of Code: " + linesOfCode)
  console.log("\tCharacters in Code: " + charOfCode)
  console.log("\tImages Files: " + imgNumber)
  console.log("\tFont Files: " + fontNumber)

  /* Write the single filetypes */
  for(var i = 0; i < statObj.length - 1; i++) {
    if(statObj[i].file.length > 0){
      console.log("\n\n" + statObj[i].name.toUpperCase() + " (" + statObj[i].ending +"):")
      console.log("\tFiles: " + statObj[i].file.length)
      if(statObj[i].type === 'Code') {
        console.log("\tLines: " + statObj[i].lines)
        console.log("\tCharacters: " + statObj[i].characters)
      }
    }
  }

  /* Write the unknown filetypes */
  if(statObj[statObj.length - 1].file.length > 0) {
    console.log("\n\n" + statObj[statObj.length - 1].name.toUpperCase() + ":")
    console.log(statObj[statObj.length - 1].file)
  }
  console.log('\n\n\n')
}

/*
* The main function of the project
*/
function main() {
  console.time('Code statistics in')
  getFiles('.')
  completeStatObj()
  analyseFiles()
  writeStats()
  console.timeEnd('Code statistics in')
}

main()
