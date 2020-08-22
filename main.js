// app le objet micontrol an le projet de BrosserWindow wan creation ana fenetre 
const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const fs = require('fs')

function createWindow (win_) {


  const win = new BrowserWindow({
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


  // tsy asina an le menu ambony reny longa mandrapa
  win.setMenu(null)


  // mload an le fichier html de demarage
  win.loadFile('src/index.html')

  // plein écran
  win.maximize()

  // Manokatra DevTools. 
  // win.webContents.openDevTools() 

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


// Appel tsy miandry retour fa mandef ref vita
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(" tonga oo " + arg)

  // mandefa valiny amjay
  event.sender.send('asynchronous-reply', 'async pong valiny o')
})

// Message Miandry retour , tsy mitohy ra tsy vita
ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})


function Professionnel(nom="", prenom="", image=""){
  this.nom = Nom.toUpperCase();
  this.prenom = prenom;
  this.image = image;
}


function Metier(acces, positifs, contraintes, comptences){
  this.acces = acces
  this.positifs = positifs
  this.contraintes = contraintes
  this.comptences = comptences
}


function Etudes(formations, insert_pro, es){
  this.formations = formations
  this.insert_pro = insert_pro
  this.es = es
}


function FicheMetier(titre, professionnel=new Professionnel(), parcours, metier, etudes){
  this.titre = titre;
  this.professionnel= professionnel;
  this.parcours = parcours
  this.metier = metier
  this.etudes = etudes
}


app.on('ready', createWindow)