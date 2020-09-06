const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const fs = require('fs')
const path = require('path')
var fiche_metier = null
var winP
var PORT = process.env.fmsPORT

function createWindow (win_) {

  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    center:true,
    minWidth: 1366,
    minHeight: 768,
    show: false,
    maxWidth: 1366,
    maxHeight: 768,
    webPreferences: {
	  // manao integration ana nodejs anaty le projet
      nodeIntegration: true
    }
  })
  
  // efa pare vao avoaka 
  win.once('ready-to-show', ()=>{ win.show() })

  const menu = Menu.buildFromTemplate(
    [
      {
        label: "Fichier",
        submenu: [
          {
            label: "Ouvrir",
            click: function(){
              let file_open = dialog.showOpenDialog(win, {
                filters: [ { name : 'Fiche Metier', extensions: ['fms'] } ],
                properties: ['openFile'],
                message: "Charger un fiche metier"
              }) 

              file_open.then(result => {
                  if (result.filePaths.length>0){
                    fs.readFile(result.filePaths[0], (err, data)=>{
                      if (err) throw err;
                      let textdata = data.toString('utf8')
                      fiche_metier = JSON.parse(JSON.stringify(eval("(" + textdata + ")")));
                      win.loadURL(`http://localhost:${PORT}/index.html`)
                    });
                   
                  }
              })
            }
          },
          {
            label: "Nouveau",
            click: ()=>{
              fiche_metier = null
              win.loadURL(`http://localhost:${PORT}/index.html`)
            }
          },
          {
            label: "Nouvelle Fenetre",
            click: ()=>{ createWindow() }
          },
          {
            label: "Fermer",
            click: ()=>{ app.quit() }
          },
        ]
      }
    ]
  );

  Menu.setApplicationMenu(menu);


  // mload an le fichier html de demarage
  win.loadURL(`http://localhost:${PORT}/index.html`)

  // plein écran
  win.maximize()

  // Manokatra DevTools. 
  //win.webContents.openDevTools() 

  winP = win;
}


// Appel tsy miandry retour fa mandef ref vita
ipcMain.on('asynchronous-message', (event, arg) => {
  // nalako aby jiaby fa mampirekitra processus
  //nalefako amn sync any aby 
})


// Message Miandry retour , tsy mitohy ra tsy vita
ipcMain.on('synchronous-message', (event, arg) => {

  if (arg['status'] == 'get') event.returnValue = fiche_metier;
  else if (arg['status'] == 'viewPdf') viewPdf(arg['data']);
  else if (arg['status'] == 'save') saveData();
  else if (arg['status'] == 'set') fiche_metier = arg['data'];
  
  event.returnValue = null
  
})


app.on('ready', createWindow)


function saveData(){

    let save_file = dialog.showSaveDialog(winP, {
      filters: [ { name : 'Fiche Metier', extensions: ['fms'] } ],
      properties: ['openFile', 'promptToCreate', 'createDirectory'],
      message: "Enregistrer Fiche Metier"
    })

    save_file.then(result => {
      if (!result.canceled){
        extens = result.filePath.split('.').reverse()[0]
        if (extens!='fms') result.filePath += ".fms";

        // ATAOVY AKATO AMJAY LESY E!

        var image = fiche_metier['profil']['profilImage']
        if (image!=''){
          let imageName = image.split('/').reverse()[0]
          fiche_metier['profil']['profilImage'] = imageName
        }

        fs.writeFile(result.filePath, JSON.stringify(fiche_metier), function(err){
          if (err) throw err;
        })
      }
        
    });
}


function viewPdf(pdfFile){
  const pdf = new BrowserWindow()
  pdf.loadFile(pdfFile)
}