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

		const image = document.createElement("img");

		if (index === 0) {
			image.src = "/assets/icons/listicon/listStart.png";
		} else if (index === repos.length - 1) {
			image.src = "/assets/icons/listicon/listEnd.png";
		} else {
			image.src = "/assets/icons/listicon/listItem.png";
		}

		image.style.height = "45px";

		const link = document.createElement("a");
		link.href = repo.html_url;
		link.textContent = repo.name;
		link.target = "_blank";

		const stars = document.createElement("span");
		stars.textContent = `⭐ ${repo.stargazers_count}`;
		stars.style.color = "#FFD700";
		stars.style.whiteSpace = "nowrap";

		if (index % 2 === 0) {
			listItem.style.background = "#212124";
		} else {
			listItem.style.backgroundColor = "#1b1b1e";
		}

		titleContainer.appendChild(image);
		titleContainer.appendChild(link);

		container.appendChild(titleContainer);
		container.appendChild(stars);
		listItem.appendChild(container);
		repoList.appendChild(listItem);
	});
}

window.onload = fetchGitHubRepos;
