pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/scripts/pdf.worker.min.js";

const url = "/assets/data/cv.pdf";
const container = document.getElementById("cvContainer");

pdfjsLib
	.getDocument(url)
	.promise.then((pdf) => {
		const numPages = pdf.numPages;

		for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
			pdf
				.getPage(pageNumber)
				.then((page) => {
					const viewport = page.getViewport({ scale: 3 });
					const canvas = document.createElement("canvas");
					const context = canvas.getContext("2d");

					canvas.id = `pdf-canvas-${pageNumber}`;
					container.appendChild(canvas);

					canvas.width = viewport.width;
					canvas.height = viewport.height;
					canvas.style.width = "100%";
					canvas.style.marginBottom = "0px";

					page.render({
						canvasContext: context,
						viewport: viewport,
					});
				})
				.catch((error) => {
					console.error(
						`Errore durante il caricamento della pagina ${pageNumber}:`,
						error,
					);
				});
		}
	})
	.catch((error) => {
		console.error("Errore durante il caricamento del PDF:", error);
	});
