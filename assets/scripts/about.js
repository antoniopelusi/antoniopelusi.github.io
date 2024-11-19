// Funzione per simulare il terminale
async function simulateTerminal(text, blinkSpeed = 500) {
	const terminal = document.getElementById("name");
	let isCursorVisible = false;

	async function updateTerminal(content) {
		terminal.innerText = content + (isCursorVisible ? "_" : "");
	}

	async function blink() {
		isCursorVisible = !isCursorVisible;
		updateTerminal(text);
	}

	updateTerminal(text);

	setInterval(blink, blinkSpeed);
}

// Inizializzazione del terminale
simulateTerminal("Antonio Pelusi");

// Impostazione della libreria pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/scripts/pdf.worker.min.js";

const url = "/assets/data/cv.pdf";
const container = document.getElementById('cvContainer');

// Funzione per caricare e visualizzare tutte le pagine del PDF
pdfjsLib.getDocument(url).promise.then(pdf => {
    const numPages = pdf.numPages;  // Ottieni il numero di pagine

    // Itera su tutte le pagine
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        pdf.getPage(pageNumber).then(page => {
            const viewport = page.getViewport({ scale: 3 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Imposta il canvas come figlio del contenitore
            canvas.id = `pdf-canvas-${pageNumber}`;
            container.appendChild(canvas);

            // Configura il canvas per essere responsive
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = '100%';
            canvas.style.marginBottom = '0px';  // Spaziatura tra le pagine

            // Renderizza la pagina
            page.render({
                canvasContext: context,
                viewport: viewport
            });
        }).catch(error => {
            console.error(`Errore durante il caricamento della pagina ${pageNumber}:`, error);
        });
    }
}).catch(error => {
    console.error('Errore durante il caricamento del PDF:', error);
});
