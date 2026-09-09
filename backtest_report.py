import pandas as pd
import numpy as np
from pathlib import Path

INPUT = Path("data/backtest_30days.csv")
OUTPUT = Path("data/backtest_report.csv")

df = pd.read_csv(INPUT)

df["Date of Journey"] = pd.to_datetime(df["Date of Journey"])
df["Airfare Price Index"] = pd.to_numeric(
    df["Airfare Price Index"], errors="coerce"
)

df = df.dropna(subset=["Date of Journey", "Airfare Price Index"])
df = df.sort_values("Date of Journey").reset_index(drop=True)

index = df["Airfare Price Index"]

# Daily change
df["Daily Change %"] = index.pct_change() * 100

# 30-day statistics
start_index = index.iloc[0]
end_index = index.iloc[-1]

mean_index = index.mean()
min_index = index.min()
max_index = index.max()

overall_change = ((end_index / start_index) - 1) * 100

# Volatility
daily_volatility = df["Daily Change %"].std()

# Highest and lowest index dates
max_row = df.loc[df["Airfare Price Index"].idxmax()]
min_row = df.loc[df["Airfare Price Index"].idxmin()]

print("\n========== 30-DAY AIRFARE INDEX BACKTEST ==========\n")

print("Number of observations :", len(df))
print("Start date             :", df["Date of Journey"].min().date())
print("End date               :", df["Date of Journey"].max().date())

print("\n--- Index Statistics ---")
print("Starting Index         :", round(start_index, 2))
print("Ending Index           :", round(end_index, 2))
print("Mean Index             :", round(mean_index, 2))
print("Minimum Index          :", round(min_index, 2))
print("Maximum Index          :", round(max_index, 2))
print("30-Day Change          :", round(overall_change, 2), "%")
print("Daily Volatility       :", round(daily_volatility, 2), "%")

print("\n--- Extreme Values ---")
print(
    "Highest Index          :",
    round(max_row["Airfare Price Index"], 2),
    "on",
    max_row["Date of Journey"].date()
)

print(
    "Lowest Index           :",
    round(min_row["Airfare Price Index"], 2),
    "on",
    min_row["Date of Journey"].date()
)

# Save detailed report
df.to_csv(OUTPUT, index=False)

print("\nReport saved to:", OUTPUT)
print("\n====================================================\n")
