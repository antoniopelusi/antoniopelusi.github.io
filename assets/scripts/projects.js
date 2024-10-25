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
	const username = "antoniopelusi";
	const url = `https://api.github.com/users/${username}/repos`;
	try {
		const response = await fetch(url);
		const repos = await response.json();

		repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

		const repoList = document.getElementById("repo-list");
		repoList.innerHTML = "";

		repos.forEach((repo, index) => {
			const listItem = document.createElement("li");
			const container = document.createElement("div");

			container.style.display = "flex";
			container.style.justifyContent = "space-between";
			container.style.alignItems = "center";

			const link = document.createElement("a");
			link.href = repo.html_url;
			link.textContent = repo.name;
			link.target = "_blank";

			const stars = document.createElement("span");
			stars.textContent = `⭐ ${repo.stargazers_count}`;
			stars.style.marginLeft = "8px";
			stars.style.color = "#FFD700";

			if (index % 2 === 0) {
				listItem.style.background = "#212124";
			} else {
				listItem.style.backgroundColor = "#1b1b1e";
			}

			container.appendChild(link);
			container.appendChild(stars);
			listItem.appendChild(container);
			repoList.appendChild(listItem);
		});
	} catch (error) {
		console.error("Errore nel recupero dei repository:", error);
	}
}

window.onload = fetchGitHubRepos;
