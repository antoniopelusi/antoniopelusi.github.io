document.addEventListener("DOMContentLoaded", () => {
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

	// Creazione della lente d'ingrandimento
	const tooltip = document.createElement("div");
	tooltip.id = "magnifier";
	tooltip.style.position = "absolute";
	tooltip.style.border = "2px solid black";
	tooltip.style.borderRadius = "50%";
	tooltip.style.overflow = "hidden";
	tooltip.style.width = "150px";
	tooltip.style.height = "150px";
	tooltip.style.pointerEvents = "none";
	tooltip.style.display = "none";
	tooltip.style.zIndex = "9999";
	container.appendChild(tooltip);

	const magnifierCanvas = document.createElement("canvas");
	magnifierCanvas.style.width = "100%";
	magnifierCanvas.style.height = "100%";
	magnifierCanvas.style.transform = "scale(2)"; // Ingrandisce il contenuto della lente
	tooltip.appendChild(magnifierCanvas);

	const magnifierCtx = magnifierCanvas.getContext("2d");
	let isTouching = false; // Variabile per gestire il touch mantenuto

	const getTouchPosition = (event) => {
		const rect = container.getBoundingClientRect();
		const touch = event.touches ? event.touches[0] : event;
		const mouseX = touch.clientX - rect.left;
		const mouseY = touch.clientY - rect.top;
		return { mouseX, mouseY };
	};

	// Funzione per aggiornare la lente
	const updateMagnifier = (mouseX, mouseY, pageCanvas) => {
		if (!pageCanvas) return;

		tooltip.style.left = `${mouseX - tooltip.offsetWidth / 2}px`;
		tooltip.style.top = `${mouseY - tooltip.offsetHeight / 2}px`;

		const zoom = 2;
		const size = 300;

		const rect = container.getBoundingClientRect();
		const offsetX =
			mouseX * (pageCanvas.width / rect.width) - size / (2 * zoom);
		const offsetY =
			mouseY * (pageCanvas.height / rect.height) - size / (2 * zoom);

		const pageCtx = pageCanvas.getContext("2d");

		magnifierCanvas.width = size / zoom;
		magnifierCanvas.height = size / zoom;

		magnifierCtx.clearRect(0, 0, magnifierCanvas.width, magnifierCanvas.height);
		magnifierCtx.drawImage(
			pageCanvas,
			offsetX,
			offsetY,
			size / zoom,
			size / zoom,
			0,
			0,
			magnifierCanvas.width,
			magnifierCanvas.height,
		);
	};

	// Gestione eventi su mouse e touch
	const handleMove = (event) => {
		if (!isTouching) return; // Solo aggiorna la lente se il touch è mantenuto

		const { mouseX, mouseY } = getTouchPosition(event);

		// Ottieni il canvas sottostante che contiene il PDF
		const pageCanvas = document.elementFromPoint(event.clientX, event.clientY);
		if (pageCanvas && pageCanvas.tagName === "CANVAS") {
			updateMagnifier(mouseX, mouseY, pageCanvas);
		}
	};

	const handleStart = (event) => {
		if (event.touches && event.touches.length === 1) {
			// Verifica che sia un singolo tocco
			isTouching = true;
			tooltip.style.display = "block";
			handleMove(event); // Aggiorna la lente subito al tocco
		}
	};

	const handleEnd = () => {
		isTouching = false;
		tooltip.style.display = "none";
	};

	container.addEventListener("mousemove", handleMove);
	container.addEventListener("mousedown", (event) => {
		if (event.button === 0) {
			// Solo tasto sinistro
			isTouching = true;
			tooltip.style.display = "block";
			handleMove(event); // Aggiorna la lente subito al click
		}
	});
	container.addEventListener("mouseup", handleEnd);
	container.addEventListener("mouseleave", handleEnd);

	// Aggiungi gli eventi touch
	container.addEventListener("touchmove", (event) => {
		event.preventDefault(); // Previene lo scroll durante il movimento del dito
		handleMove(event);
	});
	container.addEventListener("touchstart", handleStart);
	container.addEventListener("touchend", handleEnd);
	container.addEventListener("touchcancel", handleEnd);
});
