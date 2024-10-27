document.addEventListener("DOMContentLoaded", function () {
	const sidebar = document.getElementById("sidebar");
	const openBtn = document.getElementById("openBtn");
	const closeBtn = document.getElementById("closeBtn");
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
});
