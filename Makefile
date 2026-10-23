LOCAL_IP := $(shell python3 -c 'import socket; s=socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(("8.8.8.8", 80)); print(s.getsockname()[0]); s.close()')

.SILENT: run

run:
	echo "Site: http://$(LOCAL_IP):8000"
	echo "CV:   http://$(LOCAL_IP):8000/cv/"
	echo ""
	python3 -m http.server 8000 --bind 0.0.0.0
