/*
* This Script build or package the app .
*/


// Require some modules
var packager = require('electron-packager')


function buildManager() {
  var options = {
    dir: './',
    all: false,
    appCopyright: 'Copyright (C) 2017 flofriday',
    arch: 'all',
    icon: './img/icon',
    name: 'pixelFlow',
    out: './build',
    overwrite: true,
    platform: '',
    win32metadata: {
      CompanyName: 'flofriday',
      FileDescription: 'pixelFlow',
      OriginalFilename: 'pixelFlow.exe',
      ProductName: 'pixelFlow',
      InternalName: 'pixelFlow'
    }
  }

  if(process.argv[2] == '--all') {
    options.all = true
  }
  else if (process.argv[2] == '--darwin') {
    options.platform = 'darwin'
  }
  else if (process.argv[2] == '--win32') {
    options.platform = 'win32'
  }
  else if (process.argv[2] == '--linux') {
    options.platform = 'linux'
  }
  else {
    console.log('ERROR: Unknown parameter for build platform')
    return
  }

  // Start the package
  packager(options, function done_callback (err, appPaths) {
    if (err) {
      console.log('ERROR: ' + err)
      return
    }

    console.log('DONE: Result in ' + appPaths)
   })
}

function packageManager() {
  console.log('Packaging not implemented yet!')
}

function main(){
  if(process.argv[3] == '--build') {
    buildManager()
  }
  else if (process.argv[3] == '--package') {
    packageManager()
  }
  else {
    console.log('ERROR: Unknown parameter for build.js')
    return
  }
}

main()
