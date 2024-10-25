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

simulateTerminal("Antonio Pelusi");
