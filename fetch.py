import requests
import json

def fetch_repos():
	url = "https://api.github.com/users/antoniopelusi/repos"
	
	response = requests.get(url)
	
	if response.status_code == 200:
		repos = response.json()

		filtered_repos = []

		for repo in repos:
			filtered_repo = {
				"created_at": repo["created_at"],
				"stargazers_count": repo["stargazers_count"],
				"name": repo["name"],
				"html_url": repo["html_url"]
			}
			filtered_repos.append(filtered_repo)

		final_json = json.dumps(filtered_repos, indent=4)
	
		with open('assets/data/repos.json', 'w') as json_file:
			json_file.write(final_json)

		print("Repos: ready")

def fetch_cv():
	url = "https://drive.google.com/uc?export=download&id=1gO0xD8AMeXDzXfcd_xIzL01kG7lrVOGj"
	
	response = requests.get(url)
	
	with open("assets/data/cv.pdf", "wb") as file:
		file.write(response.content)

	print("CV: ready")

fetch_repos()
fetch_cv()