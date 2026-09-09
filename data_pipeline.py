import pandas as pd

# ==========================================
# 1. LOAD RAW DATA
# ==========================================
df = pd.read_csv("data/scraped_dataset.csv")

print("Original shape:", df.shape)


# ==========================================
# 2. REMOVE DUPLICATE ROWS
# ==========================================

duplicates = df.duplicated().sum()

print("Duplicate rows found:", duplicates)

df = df.drop_duplicates()

print("Shape after removing duplicates:", df.shape)


# ==========================================
# 3. CLEAN PRICE
# ==========================================

df["Price"] = (
    df["Price"]
    .astype(str)
    .str.replace(",", "", regex=False)
)

df["Price"] = pd.to_numeric(df["Price"], errors="coerce")


# ==========================================
# 4. CONVERT DATES
# ==========================================

df["Date of Booking"] = pd.to_datetime(
    df["Date of Booking"],
    dayfirst=True,
    errors="coerce"
)

df["Date of Journey"] = pd.to_datetime(
    df["Date of Journey"],
    dayfirst=True,
    errors="coerce"
)


# ==========================================
# 5. CHECK RESULT
# ==========================================

# print("\n===== AFTER CLEANING =====")

# print("\nShape:")
# print(df.shape)

# print("\nData Types:")
# print(df.dtypes)

# print("\nMissing Values:")
# print(df.isnull().sum())

# print("\nPrice Sample:")
# print(df["Price"].head(10))

# print("\nDate Sample:")
# print(df[["Date of Booking", "Date of Journey"]].head())


# ==========================================
# 6. SAVE CLEANED DATA
# ==========================================

#df.to_csv("data/processed_fares.csv", index=False)

#print("\nCleaned data saved to:")
#print("data/processed_fares.csv")
# ==========================================
# 7. INSPECT RAW COLUMNS
# ==========================================

# print("\n===== AIRLINE-CLASS EXAMPLES =====")
# print(df["Airline-Class"].head(20).to_string(index=False))

# print("\n===== DEPARTURE TIME EXAMPLES =====")
# print(df["Departure Time"].head(20).to_string(index=False))

# print("\n===== ARRIVAL TIME EXAMPLES =====")
# print(df["Arrival Time"].head(20).to_string(index=False))

# print("\n===== DURATION EXAMPLES =====")
# print(df["Duration"].head(20).to_string(index=False))

# print("\n===== TOTAL STOPS EXAMPLES =====")
# print(df["Total Stops"].value_counts().head(20))
# ==========================================
# ==========================================
# 8. CLEAN AIRLINE-CLASS
# ==========================================

# Convert escaped \n into actual newline
df["Airline-Class"] = (
    df["Airline-Class"]
    .astype(str)
    .str.replace(r"\\n", "\n", regex=True)
)

airline_class = df["Airline-Class"].str.split("\n", expand=True)

df["Airline"] = airline_class[0].str.strip()
df["Flight Number"] = airline_class[1].str.strip()
df["Class"] = airline_class[2].str.strip()


# ==========================================
# 9. CLEAN DEPARTURE TIME
# ==========================================

df["Departure Time"] = (
    df["Departure Time"]
    .astype(str)
    .str.replace(r"\\n", "\n", regex=True)
)

departure = df["Departure Time"].str.split("\n", expand=True)

df["Departure"] = departure[0].str.strip()
df["From"] = departure[1].str.strip()


# ==========================================
# 10. CLEAN ARRIVAL TIME
# ==========================================

df["Arrival Time"] = (
    df["Arrival Time"]
    .astype(str)
    .str.replace(r"\\n", "\n", regex=True)
)

arrival = df["Arrival Time"].str.split("\n", expand=True)

df["Arrival"] = arrival[0].str.strip()
df["To"] = arrival[1].str.strip()


# ==========================================
# 11. CLEAN DURATION
# ==========================================

df["Duration Minutes"] = (
    df["Duration"]
    .str.extract(r"(\d+)h")[0]
    .astype(int) * 60
    +
    df["Duration"]
    .str.extract(r"(\d+)m")[0]
    .astype(int)
)


# ==========================================
# ==========================================
# 12. CLEAN TOTAL STOPS
# ==========================================

df["Stops"] = (
    df["Total Stops"]
    .astype(str)
    .str.strip()
    .str.extract(r"(\d+)", expand=False)
)

df["Stops"] = pd.to_numeric(
    df["Stops"],
    errors="coerce"
)

df["Stops"] = df["Stops"].fillna(0).astype(int)

# ==========================================
# 13. CHECK NEW COLUMNS
# ==========================================

print("\n===== CLEANED DATA =====")

print(
    df[
        [
            "Airline",
            "Flight Number",
            "Class",
            "Departure",
            "From",
            "Arrival",
            "To",
            "Duration Minutes",
            "Stops",
            "Price"
        ]
    ].head(10)
)
# ==========================================
# 14. SAVE PROCESSED DATA
# ==========================================

df.to_csv("data/processed_fares.csv", index=False)

print("\nProcessed dataset saved successfully!")
# ==========================================
# 14. DATA VALIDATION
# ==========================================

print("\n===== DATA VALIDATION =====")

# 1. Check invalid prices
invalid_price = df[df["Price"] <= 0]

print("Invalid prices:", len(invalid_price))


# 2. Check invalid duration
invalid_duration = df[df["Duration Minutes"] <= 0]

print("Invalid durations:", len(invalid_duration))


# 3. Check invalid stops
invalid_stops = df[df["Stops"] < 0]

print("Invalid stops:", len(invalid_stops))


# 4. Check invalid routes
invalid_routes = df[df["From"] == df["To"]]

print("Invalid routes:", len(invalid_routes))


# 5. Check missing values
print("\nMissing values:")

print(df.isnull().sum())
# ==========================================
# 15. DATASET ANALYSIS
# ==========================================

print("\n===== DATASET ANALYSIS =====")

# 1. Number of unique airlines
print("\nUnique Airlines:")
print(df["Airline"].nunique())


# 2. Airline-wise number of records
print("\nAirline-wise Records:")
print(df["Airline"].value_counts())


# 3. Number of unique routes
df["Route"] = df["From"] + "-" + df["To"]

print("\nUnique Routes:")
print(df["Route"].nunique())


# 4. Top 20 routes by number of observations
print("\nTop 20 Routes:")
print(df["Route"].value_counts().head(20))


# 5. Price statistics
print("\nPrice Statistics:")
print(df["Price"].describe())


# 6. Average fare by airline
print("\nAverage Fare by Airline:")
print(
    df.groupby("Airline")["Price"]
      .mean()
      .sort_values(ascending=False)
)


# 7. Number of journey dates
print("\nUnique Journey Dates:")
print(df["Date of Journey"].nunique())


# 8. Number of booking dates
print("\nUnique Booking Dates:")
print(df["Date of Booking"].nunique())
# ==========================================
# 16. JOURNEY DATE ANALYSIS
# ==========================================

print("\n===== JOURNEY DATE ANALYSIS =====")

print("\nMinimum Journey Date:")
print(df["Date of Journey"].min())

print("\nMaximum Journey Date:")
print(df["Date of Journey"].max())

print("\nJourney Date-wise Records:")
print(
    df["Date of Journey"]
      .value_counts()
      .sort_index()
)
# ==========================================
# 17. AIRFARE PRICE INDEX
# ==========================================

print("\n===== AIRFARE PRICE INDEX =====")

# ------------------------------------------
# Create Route
# ------------------------------------------

df["Route"] = df["From"] + "-" + df["To"]


# ------------------------------------------
# Define Base Period
# First 7 journey dates
# ------------------------------------------

journey_dates = sorted(df["Date of Journey"].unique())

base_dates = journey_dates[:7]

print("\nBase Period:")
print(base_dates[0], "to", base_dates[-1])


# ------------------------------------------
# Calculate Base Route Prices
# ------------------------------------------

base_data = df[
    df["Date of Journey"].isin(base_dates)
]

base_route_price = (
    base_data
    .groupby("Route")["Price"]
    .mean()
)


# ------------------------------------------
# Calculate Route-wise Daily Average Fare
# ------------------------------------------

daily_route_price = (
    df
    .groupby(
        ["Date of Journey", "Route"]
    )["Price"]
    .mean()
    .reset_index()
)


# ------------------------------------------
# Calculate Route Index
# ------------------------------------------

daily_route_price["Route Base Price"] = (
    daily_route_price["Route"]
    .map(base_route_price)
)


daily_route_price["Route Index"] = (
    daily_route_price["Price"]
    / daily_route_price["Route Base Price"]
    * 100
)


# ------------------------------------------
# Remove routes without base price
# ------------------------------------------

daily_route_price = daily_route_price.dropna(
    subset=["Route Base Price"]
)


# ------------------------------------------
# Display Route Index
# ------------------------------------------

print("\nSample Route-wise Index:")

print(
    daily_route_price[
        [
            "Date of Journey",
            "Route",
            "Price",
            "Route Base Price",
            "Route Index"
        ]
    ].head(20)
)
# ==========================================
# 18. OVERALL AIRFARE PRICE INDEX
# ==========================================

print("\n===== OVERALL AIRFARE PRICE INDEX =====")


# ------------------------------------------
# Calculate base-period observations
# for each route
# ------------------------------------------

base_route_count = (
    base_data
    .groupby("Route")
    .size()
)


# ------------------------------------------
# Calculate fixed route weights
# ------------------------------------------

route_weights = (
    base_route_count
    / base_route_count.sum()
)


# ------------------------------------------
# Add route weights
# ------------------------------------------

daily_route_price["Weight"] = (
    daily_route_price["Route"]
    .map(route_weights)
)


# ------------------------------------------
# Remove routes without valid weights
# ------------------------------------------

daily_route_price = daily_route_price.dropna(
    subset=["Weight", "Route Index"]
)


# ------------------------------------------
# Calculate weighted index
# ------------------------------------------

daily_route_price["Weighted Index"] = (
    daily_route_price["Route Index"]
    * daily_route_price["Weight"]
)


# ------------------------------------------
# Calculate overall index
# ------------------------------------------

overall_index = (
    daily_route_price
    .groupby("Date of Journey")
    .agg(
        Weighted_Sum=("Weighted Index", "sum"),
        Available_Weight=("Weight", "sum")
    )
    .reset_index()
)


# ------------------------------------------
# Normalize available weights
# ------------------------------------------

overall_index["Airfare Price Index"] = (
    overall_index["Weighted_Sum"]
    / overall_index["Available_Weight"]
)


# ------------------------------------------
# Display result
# ------------------------------------------

print("\nOverall Airfare Price Index:")

print(
    overall_index[
        [
            "Date of Journey",
            "Airfare Price Index"
        ]
    ].head(20)
)
# ------------------------------------------
# Normalize index to Base = 100
# ------------------------------------------

base_period_mask = (
    overall_index["Date of Journey"].isin(base_dates)
)

base_period_average = (
    overall_index.loc[
        base_period_mask,
        "Airfare Price Index"
    ].mean()
)

overall_index["Airfare Price Index"] = (
    overall_index["Airfare Price Index"]
    / base_period_average
    * 100
)

print("\nBase Period Average:")
print(base_period_average)

print("\nNormalized Airfare Price Index:")

print(
    overall_index[
        [
            "Date of Journey",
            "Airfare Price Index"
        ]
    ].head(20)
)


# ------------------------------------------
# Save index data
# ------------------------------------------

overall_index[
    [
        "Date of Journey",
        "Airfare Price Index"
    ]
].to_csv(
    "data/airfare_index.csv",
    index=False
)


print("\nAirfare index saved successfully!")
# ==========================================
# 19. AIRFARE INDEX TREND GRAPH
# ==========================================

import matplotlib.pyplot as plt


print("\n===== AIRFARE INDEX GRAPH =====")


plt.figure(figsize=(12, 6))

plt.plot(
    overall_index["Date of Journey"],
    overall_index["Airfare Price Index"],
    marker="o"
)

plt.axhline(
    y=100,
    linestyle="--"
)

plt.xlabel("Journey Date")
plt.ylabel("Airfare Price Index")

plt.title(
    "India Airfare Price Index Trend"
)

plt.xticks(rotation=45)

plt.tight_layout()


# ------------------------------------------
# Save graph
# ------------------------------------------

plt.savefig(
    "data/airfare_index_trend.png"
)

plt.show()


print("Airfare index graph saved successfully!")