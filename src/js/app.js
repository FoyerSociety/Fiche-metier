const {ipcRenderer} = require('electron')

 // Synchronous message emmiter and handler
// console.log(ipcRenderer.sendSync('synchronous-message', 'sync ping')) 

 // Miandry reponse avy amn Main
ipcRenderer.on('asynchronous-reply', (event, arg) => {
   alert(arg);
})



function preview(){

    var profil = $('#profil');
    var anarana = profil.find('#nom_pro').val().toUpperCase() + ' ' + profil.find('#prenom_pro').val();
    var asa = profil.find('#metier').val();
    var bio = profil.find('#bio').val();
    ipcRenderer.send('asynchronous-message', 'async ping')

}