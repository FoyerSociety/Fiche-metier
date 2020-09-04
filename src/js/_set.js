const {ipcRenderer} = require('electron')


function _setOutput(dataJson) {

}

$(function() {
	ipcRenderer.send('asynchronous-message', {'status': 'toPdf'})
});