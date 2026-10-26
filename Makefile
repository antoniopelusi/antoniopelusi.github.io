NODE ?= node

.PHONY: build run

.SILENT: build run

all: run

build:
	$(NODE) tools/build.mjs

run: build
	python3 -m http.server 8000