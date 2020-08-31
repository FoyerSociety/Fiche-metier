const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const fs = require('fs')
var fiche_metier = null
var winP;

function createWindow (win_) {

  const win = new BrowserWindow({
    width: 1250,
    height: 620,
    center:true,
    minWidth: 1250,
    minHeight: 620,
    show: false,
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
                      fiche_metier = JSON.stringify(eval("(" + textdata + ")"));
                      test();
                    });
                   
                  }
              })
            }
          },
          {
            label: "Nouveau",
            click: ()=>{
              fiche_metier = null
              win.loadFile('src/index.html')
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
  win.loadFile('src/index.html')

  // plein écran
  win.maximize()

  // Manokatra DevTools. 
  win.webContents.openDevTools() 

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

  winP = win;
 
}


// Appel tsy miandry retour fa mandef ref vita
ipcMain.on('asynchronous-message', (event, arg) => {
  if (arg['status'] == 'set'){
    fiche_metier = arg['data']
  }
  else if (arg['status'] == 'toPdf'){
    printPdf();  
  }

  // mandefa valiny amjay
  //event.sender.send('asynchronous-reply', 'async pong valiny o')
})

// Message Miandry retour , tsy mitohy ra tsy vita
ipcMain.on('synchronous-message', (event, arg) => {
  if (arg['status'] == 'get'){
    event.returnValue = fiche_metier
  }
  
  event.returnValue = null
  
})


app.on('ready', createWindow)


function test(){
  console.log(fiche_metier);
}


function printPdf(){
  winP.webContents.printToPDF({}).then(data => {
  fs.writeFile('print.pdf', data, (error) => {
    if (error) throw error
        console.log('Write PDF successfully.')
    })
  }).catch(error => {
      console.log(error)
  })
}