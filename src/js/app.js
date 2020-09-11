const {ipcRenderer} = require('electron')
const fs = require('fs');
const path = require('path');


$(".hideDiv").hide();
fixParcours();

function showDiv() {
  var i = 0;
  $(".hideDiv:hidden").each(function(){
  if (i==0){
    $(this).show();
  }
  i++;
  });
};

function removeDiv() {
    var i = 1;
    var elInput = $(".hideDiv:visible");
    elInput.each(function(){
        if ((i)==elInput.length){
            $(this).hide();
        }
        i++;
    });
   /* $(".hideDiv:first").show();*/
   fixParcours(3)
};


function fixParcours(lim=3){
  var i = 0;
  $(".hideDiv").each(function(){
    if (i<lim) $(this).show();
    i++;
  });
}


function preview(dataOnly=false){
	// RECUPERATION DES DONNEES D INPUT
	if (!dataOnly) $('.butAiza').text('...');
    var profil = $('#profil');
	    var anarana = profil.find('#nom_pro').val().toUpperCase() + ' ' + profil.find('#prenom_pro').val();
	    var asa = profil.find('#metier').val();
	    var bio = profil.find('#bio').val();
	    var pro_image_ = document.getElementById('inputGroupFile01').files[0];
	    // fix bug path not found when image not selected
	    /*if (pro_image_){
			let src = path.join(pro_image_.path);
			let destDir = path.join('data');
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
			
		}*/
		if (pro_image_) var pro_image = pro_image_.path;
		else var pro_image = ""

	var parcours = []
	$(".hideDiv:visible").each(function(){
		parcours.push([$(this).find('input.entercol2A').val(), $(this).find('input.entercol2B').val()]);
	});

	var metier = $('#_metier');
		var access = metier.find('#access_metier').val();
		var aspPositif = metier.find('#aspect_positif').val();
		var contrainte = metier.find('#contrainte').val();
		var competence = metier.find('#competence').val();
		var domaine = $('.choix').val()
		if (domaine==''){
			alert("Le Domaine doit être specifié")
			$('.butAiza').text('Finir')
			return 0;
		}


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
			'domaine' : domaine
		}
	}

	if (!dataOnly) {
		eel.generate(fiche_metier)(viewPdf)
	}
	
	ipcRenderer.send('synchronous-message', {'status':'set', 'data':fiche_metier});

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
		var competence = metier.find('#competence').val(dataJson['metier']['competenceQualite']);
		$('.choix').val(dataJson['metier']['domaine'])


	var etudes = $('#etudes');
		var formation = etudes.find('#formation').val(dataJson['etudes']['formation']);
		var insertionPro = etudes.find('#_insertPro').val(dataJson['etudes']['insertionProfessionnel']);
		var es = etudes.find('#es').val(dataJson['etudes']['etablissement']);
}


$(function() {
	let data = ipcRenderer.sendSync('synchronous-message', {'status':'get'})
	if (data) _setInput(data);

    $('#profil').find('#metier').on('keyup', function() {
        $(".hideDiv:visible:last").find('input.entercol2B').val($(this).val());
    });

    // NOM LIMITATION
	    $('#profil').find('#prenom_pro').on('keyup', function(){
	    	let val = $(this).val()
	    	let fkVal = $('#profil').find('#nom_pro').val()

	        if (val.length+fkVal.length>62) $(this).val(val.substr(0,val.length-1));
	    });  

	    $('#profil').find('#nom_pro').on('keyup', function(){
	    	let val = $(this).val()
	    	let fkVal = $('#profil').find('#prenom_pro').val()

	        if (val.length+fkVal.length>62) $(this).val(val.substr(0,val.length-1));
	    });


	// POSTE LIMITATION
		$('#profil').find('#metier').on('keyup', function(){
	    	let val = $(this).val()
	        if (val.length>30) $(this).val(val.substr(0,30));
	    });

	// BIO LIMITATION
		$('#profil').find('#bio').on('keyup', function(){
	    	let val = $(this).val()
	    	//399
	        if (val.length>496) $(this).val(val.substr(0,496));
	        console.log(val+ " " + val.length)
	    });

	// PARCOURS LIMITATION
	$(".hideDiv").each(function(){
		//11
		$(this).find('input.entercol2A').on('keyup', function(){
			let val0 = $(this).val()
	        if (val0.length>12) $(this).val(val0.substr(0,12));
		});
		//34
		$(this).find('input.entercol2B').on('keyup', function(){
			let val1 = $(this).val()
	        if (val1.length>36) $(this).val(val1.substr(0,36));
		});	
	});

	// ACCESS METIER LIMITATION
	// 28 
	$('#metier').find('#access_metier').on('keyup', function(){
		let val = $(this).val()
	     if (val.length>31) $(this).val(val.substr(0,val.length-1));
	});

	// ASPECT POSITIF LIMITATION
	// 72
	$('#metier').find('#aspect_positif').on('keyup', function(){
		let val = $(this).val()
	     if (val.length>78) $(this).val(val.substr(0,val.length-1));
	});

	// CONTRAINTE LIMITATION
	// 72
	$('#metier').find('#contrainte').on('keyup', function(){
		let val = $(this).val()
	     if (val.length>78) $(this).val(val.substr(0,78));
	});

	// COMPETENCE LIMITATION
	// 185
	$('#metier').find('#contrainte').on('keyup', function(){
		let val = $(this).val()
	     if (val.length>240) $(this).val(val.substr(0,240));
	});

	// FORMATION LIMITATION
	$('#metier').find('#contrainte').on('keyup', function(){
		if ($(".hideDiv:visible").length==5){
			// 288
			let val = $(this).val()
	     	if (val.length>315) $(this).val(val.substr(0,315));
		} else {
			// 403
			let val = $(this).val()
	     	if (val.length>475) $(this).val(val.substr(0,475));
		}
		
	});

	// INSERTION PROFESSIONNEL LIMITATION
	// 111
	$('#metier').find('#_insertPro').on('keyup', function(){
		let val = $(this).val()
	     if (val.length>123) $(this).val(val.substr(0,123));
	});

	// ETABLISSEMENT SUP LIMITATION
	// 32
	$('#metier').find('#es').on('keyup', function(){
		let val = $(this).val()
	     if (val.length>37) $(this).val(val.substr(0,37));
	});


});


function saveData(){
	preview(true);
	ipcRenderer.sendSync('synchronous-message', {'status':'save'})
}


function viewPdf(data){
	if (data) ipcRenderer.sendSync('synchronous-message', {'status':'viewPdf', 'data': data});
	$('.butAiza').text('Finir')
}
