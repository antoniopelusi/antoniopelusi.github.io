document.addEventListener("DOMContentLoaded", function () {
	const sidebar = document.getElementById("sidebar");
	const openBtn = document.getElementById("openBtn");
	const closeBtn = document.getElementById("closeBtn");
	const body = document.querySelector("body");
	const main = document.querySelector("main");

	openBtn.addEventListener("click", function () {
		sidebar.classList.add("open");
		openBtn.classList.add("inactive");
	});

	closeBtn.addEventListener("click", function () {
		sidebar.classList.remove("open");
		openBtn.classList.remove("inactive");
	});

	main.addEventListener("click", function () {
		if (sidebar.classList.contains("open")) {
			sidebar.classList.remove("open");
			openBtn.classList.remove("inactive");
		}
	});

	let startX = 0;
	let endX = 0;

	body.addEventListener("touchstart", (e) => {
		startX = e.touches[0].clientX;
	});

	body.addEventListener("touchend", (e) => {
		endX = e.changedTouches[0].clientX;
		handleSwipe();
	});

	function handleSwipe() {
		const swipeDistance = endX - startX;

		if (swipeDistance > 50) {
			sidebar.classList.add("open");
			openBtn.classList.add("inactive");
		} else if (swipeDistance < -50) {
			sidebar.classList.remove("open");
			openBtn.classList.remove("inactive");
		}
	}
});

const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 16;
const maxChars = 200;
let characters = [];

function spawnCharacter() {
	const char = Math.random() > 0.5 ? "1" : "0";
	const x = Math.random() * canvas.width;
	const y = Math.random() * canvas.height;
	const opacity = 1;
	const life = Math.random() * 2 + 1;

	characters.push({ char, x, y, opacity, life });
	if (characters.length > maxChars) {
		characters.shift();
	}
}

function drawCharacters() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	characters.forEach((c, index) => {
		ctx.fillStyle = `rgba(50, 50, 53, ${c.opacity})`;
		ctx.font = `${fontSize}px monospace`;
		ctx.fillText(c.char, c.x, c.y);

		c.opacity -= 0.01;
		c.life -= 0.01;

		if (c.life <= 0 || c.opacity <= 0) {
			characters.splice(index, 1);
		}
	});

	requestAnimationFrame(drawCharacters);
}

setInterval(spawnCharacter, 100);
drawCharacters();

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
