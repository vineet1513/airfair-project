import os
import requests
from datetime import date, timedelta
from dotenv import load_dotenv

load_dotenv()

DUFFEL_TOKEN = os.getenv("DUFFEL_ACCESS_TOKEN")

DUFFEL_URL = "https://api.duffel.com/air/offer_requests"


def search_live_fares(origin, destination, days_ahead=1):
    """
    Search live flight offers using Duffel API.
    """

    if not DUFFEL_TOKEN:
        raise Exception("DUFFEL_ACCESS_TOKEN not found in .env")

    departure_date = date.today() + timedelta(days=days_ahead)

    headers = {
        "Authorization": f"Bearer {DUFFEL_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Duffel-Version": "v2"
    }

    payload = {
        "data": {
            "cabin_class": "economy",

            "slices": [
                {
                    "origin": origin.upper(),
                    "destination": destination.upper(),
                    "departure_date": departure_date.isoformat()
                }
            ],

            "passengers": [
                {
                    "type": "adult"
                }
            ],

            "max_connections": 1
        }
    }

    response = requests.post(
        DUFFEL_URL,
        headers=headers,
        json=payload,
        timeout=60
    )

    if response.status_code != 200:
        raise Exception(
            f"Duffel API Error {response.status_code}: {response.text}"
        )

    result = response.json()

    offers = result.get("data", {}).get("offers", [])

    live_data = []

    for offer in offers:

        total_amount = offer.get("total_amount")
        currency = offer.get("total_currency")

        slices = offer.get("slices", [])

        if not slices:
            continue

        segments = slices[0].get("segments", [])

        if not segments:
            continue

        segment = segments[0]

        airline = segment.get(
            "operating_carrier", {}
        ).get("name", "Unknown")

        airline_code = segment.get(
            "operating_carrier", {}
        ).get("iata_code", "")

        flight_number = segment.get(
            "operating_carrier_flight_number",
            ""
        )

        departure_time = segment.get(
            "departing_at",
            ""
        )

        arrival_time = segment.get(
            "arriving_at",
            ""
        )

        live_data.append({

            "timestamp": date.today().isoformat(),

            "origin": origin.upper(),

            "destination": destination.upper(),

            "airline": airline,

            "airline_code": airline_code,

            "flight": flight_number,

            "departure_date": departure_date.isoformat(),

            "advance_window": f"T+{days_ahead}",

            "fare_class": "ECONOMY",

            "base_fare": None,

            "taxes": None,

            "total_fare": float(total_amount)
            if total_amount else None,

            "currency": currency,

            "departure_time": departure_time,

            "arrival_time": arrival_time,

            "source": "Duffel Live API"

        })

    return live_data