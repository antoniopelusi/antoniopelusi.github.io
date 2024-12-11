document.addEventListener("DOMContentLoaded", () => {
	function changeBackground() {
		let bsodElement = document.querySelector('bsod'); // Aggiunto il punto per selezionare una classe, se 'bsod' è una classe
		let originalOpacity = bsodElement.style.opacity || 1; // Se l'opacità non è stata impostata, assumiamo che sia 1
    
		// Inizializza l'opacità a 1, senza modifiche immediate
		bsodElement.style.opacity = 1;

		// Aggiungiamo un delay prima di cambiare l'opacità
		setTimeout(() => {
			bsodElement.style.opacity = 0.7;
        
			// Ripristina l'opacità originale dopo 200ms
			setTimeout(() => {
				bsodElement.style.opacity = originalOpacity;
			}, 200);
		}, 1000); // Cambia l'opacità dopo 1 secondo

		let randomTime = Math.floor(Math.random() * 5000) + 1000;
		setTimeout(changeBackground, randomTime); // Chiamata ricorsiva con intervallo casuale
	}

	// Avvio della funzione
	changeBackground();
});