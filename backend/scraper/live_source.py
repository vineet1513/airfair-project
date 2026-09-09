from datetime import datetime


def get_live_fares(origin="DEL", destination="BOM"):
    """
    Live fare source adapter.

    Currently returns a clearly-labelled demo record.
    Replace this function with an authorized API/source
    once credentials/access are available.
    """

    return [
        {
            "airline": "Air India",
            "from": origin,
            "to": destination,
            "fare": None,
            "currency": "INR",
            "class": "Economy",
            "source": "Live API - pending authorization",
            "captured_at": datetime.now().isoformat()
        }
    ]


if __name__ == "__main__":

    data = get_live_fares("DEL", "BOM")

    print("\n========== LIVE FARE SOURCE TEST ==========\n")

    for fare in data:
        print("Airline    :", fare["airline"])
        print("Route      :", fare["from"], "→", fare["to"])
        print("Fare       :", fare["fare"])
        print("Currency   :", fare["currency"])
        print("Class      :", fare["class"])
        print("Source     :", fare["source"])
        print("Captured   :", fare["captured_at"])

    print("\n===========================================\n")