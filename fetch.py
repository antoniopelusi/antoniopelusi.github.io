import requests
import json

def fetch_repos():
    url = "https://api.github.com/users/antoniopelusi/repos"
    response = requests.get(url)
    
    if response.status_code == 200:
        repos = response.json()
        filtered_repos = []
        
        for repo in repos:
            # Endpoint per ottenere i linguaggi della repository
            languages_url = repo["languages_url"]
            languages_response = requests.get(languages_url)
            
            # Controlla se la richiesta per i linguaggi è andata a buon fine
            if languages_response.status_code == 200:
                languages = languages_response.json()
            else:
                languages = {}
            
            # Creazione dell'oggetto filtro
            filtered_repo = {
                "created_at": repo["created_at"],
                "name": repo["name"],
                "html_url": repo["html_url"],
                "languages": list(languages.keys())  # Solo i nomi dei linguaggi
            }
            filtered_repos.append(filtered_repo)
        
        # Salva i risultati in un file JSON
        final_json = json.dumps(filtered_repos, indent=4)
        with open('assets/data/repos.json', 'w') as json_file:
            json_file.write(final_json)
        
        print("Repos: ready")
    else:
        print(f"Errore: Impossibile ottenere le repository (status code: {response.status_code})")

def fetch_cv():
    url = "https://drive.google.com/uc?export=download&id=1gO0xD8AMeXDzXfcd_xIzL01kG7lrVOGj"
    response = requests.get(url)
    
    if response.status_code == 200:
        with open("assets/data/cv.pdf", "wb") as file:
            file.write(response.content)
        print("CV: ready")
    else:
        print(f"Errore: Impossibile scaricare il CV (status code: {response.status_code})")

fetch_repos()
fetch_cv()
