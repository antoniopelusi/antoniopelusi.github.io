document.addEventListener("DOMContentLoaded", () => {
	async function fetchGitHubRepos() {
		const response = await fetch("/assets/data/repos.json");

		const repos = await response.json();

		repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

		const repoList = document.getElementById("repo-list");
		repoList.innerHTML = "";

		repos.forEach((repo, index) => {
			const listItem = document.createElement("li");
			const container = document.createElement("div");

			container.style.display = "flex";
			container.style.justifyContent = "space-between";
			container.style.alignItems = "center";

			const titleContainer = document.createElement("div");
			titleContainer.style.display = "flex";
			titleContainer.style.alignItems = "center";
			titleContainer.style.justifyContent = "left";
			titleContainer.style.wordBreak = "break-all";

			const image = document.createElement("img");

			if (index === 0) {
				image.src = "/assets/icons/listicon/listStart.png";
			} else if (index === repos.length - 1) {
				image.src = "/assets/icons/listicon/listEnd.png";
			} else {
				image.src = "/assets/icons/listicon/listItem.png";
			}

			image.style.height = "50px";
			image.style.minWidth = "22px";
			image.style.maxWidth = "22px";

			const link = document.createElement("a");
			link.href = repo.html_url;
			link.textContent = repo.name;
			link.target = "_blank";

			const languagesContainer = document.createElement("div");
			languagesContainer.style.display = "flex";
			languagesContainer.style.gap = "5px";
			languagesContainer.style.marginLeft = "auto";

			repo.languages.forEach((language) => {
				const color = getLanguageColor(language);
				if (color !== null) {
					const languageDot = document.createElement("div");
					languageDot.style.width = "12px";
					languageDot.style.height = "12px";
					languageDot.style.borderRadius = "50%";
					languageDot.style.backgroundColor = color;
					languageDot.setAttribute("language", language);
					languageDot.className = "language-dot";
					languagesContainer.appendChild(languageDot);
				}
			});

			if (index % 2 === 0) {
				listItem.style.background = "#212124";
			} else {
				listItem.style.backgroundColor = "#1b1b1e";
			}

			titleContainer.appendChild(image);
			titleContainer.appendChild(link);

			container.appendChild(titleContainer);
			container.appendChild(languagesContainer);
			listItem.appendChild(container);
			repoList.appendChild(listItem);
		});
	}

	function getLanguageColor(language) {
		const colors = {
			C: "#555555",
			"C++": "#f34b7f",
			Rust: "#dea584",
			"C#": "#178701",
			Cuda: "#3b4e3a",
			Java: "#af7219",
			Kotlin: "#a97bff",
			Python: "#3573a6",
			"Jupyter Notebook": "#da5b0c",
			Perl: "#0398c3",
			LISP: "#3fb68c",
			COBOL: "#9e6a04",
			HTML: "#e44c27",
			CSS: "#543e7c",
			SCSS: "#c6538c",
			JavaScript: "#f1e15a",
			TypeScript: "#3178c6",
			Ruby: "#6f1515",
			Makefile: "#42781a",
			CMake: "#da3434",
			Shell: "#89e051",
			Dockerfile: "#394d54",
		};
		return colors[language] || null;
	}

	window.onload = fetchGitHubRepos;
});
