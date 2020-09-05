import os, sys, eel
from docxtpl import DocxTemplate
from docx2pdf import convert


PORT, OLDPORT = 1333, 0
eel.init('src')


@eel.expose
def generate(data):
	doc = DocxTemplate("Trame-vierge.docx")

	context = {
		'nom' : data['profil']['nom'],
		'poste' : data['profil']['poste'],
		'biographie' : data['profil']['biographie'],

		'competenceQualite' : data['metier']['competenceQualite'],
		'accessMetier' : data['metier']['accessMetier'],
		'aspectPositif' : data['metier']['aspectPositif'],
		'contrainte' : data['metier']['contrainte'],

		'formation' : data['etudes']['formation'],
		'etablissement' : data['etudes']['etablissement'],
		'insertionProfessionnel' : data['etudes']['insertionProfessionnel'],
	}

	doc.render(context)
	doc.save("generated_doc.docx")
	convert("generated_doc.docx")

	return 'generated_doc.pdf'





def main():
	global PORT, OLDPORT
	if PORT==OLDPORT or os.environ.get('fmsPORT')==str(OLDPORT):
		PORT += 1
	OLDPORT = PORT 
	os.environ['fmsPORT'] = str(PORT)
	if sys.platform == 'linux': eel.start(mode="electron", port=PORT)
	else: eel.start(mode='custom', cmdline_args=['node_modules/electron/dist/electron.exe', '.'], port=PORT)


if __name__ == '__main__':
	main()

