.SILENT: run fetch push

all: run

run:
	python3 -m http.server

fetch:
	python3 fetch.py

push:
	git add .
	git commit -m "Update"
	git push