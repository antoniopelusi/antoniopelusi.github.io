.SILENT: run

run:
	echo "Site: http://127.0.0.1:8000"
	echo "CV:   http://127.0.0.1:8000/cv/"
	echo ""
	python3 -m http.server 8000 --bind 127.0.0.1
