
const debug = require('electron-debug')
debug()

// app le objet micontrol an le projet de BrosserWindow wan creation ana fenetre 
const {app, BrowserWindow} = require('electron')


function createWindow (win) {

  const mainWindow = new BrowserWindow({
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
  mainWindow.setMenu(null)

  // mload an le fichier html de demarage
  mainWindow.loadURL('http://localhost:1456/index.html')

  // plein écran
  mainWindow.maximize()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
 
}

app.on('ready', createWindow)
