.SILENT: run

all: run

run:
	python3 -m http.server & firefox http://0.0.0.0:8000/ &