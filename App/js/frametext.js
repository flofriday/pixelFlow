
const biu = require('biu.js')

var btnText = document.getElementById('btn-text-frame')

btnText.addEventListener('click', enterText)

function enterText() {
  //TODO: Replace the message with a working code
  biu('This function is not supported.', {type: 'warning', pop: true, el: document.getElementById('window')})
}

function drawText() {

}

module.exports.enterText = enterText
