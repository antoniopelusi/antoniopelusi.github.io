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
pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/scripts/pdf.worker.min.js";
const pdfUrl = "assets/data/cv.pdf";

// Funzione per renderizzare la pagina PDF
function renderPage(pdf, pageNum, canvasId, scale) {
    pdf.getPage(pageNum).then((page) => {
        const cvDiv = document.getElementById("cvContainer");
        const viewport = page.getViewport({ scale });
        const canvas = document.getElementById(canvasId);
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        page.render(renderContext);
    });
}

// Funzione per renderizzare tutte le pagine del PDF
function renderAllPages(pdf, scale) {
    const numPages = pdf.numPages;
    const cvDiv = document.getElementById("cvContainer");
    cvDiv.innerHTML = ""; // Svuota il contenitore esistente

    for (let i = 1; i <= numPages; i++) {
        const canvas = document.createElement("canvas");
        canvas.id = `pdf-canvas${i}`;
        cvDiv.appendChild(canvas);
        renderPage(pdf, i, canvas.id, scale);
    }
}

// Funzione per aggiornare la scala del PDF al ridimensionamento della finestra
function updateScale(pdf) {
    const cvDiv = document.getElementById("cvContainer");
    const width = cvDiv.clientWidth; // Ottieni la larghezza del contenitore

    // Calcola la scala in base alla larghezza del contenitore e alla larghezza della pagina
    pdf.getPage(1).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        const scale = width / viewport.width; // Calcola la scala per massimizzare la larghezza
        renderAllPages(pdf, scale);
    });
}

// Caricamento del documento PDF
pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
    updateScale(pdf); // Inizializza la scala

    // Aggiungi l'evento di resize per aggiornare il PDF
    window.addEventListener("resize", () => updateScale(pdf));
});
