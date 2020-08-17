
const debug = require('electron-debug')
debug()

// app le objet micontrol an le projet de BrosserWindow wan creation ana fenetre 
const {app, BrowserWindow} = require('electron')


function createWindow (win) {

  const mainWindow = new BrowserWindow({
    width: 1250,
    height: 620,
    center:true,
    minWidth: 1250,
    minHeight: 620,
    webPreferences: {
	  // manao integration ana nodejs anaty le projet
      nodeIntegration: true
    }
  })

  // esorina aloha ilay menu ny fenêtre
  mainWindow.setMenu(null)

  // mload an le fichier html de demarage
  mainWindow.loadURL('http://localhost:1456/index.html')

  // plein écran
  mainWindow.maximize()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
 
}

app.on('ready', createWindow)
