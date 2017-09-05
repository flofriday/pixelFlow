/*
* This Script build or package the app .
*/


// Require some modules
var packager = require('electron-packager')
var rebuild = require('electron-rebuild')

function buildManager() {
  var options = {
    dir: './',
    all: false,
    appCopyright: 'Copyright (C) 2017 flofriday',
    arch: 'x64',
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
    },
    ignore: [
      'photon.css',
      'statistic.js',
      'build.js',
      'todo.txt',
      'build',
      'ubuntu-build.sh',
      'ubuntu-dependencies.sh',
      'ubuntu-download-build.sh'
    ],
    afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
      console.log('\tRebuilding native modules...')
      rebuild.rebuild({ buildPath, electronVersion, arch })
      .then(() => callback())
      .catch((error) => callback(error));
    }]
  }

  var platform = process.argv[2];
  platform = platform.slice(2)

  /*
  * Crosscompiling of native modules is not possible.
  */
  if (platform !== process.platform) {
    console.error('Sry crosscompiling is not possible with native modules')
    process.exit()
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
