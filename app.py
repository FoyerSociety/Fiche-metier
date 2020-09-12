import eel
from os import environ
from tempfile import gettempdir
from psutil import net_connections
from docxtpl import DocxTemplate, RichText
from docx2pdf import convert
from shutil import copyfile


eel.init('src')

@eel.expose
def generate(data):
	try:
		domaine = data['metier']['domaine'].strip()
		nbp = len(data['parcours'])

		if nbp==5: flimit = 288
		else: flimit = 403

		# Try to make a space between aspet&contrainte
		if len(data['metier']['aspectPositif']) < 45:
			data['metier']['aspectPositif'] += '\n'

		context = {
			'nom' : RichText(data['profil']['nom'], font='Arial', bold=True,\
				size = 22 if len(data['profil']['nom'])>50 else 24),

			'poste' : data['profil']['poste'],

			'biographie' : RichText(data['profil']['biographie'], font='Arial', \
				size = 22 if len(data['profil']['biographie'])>399 else 24),

			'competenceQualite' : RichText(data['metier']['competenceQualite'], font='Arial', color='#000000', \
				size = 22 if len(data['metier']['competenceQualite'])>185 else 24),

			'accessMetier' : RichText(data['metier']['accessMetier'], font='Arial', color='#000000',\
				size = 22 if len(data['metier']['accessMetier'])>28 else 24),

			'aspectPositif' : RichText(data['metier']['aspectPositif'], font='Arial', color='#000000',\
				size = 22 if len(data['metier']['aspectPositif'])>72 else 24),

			'contrainte' : RichText(data['metier']['contrainte'], font='Arial', color='#000000',\
				size = 22 if len(data['metier']['contrainte'])>72 else 24),

			'domaine' : domaine,

			'formation' : RichText(data['etudes']['formation'], font='Arial', color='#000000',\
				size = 22 if (len(data['etudes']['formation'])>flimit) else 24),

			'etablissement' : RichText(data['etudes']['etablissement'], font='Arial', color='#000000',\
				size = 28 if len(data['etudes']['etablissement'])>32 else 32),

			'insertionProfessionnel' : RichText(data['etudes']['insertionProfessionnel'], font='Arial', color='#000000',\
				size = 22 if len(data['etudes']['insertionProfessionnel'])>111 else 24)
		}

		for i in range(nbp):
			if i == nbp-1: color = '#ffffff'
			else: color = '#000000'

			context[f'p{i}'] = RichText(data['parcours'][i][0], font='Arial', color=color,\
				size = 22 if len(data['parcours'][i][0])>11 else 24)

			context[f'v{i}'] = RichText(data['parcours'][i][1], font='Arial', color=color, \
				size = 22 if len(data['parcours'][i][1])>34 else 24)


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
		name = "FicheMetier_" + data['profil']['poste'].replace(' ', '_')

		doc.save(f"{gettempdir()}\\{name}.docx")
		convert(f"{gettempdir()}\\{name}.docx")

		return f"{gettempdir()}\\{name}.pdf"

	except Exception as err: 
		print(err)
		return 


def forceJPG(img):
	if not img.endswith('.jpg'):
		filename = img.split('\\')[-1]
		newIm = f"{gettempdir()}\\{filename}.jpg"
		copyfile(img, newIm)
		return newIm
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
	main()