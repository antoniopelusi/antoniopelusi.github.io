document.addEventListener("DOMContentLoaded", () => {
	const typingElements = document.querySelectorAll(
		"main left div p, main left div a, main left div h2",
	);
	const images = document.querySelectorAll("left img");
	const indexseparator = document.getElementById("indexseparator");

	typingElements.forEach((el) => {
		el.style.visibility = "hidden";
	});

	images.forEach((img) => {
		img.style.visibility = "hidden";
	});

	setTimeout(() => {
		typingElements.forEach((el, index) => {
			const text = el.textContent.trim();
			el.textContent = "";
			el.setAttribute("data-text", text);
			el.classList.add("typing");
			el.style.visibility = "visible";

			setTimeout(() => {
				typeText(el, text);
			}, index * 500);
		});

		function typeText(element, text, index = 0) {
			if (index < text.length) {
				element.textContent += text[index];
				setTimeout(() => typeText(element, text, index + 1), 70);
			} else {
				element.classList.remove("typing");
			}
		}

		images.forEach((img, index) => {
			const delay = index === 0 ? 1850 : index * 450;

			setTimeout(() => {
				img.style.visibility = "visible";
				img.classList.add("visible");
			}, delay);
		});
		
		setTimeout(() => {
			indexseparator.style.opacity = 1;
		}, 2700);
	}, 300);
});
