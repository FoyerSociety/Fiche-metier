import eel
from os import system, environ
from psutil import net_connections
from docxtpl import DocxTemplate
from docx2pdf import convert
from shutil import copyfile


eel.init('src')

@eel.expose
def generate(data):
	try:
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

		nbp = len(data['parcours'])

		for i in range(nbp):
			context[f'p{i}'], context[f'v{i}'] = data['parcours'][i][0], data['parcours'][i][1]

		if domaine in ['Santé', 'Informatique', 'Commerce et administration']: col = 'bleu'
		elif domaine == 'Agronomie': col = 'vert'
		elif domaine == 'Science humaine et Communication': col = 'rouge'
		elif domaine == 'Tourisme': col = 'orange'
		elif domaine == 'Industrie et BT': col = 'violet'
		elif domaine == "Justice et force de l'ordre": col = 'jaune'
		else: return

		doc = DocxTemplate(f"template/Trame-vierge{nbp}-{col}.docx")

		if data['profil']['profilImage'] != '':
			data['profil']['profilImage'] = forceJPG(data['profil']['profilImage'])
			doc.replace_pic('test.jpg', data['profil']['profilImage'])
		
		doc.render(context)
		doc.save("tmp/generated_doc.docx")
		convert("tmp/generated_doc.docx")

		return 'tmp/generated_doc.pdf'

	except Exception as err: 
		print(err)
		return 


def forceJPG(img):
	if not img.endswith('.jpg'):
		filename = img.split('\\')[-1]
		copyfile(img, f"tmp/{filename}.jpg")
		return f"tmp/{filename}.jpg"
	return img


def viewPort(port):
	# Verification d'un PORT
	for proc in net_connections():
		if proc.laddr.port == port: return True
 

def main():
	PORT = 1333
	while viewPort(PORT):
		PORT += 1
	environ['fmsPORT'] = str(PORT)
	eel.start(mode='custom', cmdline_args=['node_modules/electron/dist/electron.exe', '.'], port=PORT)


if __name__ == '__main__':
	system('rd /S /Q tmp')
	system('mkdir tmp')
	main()