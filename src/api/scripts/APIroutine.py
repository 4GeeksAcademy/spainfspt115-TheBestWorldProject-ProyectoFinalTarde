import time
import requests

API_EXTERNAL = "https://rae-api.com/api/random/"
API_BACKEND = "https://probable-sniffle-975jjx97p7v7cr7-3001.app.github.dev/api/words"

def loop():
    while True:
        try:
            response = requests.get(API_EXTERNAL, headers={"Accept": "application/json"})
            if response.status_code != 200:
                print(f"Error in External API: {response.status_code}")
                time.sleep(10)
                continue

            data = response.json()
            word = data.get("data").get("word")
            if not word:
                print("Not Word recived - NULL !!")
                time.sleep(10)
                continue

            response = requests.post(API_BACKEND, json={"word": word})
            if response.status_code in (200, 201):
                print("Word Succesfuly saved !!", word, response.json())
            else:
                print(f"Backend ERROR response - {response.status_code}: {response.text}")

        except Exception as exc:
            print("Error in LOOP routine:", exc)

        time.sleep(1)

if __name__ == "__main__":
    loop()
