const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const fs = require('fs')
const path = require('path')
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
                      fiche_metier = JSON.parse(JSON.stringify(eval("(" + textdata + ")")));
                      win.loadFile('src/index.html')
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
  // win.webContents.openDevTools() 

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
  else if (arg['status'] == 'save'){
    saveData();
  }
})


// Message Miandry retour , tsy mitohy ra tsy vita
ipcMain.on('synchronous-message', (event, arg) => {
  if (arg['status'] == 'get'){
    event.returnValue = fiche_metier
  }
  
  event.returnValue = null
  
})


app.on('ready', createWindow)


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


function saveData(){

    let save_file = dialog.showSaveDialog(winP, {
      filters: [ { name : 'Fiche Metier', extensions: ['fms'] } ],
      properties: ['openFile', 'promptToCreate', 'createDirectory'],
      message: "Enregistrer Fiche Metier"
    })

    save_file.then(result => {
      if (!result.canceled){
        extens = result.filePath.split('.').reverse()[0]
        if (extens!='fms') result.filePath += ".fms";var output = fs.createWriteStream(result.filePath);

        // var archive = archiver('zip', {
        //   zlib: { level: 9 } 
        // });

        // archive.pipe(output);

        // // Ampidirina anaty zip lesy le fichier
        // archive.append(fs.createReadStream(image), { name: imageName});
        // archive.append(JSON.stringify(fiche_metier), { name: jsonName });

        // // farano amjay lesy e 
        // archive.finalize();

        // ATAOVY AKATO AMJAY LESY E!

        var image = fiche_metier['profil']['profilImage']
        console.log('-->' + image + '<--')
        if (image!=''){
          let imageName = image.split('/').reverse()[0]
          //let jsonName = image.split('/').reverse()[0].split('.')[0] + '.json'
          fiche_metier['profil']['profilImage'] = imageName
        }

        fs.writeFile(result.filePath, JSON.stringify(fiche_metier), function(err){
          if (err) throw err;
        })
        // var output = fs.createWriteStream(result.filePath);

        // var archive = archiver('zip', {
        //   zlib: { level: 9 } 
        // });

        // archive.pipe(output);

        // // Ampidirina anaty zip lesy le fichier
        // archive.append(fs.createReadStream(image), { name: imageName});
        // archive.append(JSON.stringify(fiche_metier), { name: jsonName });

        // // farano amjay lesy e 
        // archive.finalize();

      }
        
    });
}