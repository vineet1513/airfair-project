import requests
from bs4 import BeautifulSoup


URL = "https://quotes.toscrape.com/"


headers = {
    "User-Agent": "AirfareResearchBot/1.0"
}


response = requests.get(
    URL,
    headers=headers,
    timeout=20
)


print("Status Code:", response.status_code)


if response.status_code == 200:

    print("Request successful!")

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    quotes = soup.select(".quote")

    print("Quotes found:", len(quotes))

    for quote in quotes[:5]:

        text = quote.select_one(".text").get_text(strip=True)

        author = quote.select_one(".author").get_text(strip=True)

        print("-------------------------")
        print("Quote :", text)
        print("Author:", author)

else:

    print("Request failed!")
    print("Status:", response.status_code)