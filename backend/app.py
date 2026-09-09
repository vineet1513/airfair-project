from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from scraper.live_source import get_live_fares, get_fallback_fares

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})
# --------------------------------
# Temporary airfare data
# --------------------------------

airfare_data = [

    {
        "airline": "IndiGo",
        "route": "DEL-BOM",
        "fare": 4215,
        "source": "MakeMyTrip",
        "captured": "10:20 PM"
    },

    {
        "airline": "Air India",
        "route": "DEL-BOM",
        "fare": 4890,
        "source": "Yatra",
        "captured": "10:18 PM"
    },

    {
        "airline": "SpiceJet",
        "route": "DEL-BOM",
        "fare": 4150,
        "source": "EaseMyTrip",
        "captured": "10:17 PM"
    },

    {
        "airline": "Akasa Air",
        "route": "DEL-BOM",
        "fare": 4599,
        "source": "Cleartrip",
        "captured": "10:16 PM"
    }

]


# --------------------------------
# HOME API
# --------------------------------

@app.route("/")
def home():

    return jsonify({
        "message": "Airfare Price Index API is running"
    })


# --------------------------------
# --------------------------------
# GET ALL FARES
# --------------------------------

@app.route("/api/fares", methods=["GET"])
def get_fares():

    try:

        # Read raw dataset
        df = pd.read_csv("../data/scraped_dataset.csv")

        # Clean Price
        df["Price"] = (
            df["Price"]
            .astype(str)
            .str.replace(",", "", regex=False)
        )

        df["Price"] = pd.to_numeric(
            df["Price"],
            errors="coerce"
        )

        # Convert Journey Date
        df["Date of Journey"] = pd.to_datetime(
            df["Date of Journey"],
            dayfirst=True,
            errors="coerce"
        )

        # Clean Airline-Class
        df["Airline-Class"] = (
            df["Airline-Class"]
            .astype(str)
            .str.replace(r"\\n", "\n", regex=True)
        )

        airline_class = df["Airline-Class"].str.split(
            "\n",
            expand=True
        )

        df["Airline"] = airline_class[0].str.strip()

        # Clean Departure Time
        df["Departure Time"] = (
            df["Departure Time"]
            .astype(str)
            .str.replace(r"\\n", "\n", regex=True)
        )

        departure = df["Departure Time"].str.split(
            "\n",
            expand=True
        )

        df["From"] = departure[1].str.strip()

        # Clean Arrival Time
        df["Arrival Time"] = (
            df["Arrival Time"]
            .astype(str)
            .str.replace(r"\\n", "\n", regex=True)
        )

        arrival = df["Arrival Time"].str.split(
            "\n",
            expand=True
        )

        df["To"] = arrival[1].str.strip()

        # Remove invalid data
        df = df.dropna(
            subset=[
                "Date of Journey",
                "Price",
                "Airline",
                "From",
                "To"
            ]
        )

        # Remove duplicate records
        df = df.drop_duplicates()

        # Get latest journey date
        latest_date = df["Date of Journey"].max()

        # Keep only latest journey date
        latest_data = df[
            df["Date of Journey"] == latest_date
        ]

        # Sort by fare
        latest = (
            latest_data
            .sort_values("Price")
            .drop_duplicates(
                subset=["Airline", "From", "To"]
            )
            .head(10)
        )

        # Convert data into API format
        result = []

        for _, row in latest.iterrows():

            result.append({
                "airline": row["Airline"],
                "route": f'{row["From"]} → {row["To"]}',
                "fare": float(row["Price"]),
                "source": "Historical Dataset",
                "captured": row["Date of Journey"].strftime("%d %b %Y")
            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
# --------------------------------
# SEARCH FARES
# --------------------------------


# --------------------------------
# SEARCH FARES
# --------------------------------

@app.route("/api/fares/search", methods=["GET"])
def search_fares():

    try:

        from_code = request.args.get("from")
        to_code = request.args.get("to")

        # Airport code → dataset city name
        city_map = {
            "DEL": "Delhi",
            "BOM": "Mumbai",
            "BLR": "Bangalore",
            "MAA": "Chennai",
            "CCU": "Kolkata",
            "HYD": "Hyderabad",
            "AMD": "Ahmedabad"
        }

        from_city = city_map.get(from_code)
        to_city = city_map.get(to_code)

        if not from_city or not to_city:
            return jsonify([])

        # Read dataset
        df = pd.read_csv(
            "../data/scraped_dataset.csv"
        )

        # Clean price
        df["Price"] = (
            df["Price"]
            .astype(str)
            .str.replace(",", "", regex=False)
        )

        df["Price"] = pd.to_numeric(
            df["Price"],
            errors="coerce"
        )

        # Convert journey date
        df["Date of Journey"] = pd.to_datetime(
            df["Date of Journey"],
            dayfirst=True,
            errors="coerce"
        )

        # Remove invalid data
        df = df.dropna(
            subset=[
                "Price",
                "Date of Journey"
            ]
        )

        # Filter route
        results_df = df[
            (df["Departure Time"].str.contains(
                from_city,
                na=False
            ))
            &
            (df["Arrival Time"].str.contains(
                to_city,
                na=False
            ))
        ]

        # Latest journey date
        if not results_df.empty:

            latest_date = results_df[
                "Date of Journey"
            ].max()

            results_df = results_df[
                results_df["Date of Journey"] == latest_date
            ]

        # Sort by cheapest fare
        results_df = results_df.sort_values(
            "Price"
        )

        # Remove duplicate airline + route
        results_df = results_df.drop_duplicates(
            subset=[
                "Airline-Class",
                "Departure Time",
                "Arrival Time"
            ]
        )

        # Maximum 10 results
        results_df = results_df.head(10)

        result = []

        for _, row in results_df.iterrows():

            airline_parts = str(
                row["Airline-Class"]
            ).split("\n")

            airline = airline_parts[0].strip()

            result.append({

                "airline": airline,

                "route": (
                    f"{from_city} → {to_city}"
                ),

                "fare": float(
                    row["Price"]
                ),

                "source": "Historical Dataset",

                "captured": row[
                    "Date of Journey"
                ].strftime("%d %b %Y")

            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
# --------------------------------
# PRICE INDEX
# --------------------------------
@app.route("/api/index", methods=["GET"])
def get_index():

    try:
        # Read calculated airfare index
        index_data = pd.read_csv(
            "../data/airfare_index.csv"
        )

        # Get latest index
        latest = index_data.iloc[-1]

        # Get previous index
        previous = index_data.iloc[-2]

        latest_index = float(
            latest["Airfare Price Index"]
        )

        previous_index = float(
            previous["Airfare Price Index"]
        )

        # Calculate percentage change
        change = (
            (latest_index - previous_index)
            / previous_index
        ) * 100

        return jsonify({
            "overall": round(latest_index, 2),
            "previous": round(previous_index, 2),
            "change": round(change, 2),
            "date": str(latest["Date of Journey"])
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    # ==========================================
# AIRFARE INDEX HISTORY API
# ==========================================

@app.route("/api/index/history", methods=["GET"])
def get_index_history():

    try:

        # Read calculated airfare index
        index_data = pd.read_csv(
            "../data/airfare_index.csv"
        )

        # Select required columns
        history = index_data[
            [
                "Date of Journey",
                "Airfare Price Index"
            ]
        ]

        # Convert dataframe to list of dictionaries
        history = history.to_dict(
            orient="records"
        )

        return jsonify(history)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    # ==========================================
# DAILY AIRFARE TREND API
# ==========================================

@app.route("/api/fares/trend", methods=["GET"])
def get_fare_trend():

    try:

        # Read raw flight data
        df = pd.read_csv(
            "../data/scraped_dataset.csv"
        )

        # Clean price
        df["Price"] = (
            df["Price"]
            .astype(str)
            .str.replace(",", "", regex=False)
        )

        df["Price"] = pd.to_numeric(
            df["Price"],
            errors="coerce"
        )

        # Convert journey date
        df["Date of Journey"] = pd.to_datetime(
            df["Date of Journey"],
            dayfirst=True,
            errors="coerce"
        )

        # Remove invalid values
        df = df.dropna(
            subset=[
                "Date of Journey",
                "Price"
            ]
        )

        # Calculate daily average airfare
        daily_fare = (
            df
            .groupby("Date of Journey")["Price"]
            .mean()
            .reset_index()
        )

        # Sort by date
        daily_fare = daily_fare.sort_values(
            "Date of Journey"
        )

        # Convert date to string
        daily_fare["Date of Journey"] = (
            daily_fare["Date of Journey"]
            .dt.strftime("%Y-%m-%d")
        )

        # Round average fare
        daily_fare["Average Fare"] = (
            daily_fare["Price"]
            .round(2)
        )

        # Return required columns
        result = daily_fare[
            [
                "Date of Journey",
                "Average Fare"
            ]
        ].to_dict(
            orient="records"
        )

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# --------------------------------
# ANALYSIS API
# --------------------------------

@app.route("/api/analysis", methods=["GET"])
def get_analysis():

    try:

        # Read raw flight data
        df = pd.read_csv(
            "../data/scraped_dataset.csv"
        )

        # Clean Price
        df["Price"] = (
            df["Price"]
            .astype(str)
            .str.replace(",", "", regex=False)
        )

        df["Price"] = pd.to_numeric(
            df["Price"],
            errors="coerce"
        )

        # Remove invalid prices
        df = df.dropna(
            subset=["Price"]
        )

        # Total number of flight records
        total_flights = len(df)

        # Average fare
        average_fare = df["Price"].mean()

        # Minimum fare
        minimum_fare = df["Price"].min()

        # Maximum fare
        maximum_fare = df["Price"].max()

        # --------------------------------
        # AIRLINE
        # --------------------------------

        df["Airline"] = (
            df["Airline-Class"]
            .astype(str)
            .str.replace(
                r"\\n",
                "\n",
                regex=True
            )
            .str.split("\n")
            .str[0]
            .str.strip()
        )

        total_airlines = (
            df["Airline"].nunique()
        )

        # --------------------------------
        # ROUTES
        # --------------------------------

        df["Departure Time"] = (
            df["Departure Time"]
            .astype(str)
            .str.replace(
                r"\\n",
                "\n",
                regex=True
            )
        )

        df["Arrival Time"] = (
            df["Arrival Time"]
            .astype(str)
            .str.replace(
                r"\\n",
                "\n",
                regex=True
            )
        )

        departure = df["Departure Time"].str.split(
            "\n",
            expand=True
        )

        arrival = df["Arrival Time"].str.split(
            "\n",
            expand=True
        )

        df["From"] = (
            departure[1]
            .str.strip()
        )

        df["To"] = (
            arrival[1]
            .str.strip()
        )

        # Count unique routes
        total_routes = (
            df[
                ["From", "To"]
            ]
            .dropna()
            .drop_duplicates()
            .shape[0]
        )

        # --------------------------------
        # AIRLINE-WISE AVERAGE FARE
        # --------------------------------

        airline_fares = (
            df.groupby("Airline")["Price"]
            .mean()
            .round(2)
            .sort_values()
        )

        airline_data = [
            {
                "airline": airline,
                "average_fare": float(fare)
            }
            for airline, fare
            in airline_fares.items()
        ]

        # --------------------------------
        # RETURN JSON
        # --------------------------------

        return jsonify({

            "total_flights":
                int(total_flights),

            "total_airlines":
                int(total_airlines),

            "total_routes":
                int(total_routes),

            "average_fare":
                float(
                    round(
                        average_fare,
                        2
                    )
                ),

            "minimum_fare":
                float(
                    round(
                        minimum_fare,
                        2
                    )
                ),

            "maximum_fare":
                float(
                    round(
                        maximum_fare,
                        2
                    )
                ),

            "airline_analysis":
                airline_data

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
# --------------------------------
# ROUTE COMPARISON
# --------------------------------

@app.route("/api/routes", methods=["GET"])
def get_routes():

    try:

        # Read dataset
        df = pd.read_csv(
            "../data/scraped_dataset.csv"
        )

        # Clean price
        df["Price"] = (
            df["Price"]
            .astype(str)
            .str.replace(",", "", regex=False)
        )

        df["Price"] = pd.to_numeric(
            df["Price"],
            errors="coerce"
        )

        # Clean departure and arrival columns
        df["Departure Time"] = (
            df["Departure Time"]
            .astype(str)
            .str.replace(r"\\n", "\n", regex=True)
        )

        df["Arrival Time"] = (
            df["Arrival Time"]
            .astype(str)
            .str.replace(r"\\n", "\n", regex=True)
        )

        # Extract From city
        departure = df["Departure Time"].str.split(
            "\n",
            expand=True
        )

        df["From"] = departure[1].str.strip()

        # Extract To city
        arrival = df["Arrival Time"].str.split(
            "\n",
            expand=True
        )

        df["To"] = arrival[1].str.strip()

        # Remove invalid rows
        df = df.dropna(
            subset=[
                "Price",
                "From",
                "To"
            ]
        )

        # Create route
        df["Route"] = (
            df["From"]
            + " → "
            + df["To"]
        )

        # Calculate average fare for every route
        route_data = (
            df.groupby("Route")["Price"]
            .mean()
            .reset_index()
        )

        # Rename price column
        route_data = route_data.rename(
            columns={
                "Price": "Average Fare"
            }
        )

        # Sort by highest fare
        route_data = route_data.sort_values(
            "Average Fare",
            ascending=False
        )

        # Keep top 10 routes
        route_data = route_data.head(10)

        # Round fare
        route_data["Average Fare"] = (
            route_data["Average Fare"]
            .round(2)
        )

        # Convert to JSON
        result = route_data.to_dict(
            orient="records"
        )

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
  # --------------------------------
# VIEW ALL FARES
# --------------------------------
# --------------------------------
# VIEW ALL FARES
# --------------------------------

@app.route("/api/fares/all", methods=["GET"])
def get_all_fares():

    try:

        # Read dataset
        df = pd.read_csv(
            "../data/scraped_dataset.csv"
        )

        # Clean Price
        df["Price"] = (
            df["Price"]
            .astype(str)
            .str.replace(",", "", regex=False)
        )

        df["Price"] = pd.to_numeric(
            df["Price"],
            errors="coerce"
        )

        # Clean departure and arrival columns
        df["Departure Time"] = (
            df["Departure Time"]
            .astype(str)
            .str.replace(r"\\n", "\n", regex=True)
        )

        df["Arrival Time"] = (
            df["Arrival Time"]
            .astype(str)
            .str.replace(r"\\n", "\n", regex=True)
        )

        # Extract From city
        departure = df["Departure Time"].str.split(
            "\n",
            expand=True
        )

        df["From"] = departure[1].str.strip()

        # Extract To city
        arrival = df["Arrival Time"].str.split(
            "\n",
            expand=True
        )

        df["To"] = arrival[1].str.strip()

        # Remove invalid rows
        df = df.dropna(
            subset=[
                "Price",
                "From",
                "To"
            ]
        )

        # Create route
        df["Route"] = (
            df["From"]
            + " → "
            + df["To"]
        )

        # Select useful columns
        result = df[
            [
                "Airline-Class",
                "Route",
                "Price",
                "Date of Journey"
            ]
        ].copy()

        # Rename columns to match frontend
        result = result.rename(
            columns={
                "Airline-Class": "airline",
                "Route": "route",
                "Price": "fare",
                "Date of Journey": "captured"
            }
        )

        # Convert date to string
        result["captured"] = (
            pd.to_datetime(
                result["captured"],
                errors="coerce",
                dayfirst=True
            )
            .dt.strftime("%d %b %Y")
        )

        # Add source
        result["source"] = "Historical Dataset"

        # Convert fare to number
        result["fare"] = pd.to_numeric(
            result["fare"],
            errors="coerce"
        )

        # Remove invalid data
        result = result.dropna(
            subset=[
                "airline",
                "route",
                "fare"
            ]
        )

        # Convert to JSON
        data = result.to_dict(
            orient="records"
        )

        return jsonify(data)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    # ---------live faers----------------
@app.route("/api/live-fares", methods=["GET"])
def live_fares():

    origin = request.args.get("from", "DEL")
    destination = request.args.get("to", "BOM")

    try:

        data = get_live_fares(origin, destination)

        return jsonify({
            "success": True,
            "mode": "live",
            "source": "RapidAPI Air Scraper",
            "count": len(data),
            "data": data
        })

    except Exception as e:

        print("Live API unavailable:", e)

        fallback = get_fallback_fares(
            origin,
            destination
        )

        return jsonify({
            "success": True,
            "mode": "fallback",
            "source": "Demo / Cached Fare",
            "count": len(fallback),
            "message": "Live API temporarily unavailable. Showing cached demo fares.",
            "data": fallback
        })