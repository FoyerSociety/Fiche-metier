const {ipcRenderer} = require('electron')
const fs = require('fs');
const path = require('path');


// ipcRenderer.sendSync('synchronous-message', 'sync ping')
// ipcRenderer.send('asynchronous-message', 'async ping')

 // Miandry reponse avy amn Main
ipcRenderer.on('asynchronous-reply', (event, arg) => {
   alert(arg);
})


function preview(){
    var profil = $('#profil');
	    var anarana = profil.find('#nom_pro').val().toUpperCase() + ' ' + profil.find('#prenom_pro').val();
	    var asa = profil.find('#metier').val();
	    var bio = profil.find('#bio').val();
	    var _pro_image = document.getElementById('inputGroupFile01').files[0];
			let src = path.join(_pro_image.path);
			let destDir = path.join(__dirname, 'data');
			verifDir(destDir);
			var pro_image =copyFile(src, path.join(destDir, `${Date.now()}_${_pro_image.name}`));

	var parcours = $('#parcours');

	var metier = $('#metier');
		var access = metier.find('#access_metier').val();
		var aspPositif = metier.find('#aspect_positif').val();
		var contrainte = metier.find('#contrainte').val();
		var comptence = metier.find('#comptence').val();

	var etudes = $('#etudes');
		var formation = etudes.find('#formation');
		var insertionPro = etudes.find('#insertPro');
		var es = etudes.find('#es');
}


function copyFile(src, dest) {

  let readStream = fs.createReadStream(src);

  readStream.once('error', (err) => {
    console.log(err);
  });

  readStream.once('end', () => {
    console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(dest));

  return dest;
}


function verifDir(destDir){
	// Fonction miverifier hoe mi existe ny dossier raika
	// creer le izy ra tsy miexiste mokn ai
	fs.access(destDir, (err) => {
  	if(err)
    	fs.mkdirSync(destDir);
	});
}