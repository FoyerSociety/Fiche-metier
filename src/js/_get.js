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
	// RECUPERATION DES DONNEES D INPUT
    var profil = $('#profil');
	    var anarana = profil.find('#nom_pro').val().toUpperCase() + ' ' + profil.find('#prenom_pro').val();
	    var asa = profil.find('#metier').val();
	    var bio = profil.find('#bio').val();
	    var pro_image_ = document.getElementById('inputGroupFile01').files[0];
			let src = path.join(pro_image_.path);
			let destDir = path.join(__dirname, 'data');
			verifDir(destDir);
			var pro_image = copyFile(src, path.join(destDir, `${Date.now()}_${pro_image_.name}`));

	var parcours = []
	$(".hideDiv:visible").each(function(){
		parcours.push([$(this).find('input.entercol2A').val(), $(this).find('input.entercol2B').val()]);
	});

	var metier = $('#_metier');
		var access = metier.find('#access_metier').val();
		var aspPositif = metier.find('#aspect_positif').val();
		var contrainte = metier.find('#contrainte').val();
		var competence = metier.find('#comptence').val();

	var etudes = $('#etudes');
		var formation = etudes.find('#formation').val();
		var insertionPro = etudes.find('#_insertPro').val();
		var es = etudes.find('#es').val();


	var fiche_metier = {
		'profil' : {
			'nom' : anarana,
			'poste' : asa,
			'biographie' : bio,
			'profilImage' : pro_image, 
		},

		'parcours' : parcours,

		'etudes' : {
			'formation' : formation,
			'insertionProfessionnel' : insertionPro,
			'etablissement' : es
		},

		'metier' : {
			'accessMetier' : access,
			'aspectPositif' : aspPositif,
			'contrainte' : contrainte ,
			'competenceQualite' : competence,
			'domaine' : ''
		}
	}

	ipcRenderer.send('asynchronous-message', {'status':'save', 'data':fiche_metier});
	window.location.assign('page.html')
	
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


