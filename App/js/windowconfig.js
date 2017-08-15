/*
* This file includes every code every electron window of my application needs.
* The purpose is to write DRY code, so i don't have to rewrite the code for
* every new window.
*/

/*
* require needed modules
*/
const electron = require('electron')
const remote = electron.remote
const shell = electron.shell

/*
* Handle key shortcuts
*/
document.onkeydown = (e) => {
  if(e.keyCode === 123) {
    // Open Dev Tools
    remote.getCurrentWindow().toggleDevTools()
  }
}

/*
* Open links in OS default Browser
*/
const links = document.querySelectorAll('a[href]')
Array.prototype.forEach.call(links, function (link) {
  const url = link.getAttribute('href')
  if (url.indexOf('http') === 0) {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})

/*
* Prevent droped files from opening like they where html files to load
*/
document.ondragover = document.ondrop = document.ondragend = (e) => {
  e.preventDefault()
  return false
}
