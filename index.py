import os, sys, eel
from docxtpl import DocxTemplate, InlineImage
from docx2pdf import convert


PORT, OLDPORT = 1333, 0
eel.init('src')


@eel.expose
def generate(data):
	doc = DocxTemplate("template/Trame-vierge.docx")

	context = {
		'nom' : data['profil']['nom'],
		'poste' : data['profil']['poste'],
		'biographie' : data['profil']['biographie'],

		'competenceQualite' : data['metier']['competenceQualite'],
		'accessMetier' : data['metier']['accessMetier'],
		'aspectPositif' : data['metier']['aspectPositif'],
		'contrainte' : data['metier']['contrainte'],
		'domaine' : data['metier']['domaine'],

		'formation' : data['etudes']['formation'],
		'etablissement' : data['etudes']['etablissement'],
		'insertionProfessionnel' : data['etudes']['insertionProfessionnel']
	}

	for i in range(len(data['parcours'])):
		context[f'p{i}'], context[f'v{i}'] = data['parcours'][i][0], data['parcours'][i][1]

	
	if data['profil']['profilImage'] != '':
		doc.replace_pic('test.jpg', data['profil']['profilImage'])


	doc.render(context)
	doc.save("tmp/generated_doc.docx")
	convert("tmp/generated_doc.docx")

	return 'tmp/generated_doc.pdf'


 
def main():
	global PORT, OLDPORT
	if os.environ.get('fmsPORT')==str(OLDPORT):
		PORT += 1
	OLDPORT = PORT 
	os.environ['fmsPORT'] = str(PORT)
	if sys.platform == 'linux': eel.start(mode="electron", port=PORT)
	else: eel.start(mode='custom', cmdline_args=['node_modules/electron/dist/electron.exe', '.'], port=PORT)


if __name__ == '__main__':
	main()

