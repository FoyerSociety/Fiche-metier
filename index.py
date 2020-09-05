import os, sys, eel


PORT, OLDPORT = 1333, 0
options = {
	'mode': 'custom',
	'args': ['node_modules/electron/dist/electron.exe', '.']
}
eel.init('src')


@eel.expose
def hello(word):
	print(word)


def main():
	global PORT, OLDPORT
	if PORT==OLDPORT or os.environ.get('fmsPORT')==str(OLDPORT):
		PORT += 1
	OLDPORT = PORT 
	os.environ['fmsPORT'] = str(PORT)
	options['port'] = PORT
	eel.start(mode='custom', cmdline_args=['node_modules/electron/dist/electron.exe', '.'], port=PORT)


if __name__ == '__main__':
	if sys.platform == 'linux':
		eel.start(mode="electron", port=PORT)
	else: main()

