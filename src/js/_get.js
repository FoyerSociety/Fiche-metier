const {ipcRenderer} = require('electron')
const fs = require('fs');
const path = require('path');


// ipcRenderer.sendSync('synchronous-message', 'sync ping')
// ipcRenderer.send('asynchronous-message', 'async ping')

 // Miandry reponse avy amn Main
ipcRenderer.on('asynchronous-reply', (event, arg) => {
   alert(arg);
})


function preview(dataOnly=false){
	// RECUPERATION DES DONNEES D INPUT
    var profil = $('#profil');
	    var anarana = profil.find('#nom_pro').val().toUpperCase() + ' ' + profil.find('#prenom_pro').val();
	    var asa = profil.find('#metier').val();
	    var bio = profil.find('#bio').val();
	    var pro_image_ = document.getElementById('inputGroupFile01').files[0];
	    // fix bug path not found when image not selected
	    if (pro_image_){
			let src = path.join(pro_image_.path);
			let destDir = path.join(__dirname, 'data');
			verifDir(destDir);
			var pro_image = copyFile(src, path.join(destDir, `${pro_image_.name}`));
		} 
		else {
			label_file = $('.custom-file-label').val()
			if (label_file!=''){
				pro_image = label_file
			}
			else{
				var pro_image = ''
			}
			
		}

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

	if (!dataOnly) window.location.assign('page.html')
	
	ipcRenderer.send('asynchronous-message', {'status':'set', 'data':fiche_metier});

	return fiche_metier;
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


function _setInput(dataJson){
	// RECUPERATION DES DONNEES D INPUT
    var profil = $('#profil');
    	let anarana = dataJson['profil']['nom'].split(' ')
	    profil.find('#nom_pro').val(anarana[0])
	    let prenom = anarana.reverse()
	    prenom.pop()
	    prenom = prenom.reverse()
	    profil.find('#prenom_pro').val(prenom.join(' '));
	    var asa = profil.find('#metier').val(dataJson['profil']['poste']);
	    var bio = profil.find('#bio').val(dataJson['profil']['biographie']);
	    $('.custom-file-label').val(dataJson['profil']['profilImage'])
	    $('.custom-file-label').html(dataJson['profil']['profilImage'])

	var parcours = dataJson['parcours']
	let divParcours = $(".hideDiv")
	for (let i=0;i<parcours.length;i++){
		let divP = $(divParcours[i]);
		divP.show()
		divP.find('input.entercol2A').val(parcours[i][0])
		divP.find('input.entercol2B').val(parcours[i][1])
	}

	var metier = $('#_metier');
		var access = metier.find('#access_metier').val(dataJson['metier']['accessMetier']);
		var aspPositif = metier.find('#aspect_positif').val(dataJson['metier']['aspectPositif']);
		var contrainte = metier.find('#contrainte').val(dataJson['metier']['contrainte']);
		var competence = metier.find('#comptence').val(dataJson['metier']['competenceQualite']);

	var etudes = $('#etudes');
		var formation = etudes.find('#formation').val(dataJson['etudes']['formation']);
		var insertionPro = etudes.find('#_insertPro').val(dataJson['etudes']['insertionProfessionnel']);
		var es = etudes.find('#es').val(dataJson['etudes']['etablissement']);
}


$(function() {
	let data = ipcRenderer.sendSync('synchronous-message', {'status':'get'})
	if (data) _setInput(data);
});


function saveData(){
	preview(true);
	ipcRenderer.sendSync('asynchronous-message', {'status':'save'})
}