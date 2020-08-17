
const debug = require('electron-debug')
debug()

// app le objet micontrol an le projet de BrosserWindow wan creation ana fenetre 
const {app, BrowserWindow} = require('electron')
const fs = require('fs')


function createWindow (win) {

  const win = new BrowserWindow({
    width: 1600,
    height: 620,
    center:true,
    minWidth: 1200,
    minHeight: 600,
    webPreferences: {
	  // manao integration ana nodejs anaty le projet
      nodeIntegration: true
    }
  })

  // tsy asina an le menu ambony reny longa mandrapa
  win.setMenu(null)

  // mload an le fichier html de demarage
  win.loadURL('http://localhost:1456/index.html')

  // plein écran
  win.maximize()

  // win.webContents.on('did-finish-load', () => {
  //   // Use default printing options
  //   win.webContents.printToPDF({}).then(data => {
  //     fs.writeFile('/tmp/print.pdf', data, (error) => {
  //       if (error) throw error
  //       console.log('Write PDF successfully.')
  //     })
  //   }).catch(error => {
  //     console.log(error)
  //   })
  // })
 
}

app.on('ready', createWindow)
