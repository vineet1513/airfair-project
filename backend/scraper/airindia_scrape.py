import requests
from bs4 import BeautifulSoup

URL = "https://www.airindia.com/en-in/book-flights/delhi-to-mumbai-flights"

headers = {
    "User-Agent": "AirfareResearchBot/1.0"
}

response = requests.get(
    URL,
    headers=headers,
    timeout=30
)

print("Status Code:", response.status_code)

if response.status_code == 200:

    print("Request successful!")

    soup = BeautifulSoup(response.text, "html.parser")

    text = soup.get_text(" ", strip=True)

    print("\n--- AIR INDIA PAGE DATA ---\n")

    # Search for fare-related information
    keywords = [
        "Delhi to Mumbai",
        "INR",
        "Economy",
        "Fare",
        "Flight"
    ]

    for keyword in keywords:
        if keyword.lower() in text.lower():
            print("FOUND:", keyword)

else:
    print("Request failed!")
    print("Status:", response.status_code)