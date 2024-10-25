async function simulateTerminal(text, blinkSpeed = 500, shuffleSpeed = 100) {
	const terminal = document.getElementById("name");
	let isCursorVisible = false;

	async function updateTerminal(content) {
		terminal.innerText = content + (isCursorVisible ? "_" : "");
	}

	function shuffleString(str) {
		const array = str.split("");
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array.join("");
	}

	async function blink() {
		isCursorVisible = !isCursorVisible;
		await updateTerminal(terminal.innerText.slice(0, -1));
	}

	async function shuffle() {
		const shuffledText = shuffleString(text);
		await updateTerminal(shuffledText);
	}

	updateTerminal(text);

	setInterval(blink, blinkSpeed);

	setInterval(shuffle, shuffleSpeed);
}

simulateTerminal("Antonio Pelusi");
