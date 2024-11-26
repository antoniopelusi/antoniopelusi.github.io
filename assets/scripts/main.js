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

	const filesToPreload = [
		"/assets/icons/favicon/apple-touch-icon.png",
		"/assets/icons/favicon/favicon-96x96.png",
		"/assets/icons/favicon/favicon.ico",
		"/assets/icons/favicon/favicon.svg",
		"/assets/icons/favicon/site.webmanifest",
		"/assets/icons/favicon/web-app-manifest-192x192.png",
		"/assets/icons/favicon/web-app-manifest-512x512.png",
		"/assets/icons/listicon/listEnd.png",
		"/assets/icons/listicon/listItem.png",
		"/assets/icons/listicon/listStart.png",
		"/assets/icons/w98_catalog.ico",
		"/assets/icons/w98_certificate.ico",
		"/assets/icons/w98_connected_world.ico",
		"/assets/icons/w98_desktop_w95.ico",
		"/assets/icons/w98_envelope_open_sheet.ico",
		"/assets/icons/w98_globe_map.ico",
		"/assets/icons/w98_help_book_big.ico",
		"/assets/icons/w98_msie1.ico",
		"/assets/icons/w98_package.ico",
		"/assets/icons/w98_program_manager.ico",
		"/assets/icons/w98_tree.ico",

		"/assets/data/cv.pdf",
		"/assets/data/repos.json",
	];

	async function preloadFiles() {
		try {
			// Precarica tutti i file
			const fetchPromises = filesToPreload.map((file) =>
				fetch(file, { cache: "no-cache" }),
			);
			await Promise.all(fetchPromises);
		} catch (err) {
			console.error("Error during pre-fetch:", err);
		}
	}

	// Avvia il precaricamento al caricamento della pagina
	window.addEventListener("load", preloadFiles);
});
