import os
import requests
from dotenv import load_dotenv

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

URL = "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights"

HEADERS = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "sky-scrapper.p.rapidapi.com"
}


# ==========================================
# LIVE FARE FUNCTION
# ==========================================

def get_live_fares(origin="DEL", destination="BOM", date="2026-10-09"):

    params = {
        "originSkyId": origin,
        "destinationSkyId": destination,
        "originEntityId": "95673498",
        "destinationEntityId": "95673320",
        "date": date,
        "cabinClass": "economy",
        "adults": "1",
        "currency": "INR",
        "market": "en-IN",
        "countryCode": "IN"
    }

    response = requests.get(
        URL,
        headers=HEADERS,
        params=params,
        timeout=30
    )

    response.raise_for_status()

    result = response.json()

    fares = []

    if result.get("status") is True:

        itineraries = (
            result
            .get("data", {})
            .get("itineraries", [])
        )

        for itinerary in itineraries:

            price = itinerary.get("price", {})
            legs = itinerary.get("legs", [])

            if not legs:
                continue

            leg = legs[0]

            carriers = (
                leg
                .get("carriers", {})
                .get("marketing", [])
            )

            airline = (
                carriers[0].get("name")
                if carriers
                else "Unknown"
            )

            segments = leg.get("segments", [])

            flight_number = (
                segments[0].get("flightNumber")
                if segments
                else "Unknown"
            )

            fares.append({
                "airline": airline,
                "flightNumber": flight_number,
                "from": leg.get("origin", {}).get("displayCode"),
                "to": leg.get("destination", {}).get("displayCode"),
                "fare": price.get("raw"),
                "fareFormatted": price.get("formatted"),
                "currency": "INR",
                "durationMinutes": leg.get("durationInMinutes"),
                "stops": leg.get("stopCount"),
                "departure": leg.get("departure"),
                "arrival": leg.get("arrival"),
                "source": "RapidAPI Air Scraper"
            })

    return fares



# ==========================================
# FALLBACK FARES
# ==========================================

def get_fallback_fares(origin="DEL", destination="BOM"):

    return [
        {
            "airline": "IndiGo",
            "flightNumber": "6E-204",
            "from": origin,
            "to": destination,
            "fare": 4215,
            "fareFormatted": "₹4,215",
            "currency": "INR",
            "durationMinutes": 135,
            "stops": 0,
            "departure": "10:20",
            "arrival": "12:35",
            "source": "Demo / Cached Fare"
        },
        {
            "airline": "Air India",
            "flightNumber": "AI-865",
            "from": origin,
            "to": destination,
            "fare": 4890,
            "fareFormatted": "₹4,890",
            "currency": "INR",
            "durationMinutes": 145,
            "stops": 0,
            "departure": "11:10",
            "arrival": "13:35",
            "source": "Demo / Cached Fare"
        },
        {
            "airline": "SpiceJet",
            "flightNumber": "SG-8152",
            "from": origin,
            "to": destination,
            "fare": 4150,
            "fareFormatted": "₹4,150",
            "currency": "INR",
            "durationMinutes": 140,
            "stops": 0,
            "departure": "14:20",
            "arrival": "16:40",
            "source": "Demo / Cached Fare"
        }
    ]