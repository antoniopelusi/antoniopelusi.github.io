async function simulateTerminal(text, typingSpeed = 100, blinkSpeed = 500) {
	const terminal = document.getElementById("name");
	let index = 0;
	let isCursorVisible = false;

	async function updateTerminal(content) {
		terminal.innerText = content + (isCursorVisible ? "_" : "");
	}

	async function initialBlink(blinkCount) {
		if (blinkCount > 0) {
			isCursorVisible = !isCursorVisible;
			updateTerminal("");
			setTimeout(() => initialBlink(blinkCount - 1), blinkSpeed);
		} else {
			startTyping();
		}
	}

	async function startTyping() {
		const typingInterval = setInterval(() => {
			if (index < text.length) {
				updateTerminal(text.substring(0, index + 1));
				index++;
			} else {
				clearInterval(typingInterval);
				isCursorVisible = true;
				setInterval(blink, blinkSpeed);
			}
		}, typingSpeed);
	}

	async function blink() {
		isCursorVisible = !isCursorVisible;
		updateTerminal(text.substring(0, index));
	}

	initialBlink(1);
}

simulateTerminal("Antonio Pelusi");
