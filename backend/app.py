from flask import Flask, jsonify, request
from flask_cors import CORS

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
# GET ALL FARES
# --------------------------------

@app.route("/api/fares", methods=["GET"])
def get_fares():

    return jsonify(airfare_data)


# --------------------------------
# SEARCH FARES
# --------------------------------

@app.route("/api/fares/search", methods=["GET"])
def search_fares():

    from_city = request.args.get("from")
    to_city = request.args.get("to")

    route = f"{from_city}-{to_city}"

    results = [

        flight
        for flight in airfare_data
        if flight["route"] == route

    ]

    return jsonify(results)


# --------------------------------
# PRICE INDEX
# --------------------------------

@app.route("/api/index", methods=["GET"])
def get_index():

    return jsonify({

        "overall": 112.45,

        "domestic": 110.32,

        "international": 118.91,

        "change": 6.21

    })


# --------------------------------
# RUN SERVER
# --------------------------------

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )