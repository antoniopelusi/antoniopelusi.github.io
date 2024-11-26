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
