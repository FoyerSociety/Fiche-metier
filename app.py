import os, sys, eel
from docxtpl import DocxTemplate, InlineImage
from docx2pdf import convert


eel.init('src')


@eel.expose
def generate(data):
	domaine = data['metier']['domaine'].strip()
	context = {
		'nom' : data['profil']['nom'],
		'poste' : data['profil']['poste'],
		'biographie' : data['profil']['biographie'],

		'competenceQualite' : data['metier']['competenceQualite'],
		'accessMetier' : data['metier']['accessMetier'],
		'aspectPositif' : data['metier']['aspectPositif'],
		'contrainte' : data['metier']['contrainte'],
		'domaine' : domaine,

		'formation' : data['etudes']['formation'],
		'etablissement' : data['etudes']['etablissement'],
		'insertionProfessionnel' : data['etudes']['insertionProfessionnel']
	}

	for i in range(len(data['parcours'])):
		context[f'p{i}'], context[f'v{i}'] = data['parcours'][i][0], data['parcours'][i][1]

	if domaine in ['Santé', 'Informatique', 'Commerce et administration']: col = 'bleu'
	elif domaine == 'Agronomie': col = 'vert'
	elif domaine == 'Science humaine et Communication': col = 'rouge'
	elif domaine == 'Tourisme': col = 'orange'
	elif domaine == 'Industrie et BT': col = 'violet'
	elif domaine == "Justice et force de l'ordre": col = 'jaune'
	else: return

	doc = DocxTemplate(f"template/Trame-vierge-{col}.docx")

	
	if data['profil']['profilImage'] != '':
		doc.replace_pic('test.jpg', data['profil']['profilImage'])

	doc.render(context)
	doc.save("tmp/generated_doc.docx")
	convert("tmp/generated_doc.docx")

	return 'tmp/generated_doc.pdf'


 
def main():
	PORT = 1333
	os.environ['fmsPORT'] = str(PORT)
	eel.start(mode='custom', cmdline_args=['node_modules/electron/dist/electron.exe', '.'], port=PORT)


if __name__ == '__main__':
	main()

