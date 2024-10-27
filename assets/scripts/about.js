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
const pdfUrl = "assets/data/cv.pdf"; // Percorso del tuo PDF

let pdfLoaded = false; // Variabile per controllare se il PDF è già stato caricato
let resizeTimeout; // Timeout per il ridimensionamento

// Funzione per caricare e visualizzare il PDF
async function loadAndRenderPDF() {
    if (pdfLoaded) return; // Se il PDF è già stato caricato, esci dalla funzione

    pdfLoaded = true; // Imposta la variabile per indicare che il PDF è in fase di caricamento
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const numPages = pdf.numPages;

    // Funzione per calcolare la scala in base alla larghezza disponibile
    const calculateScale = (page) => {
        const cvDiv = document.getElementById("cvContainer");
        const width = cvDiv.clientWidth; // Ottieni la larghezza del contenitore
        const viewport = page.getViewport({ scale: 1 }); // Ottieni il viewport originale
        return width / viewport.width; // Calcola la scala
    };

    // Funzione per renderizzare una pagina specifica
    const renderPage = async (pageNum) => {
        const page = await pdf.getPage(pageNum);
        const scale = calculateScale(page); // Calcola la scala per la pagina corrente
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Imposta le dimensioni del canvas
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        document.getElementById("cvContainer").appendChild(canvas); // Aggiungi il canvas al contenitore

        // Renderizza la pagina sul canvas
        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;
    };

    // Renderizza tutte le pagine del PDF
    for (let i = 1; i <= numPages; i++) {
        await renderPage(i);
    }
}

// Carica e visualizza il PDF all'avvio
loadAndRenderPDF();

// Ricarica il PDF quando la finestra viene ridimensionata
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout); // Cancella eventuali timeout esistenti

    resizeTimeout = setTimeout(() => {
        document.getElementById("cvContainer").innerHTML = ""; // Svuota il contenitore
        pdfLoaded = false; // Resetta la variabile per permettere un nuovo caricamento del PDF
        loadAndRenderPDF(); // Ricarica il PDF
    }, 300); // Attendi 300ms dopo l'ultimo ridimensionamento prima di ricaricare
});
