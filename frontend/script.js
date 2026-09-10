/* =========================================
   AIRFARE PROJECT - FRONTEND JAVASCRIPT
========================================= */
const API_BASE_URL = "https://airfair-project.onrender.com";

/* =========================================
   MOCK DATA

   Later this will come from BACKEND API.
========================================= */

const airfareData = [

    {
        airline: "IndiGo",
        route: "DEL → BOM",
        fare: 4215,
        source: "MakeMyTrip",
        captured: "10:20 PM"
    },

    {
        airline: "Air India",
        route: "DEL → BOM",
        fare: 4890,
        source: "Yatra",
        captured: "10:18 PM"
    },

    {
        airline: "SpiceJet",
        route: "DEL → BOM",
        fare: 4150,
        source: "EaseMyTrip",
        captured: "10:17 PM"
    },

    {
        airline: "Akasa Air",
        route: "DEL → BOM",
        fare: 4599,
        source: "Cleartrip",
        captured: "10:16 PM"
    },

    {
        airline: "Vistara",
        route: "DEL → BOM",
        fare: 5230,
        source: "Goibibo",
        captured: "10:15 PM"
    }

];


/* =========================================
   DOM ELEMENTS
========================================= */

const fareTable =
    document.getElementById("fareTable");

const fromCity =
    document.getElementById("fromCity");

const toCity =
    document.getElementById("toCity");

const journeyDate =
    document.getElementById("journeyDate");

const flightClass =
    document.getElementById("flightClass");

const searchBtn =
    document.getElementById("searchBtn");

const swapBtn =
    document.getElementById("swapBtn");

const routeTitle =
    document.getElementById("routeTitle");

const lastUpdated =
    document.getElementById("lastUpdated");


/* =========================================
   DISPLAY TABLE
========================================= */

function displayFareTable(data) {

    fareTable.innerHTML = "";


    data.forEach(flight => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td class="airline-name">
                ${flight.airline}
            </td>

            <td>
                ${flight.route}
            </td>

            <td class="fare">
                ₹${flight.fare.toLocaleString("en-IN")}
            </td>

            <td class="source">
                ${flight.source}
            </td>

            <td>
                ${flight.captured}
            </td>

        `;


        fareTable.appendChild(row);

    });

}

async function loadFares() {

    try {

       const response = await fetch(
          `${API_BASE_URL}/api/fares`
        );

        const data = await response.json();

        console.log("Fare data received from backend:", data);

        displayFareTable(data);

    } catch (error) {

        console.error(
            "Error loading airfare data:",
            error
        );

    }
}


/* =========================================
   INITIAL TABLE
========================================= */


/* =========================================
   SEARCH FARES - BACKEND
========================================= */

searchBtn.addEventListener(
    "click",
    async function () {

        const from =
            fromCity.options[
                fromCity.selectedIndex
            ].text;

        const to =
            toCity.options[
                toCity.selectedIndex
            ].text;

        const fromCode =
            fromCity.value;

        const toCode =
            toCity.value;


        /* Prevent same city */

        if (fromCode === toCode) {

            alert(
                "Departure and destination cannot be the same."
            );

            return;
        }


        /* Update route title */

        routeTitle.textContent =
            `${from} → ${to}`;


        try {

            /* Call backend API */

const response = await fetch(
    `${API_BASE_URL}/api/fares/search?from=${fromCode}&to=${toCode}`
);

            const data =
                await response.json();


            console.log(
                "Search results received:",
                data
            );


            /* Display results */

            displayFareTable(data);


            /* Update timestamp */

            updateTimestamp();


        } catch (error) {

            console.error(
                "Error searching fares:",
                error
            );

            alert(
                "Unable to fetch airfare data."
            );

        }

    }
);



/* =========================================
   SWAP CITIES
========================================= */

swapBtn.addEventListener(
    "click",
    function () {

        const temp =
            fromCity.value;

        fromCity.value =
            toCity.value;

        toCity.value =
            temp;

    }
);


/* =========================================
   UPDATE TIME
========================================= */

function updateTimestamp() {

    const now =
        new Date();


    const options = {

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit"

    };


    lastUpdated.textContent =
        now.toLocaleString(
            "en-IN",
            options
        );

}


document
    .getElementById("refreshBtn")
    .addEventListener(
        "click",
        async function () {

            try {

                // Show refresh animation
                this.style.transform =
                    "rotate(360deg)";

                // Reload latest airfare data
                await loadFares();

                // Update timestamp
                updateTimestamp();

            } catch (error) {

                console.error(
                    "Refresh failed:",
                    error
                );

            } finally {

                // Reset animation
                setTimeout(
                    () => {

                        this.style.transform =
                            "rotate(0deg)";

                    },
                    500
                );

            }

        }
    );

/* =========================================
   NAVIGATION
========================================= */

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );

const pages =
    document.querySelectorAll(
        ".page"
    );


navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            function () {

                const pageId =
                    this.dataset.page;


                /* Remove active nav */

                navItems.forEach(
                    nav => {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                /* Add active nav */

                this.classList.add(
                    "active"
                );


                /* Hide pages */

                pages.forEach(
                    page => {

                        page.classList.remove(
                            "active-page"
                        );

                    }
                );


                /* Show selected page */

                const selectedPage =
                    document.getElementById(
                        pageId
                    );


                if (selectedPage) {

                    selectedPage.classList.add(
                        "active-page"
                    );

                }

            }
        );

    }
);


/* =========================================
   DASHBOARD NAVIGATION
========================================= */

function goToDashboard() {

    pages.forEach(
        page => {

            page.classList.remove(
                "active-page"
            );

        }
    );


    document
        .getElementById("dashboard")
        .classList.add(
            "active-page"
        );


    navItems.forEach(
        nav => {

            nav.classList.remove(
                "active"
            );

        }
    );


    document
        .querySelector(
            '[data-page="dashboard"]'
        )
        .classList.add(
            "active"
        );

}



// =========================================
// REAL AIRFARE PRICE TREND CHART
// =========================================

async function drawPriceChart() {

    const canvas =
        document.getElementById("priceChart");

    const ctx =
        canvas.getContext("2d");

    try {

        // Get real daily fare data
        const response = await fetch(
    `${API_BASE_URL}/api/fares/trend`
);

        const trendData =
            await response.json();

        console.log(
            "Fare trend received:",
            trendData
        );

        // Extract prices
        const prices = trendData.map(
            item => Number(
                item["Average Fare"]
            )
        );

        // Extract dates
        const dates = trendData.map(
            item => item["Date of Journey"]
        );

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        const padding = 45;

        // Find min and max
        const max =
            Math.max(...prices) + 500;

        const min =
            Math.min(...prices) - 500;

        // =====================================
        // GRID
        // =====================================

        ctx.strokeStyle = "#e7edf4";
        ctx.lineWidth = 1;

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const y =
                padding +
                i *
                (
                    (height -
                        padding * 2) / 4
                );

            ctx.beginPath();

            ctx.moveTo(
                padding,
                y
            );

            ctx.lineTo(
                width - padding,
                y
            );

            ctx.stroke();
        }

        // =====================================
        // LINE
        // =====================================

        ctx.beginPath();

        prices.forEach(
            (price, index) => {

                const x =
                    padding +
                    index *
                    (
                        (width -
                            padding * 2)
                        /
                        (prices.length - 1)
                    );

                const y =
                    height -
                    padding -
                    (
                        (price - min)
                        /
                        (max - min)
                    )
                    *
                    (
                        height -
                        padding * 2
                    );

                if (index === 0) {

                    ctx.moveTo(
                        x,
                        y
                    );

                } else {

                    ctx.lineTo(
                        x,
                        y
                    );
                }

            }
        );

        ctx.strokeStyle = "#1677ff";
        ctx.lineWidth = 3;

        ctx.stroke();

        // =====================================
        // POINTS
        // =====================================

        prices.forEach(
            (price, index) => {

                const x =
                    padding +
                    index *
                    (
                        (width -
                            padding * 2)
                        /
                        (prices.length - 1)
                    );

                const y =
                    height -
                    padding -
                    (
                        (price - min)
                        /
                        (max - min)
                    )
                    *
                    (
                        height -
                        padding * 2
                    );

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    3,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = "#ffffff";

                ctx.fill();

                ctx.strokeStyle = "#1677ff";

                ctx.lineWidth = 2;

                ctx.stroke();
            }
        );

        // =====================================
        // DATE LABELS
        // =====================================

        ctx.fillStyle = "#718096";

        ctx.font = "10px Arial";

        ctx.textAlign = "center";

        // Show around 8 labels
        const labelStep =
            Math.ceil(
                dates.length / 8
            );

        dates.forEach(
            (date, index) => {

                if (
                    index % labelStep !== 0 &&
                    index !== dates.length - 1
                ) {
                    return;
                }

                const x =
                    padding +
                    index *
                    (
                        (width -
                            padding * 2)
                        /
                        (prices.length - 1)
                    );

                const formattedDate =
                    new Date(date)
                        .toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short"
                            }
                        );

                ctx.fillText(
                    formattedDate,
                    x,
                    height - 15
                );
            }
        );

        console.log(
            "Fare trend chart updated successfully."
        );

    } catch (error) {

        console.error(
            "Error loading fare trend:",
            error
        );
    }
}


// =========================================
// LOAD FARE TREND CHART
// =========================================



/* =========================================
   INDEX HISTORY CHART
========================================= */

async function drawIndexChart() {

    const canvas =
        document.getElementById("indexChart");

    const ctx =
        canvas.getContext("2d");

    try {

        // Get real index history from backend
        const response = await fetch(
            `${API_BASE_URL}/api/index/history`
        );

        const history = await response.json();

        console.log(
            "Index history received:",
            history
        );

        // Extract index values
        const values = history.map(
            item => Number(
                item["Airfare Price Index"]
            )
        );

        // Extract dates
        const dates = history.map(
            item => item["Date of Journey"]
        );

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        const padding = 40;

        // Find min and max
        const max =
            Math.max(...values) + 5;

        const min =
            Math.min(...values) - 5;

        /* =====================================
           GRID
        ===================================== */

        ctx.strokeStyle = "#e7edf4";
        ctx.lineWidth = 1;

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const y =
                padding +
                i *
                (
                    (height -
                        padding * 2) / 4
                );

            ctx.beginPath();

            ctx.moveTo(
                padding,
                y
            );

            ctx.lineTo(
                width - padding,
                y
            );

            ctx.stroke();
        }

        /* =====================================
           INDEX LINE
        ===================================== */

        ctx.beginPath();

        values.forEach(
            (value, index) => {

                const x =
                    padding +
                    index *
                    (
                        (width -
                            padding * 2)
                        /
                        (values.length - 1)
                    );

                const y =
                    height -
                    padding -
                    (
                        (value - min)
                        /
                        (max - min)
                    )
                    *
                    (
                        height -
                        padding * 2
                    );

                if (index === 0) {

                    ctx.moveTo(
                        x,
                        y
                    );

                } else {

                    ctx.lineTo(
                        x,
                        y
                    );
                }
            }
        );

        ctx.strokeStyle = "#1677ff";
        ctx.lineWidth = 2.5;

        ctx.stroke();

        /* =====================================
           POINTS
        ===================================== */

        values.forEach(
            (value, index) => {

                const x =
                    padding +
                    index *
                    (
                        (width -
                            padding * 2)
                        /
                        (values.length - 1)
                    );

                const y =
                    height -
                    padding -
                    (
                        (value - min)
                        /
                        (max - min)
                    )
                    *
                    (
                        height -
                        padding * 2
                    );

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    3,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = "#ffffff";

                ctx.fill();

                ctx.strokeStyle = "#1677ff";

                ctx.lineWidth = 2;

                ctx.stroke();
            }
        );

        /* =====================================
           DATE LABELS
        ===================================== */

        ctx.fillStyle = "#718096";

        ctx.font = "10px Arial";

        ctx.textAlign = "center";

        const labelStep =
            Math.ceil(
                dates.length / 8
            );

        dates.forEach(
            (date, index) => {

                if (
                    index % labelStep !== 0 &&
                    index !== dates.length - 1
                ) {
                    return;
                }

                const x =
                    padding +
                    index *
                    (
                        (width -
                            padding * 2)
                        /
                        (values.length - 1)
                    );

                const formattedDate =
                    new Date(date)
                        .toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short"
                            }
                        );

                ctx.fillText(
                    formattedDate,
                    x,
                    height - 15
                );
            }
        );

        console.log(
            "Index chart updated successfully."
        );

    } catch (error) {

        console.error(
            "Error loading index history:",
            error
        );
    }
}


/* =========================================
   LOAD INDEX CHART
========================================= */



/* =========================================
   ROUTE COMPARISON - BACKEND DATA
========================================= */

async function loadRouteComparison() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/routes`
        );

        const routes = await response.json();

        console.log("Route data received:", routes);

        const routeComparison =
            document.getElementById("routeComparison");

        routeComparison.innerHTML = "";

        routes.forEach(route => {

            const div =
                document.createElement("div");

            div.className = "route-row";

            div.innerHTML = `
                <span>
                    ${route.Route}
                </span>

                <strong>
                    ₹${Number(route["Average Fare"])
                        .toLocaleString("en-IN")}
                </strong>
            `;

            routeComparison.appendChild(div);

        });

    } catch (error) {

        console.error(
            "Error loading route comparison:",
            error
        );

    }

}


/* =========================================
   CSV DOWNLOAD
========================================= */
/* =========================================
   CSV DOWNLOAD - BACKEND DATA
========================================= */

async function downloadCSV() {

    try {

        // Get actual airfare data from backend
        const response = await fetch(
            `${API_BASE_URL}/api/fares`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch airfare data");
        }

        const data = await response.json();

        console.log("CSV data received:", data);

        if (data.length === 0) {
            alert("No airfare data available.");
            return;
        }

        // CSV header
        const headers = [
            "Airline",
            "Route",
            "Fare",
            "Source",
            "Captured"
        ];

        let csv = headers.join(",") + "\n";

        // Convert backend data to CSV
        data.forEach(flight => {

            csv +=
                `"${flight.airline || ""}",` +
                `"${flight.route || ""}",` +
                `"${flight.fare || ""}",` +
                `"${flight.source || ""}",` +
                `"${flight.captured || ""}"\n`;

        });

        // Create CSV file
        const blob = new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        // Create download URL
        const url = URL.createObjectURL(blob);

        // Create temporary link
        const link = document.createElement("a");

        link.href = url;
        link.download = "airfare-data.csv";

        // Start download
        link.click();

        // Clean URL
        URL.revokeObjectURL(url);

        console.log(
            "CSV downloaded successfully."
        );

    } catch (error) {

        console.error(
            "Error downloading CSV:",
            error
        );

        alert(
            "Unable to download airfare data."
        );
    }
}


document
    .getElementById(
        "downloadBtn"
    )
    .addEventListener(
        "click",
        downloadCSV
    );


document
    .getElementById(
        "reportBtn"
    )
    .addEventListener(
        "click",
        downloadCSV
    );


/* =========================================
   VIEW ALL - PAGINATION
========================================= */

let allAirfareData = [];
let currentPage = 1;

const rowsPerPage = 100;


/* -----------------------------------------
   DISPLAY PAGINATED DATA
----------------------------------------- */

function displayPaginatedFares() {

    const startIndex =
        (currentPage - 1) * rowsPerPage;

    const endIndex =
        startIndex + rowsPerPage;

    const pageData =
        allAirfareData.slice(
            startIndex,
            endIndex
        );

    // Display only current page
    displayFareTable(pageData);

    // Update route title
    routeTitle.textContent =
        "All India Airfare Data";

    // Create / update pagination
    createPagination();
}


/* -----------------------------------------
   CREATE PAGINATION
----------------------------------------- */

function createPagination() {

    const totalRecords =
        allAirfareData.length;

    const totalPages =
        Math.ceil(
            totalRecords / rowsPerPage
        );

    // Find table
    const table =
        fareTable.closest("table");

    if (!table) {
        console.error(
            "Fare table not found."
        );
        return;
    }

    // Remove old pagination
    const oldPagination =
        document.getElementById(
            "farePagination"
        );

    if (oldPagination) {
        oldPagination.remove();
    }


    // Pagination container
    const pagination =
        document.createElement("div");

    pagination.id =
        "farePagination";

    pagination.style.display =
        "flex";

    pagination.style.justifyContent =
        "space-between";

    pagination.style.alignItems =
        "center";

    pagination.style.marginTop =
        "20px";

    pagination.style.padding =
        "10px 5px";


    // Record information
    const info =
        document.createElement("span");

    const startRecord =
        (currentPage - 1) *
        rowsPerPage + 1;

    const endRecord =
        Math.min(
            currentPage * rowsPerPage,
            totalRecords
        );

    info.textContent =
        `Showing ${startRecord}-${endRecord} of ${totalRecords.toLocaleString("en-IN")} records`;

    info.style.fontSize =
        "13px";

    info.style.color =
        "#718096";


    // Button container
    const buttons =
        document.createElement("div");

    buttons.style.display =
        "flex";

    buttons.style.gap =
        "6px";


    // Previous button
    const previousBtn =
        document.createElement("button");

    previousBtn.textContent =
        "← Previous";

    previousBtn.disabled =
        currentPage === 1;

    previousBtn.style.padding =
        "7px 12px";

    previousBtn.style.cursor =
        currentPage === 1
            ? "not-allowed"
            : "pointer";


    previousBtn.addEventListener(
        "click",
        function () {

            if (currentPage > 1) {

                currentPage--;

                displayPaginatedFares();
            }

        }
    );


    // Page number
    const pageNumber =
        document.createElement("span");

    pageNumber.textContent =
        `Page ${currentPage} of ${totalPages}`;

    pageNumber.style.padding =
        "7px 12px";

    pageNumber.style.fontSize =
        "13px";

    pageNumber.style.fontWeight =
        "600";


    // Next button
    const nextBtn =
        document.createElement("button");

    nextBtn.textContent =
        "Next →";

    nextBtn.disabled =
        currentPage === totalPages;

    nextBtn.style.padding =
        "7px 12px";

    nextBtn.style.cursor =
        currentPage === totalPages
            ? "not-allowed"
            : "pointer";


    nextBtn.addEventListener(
        "click",
        function () {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                displayPaginatedFares();
            }

        }
    );


    // Add buttons
    buttons.appendChild(
        previousBtn
    );

    buttons.appendChild(
        pageNumber
    );

    buttons.appendChild(
        nextBtn
    );


    // Add everything
    pagination.appendChild(
        info
    );

    pagination.appendChild(
        buttons
    );


    // Put pagination below table
    table.insertAdjacentElement(
        "afterend",
        pagination
    );
}


/* -----------------------------------------
   VIEW ALL BUTTON
----------------------------------------- */

document
    .getElementById("viewAllBtn")
    .addEventListener(
        "click",
        async function () {

            try {

                // Show loading message
                this.textContent =
                    "Loading...";

                // Get all airfare data
                const response =
                    await fetch(
                        `${API_BASE_URL}/api/fares/all`
                    );

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch airfare data"
                    );
                }

                allAirfareData =
                    await response.json();

                console.log(
                    "All airfare data:",
                    allAirfareData
                );


                if (
                    allAirfareData.length === 0
                ) {

                    alert(
                        "No airfare data available."
                    );

                    return;
                }


                // Start from page 1
                currentPage = 1;


                // Display first 100 records
                displayPaginatedFares();


                // Update timestamp
                updateTimestamp();


            } catch (error) {

                console.error(
                    "Error loading all fares:",
                    error
                );

                alert(
                    "Unable to load airfare data."
                );

            } finally {

                this.textContent =
                    "View All →";
            }

        }
    );


/* =========================================
   INITIAL DATE
========================================= */

function setDefaultDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    journeyDate.value =
        `${year}-${month}-${day}`;

}


setDefaultDate();
// ==========================================
// LOAD AIRFARE PRICE INDEX FROM BACKEND
// ==========================================

async function loadAirfareIndex() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/index`
        );

        const data = await response.json();

        console.log(
            "Airfare Index received:",
            data
        );


        // ==========================================
        // AIRFARE PRICE INDEX
        // ==========================================

        const overallIndex =
            document.getElementById("overallIndex");

        if (overallIndex) {

            overallIndex.textContent =
                data.overall;

        }
        // ==========================================
// OVERALL INDEX CHANGE
// ==========================================

const overallChange =
    document.getElementById(
        "overallIndexChange"
    );

if (overallChange) {

    const arrow =
        data.change >= 0
            ? "▲"
            : "▼";

    overallChange.innerHTML =
        `${arrow} ${Math.abs(data.change)}% 
        <span>vs previous day</span>`;

    overallChange.classList.remove(
        "positive",
        "negative"
    );

    overallChange.classList.add(
        data.change >= 0
            ? "positive"
            : "negative"
    );

}


        // ==========================================
        // DOMESTIC INDEX
        // ==========================================

        const domesticIndex =
            document.getElementById("domesticIndex");

        if (domesticIndex) {

            domesticIndex.textContent =
                data.overall;

        }


        // ==========================================
        // DOMESTIC INDEX CHANGE
        // ==========================================

        const domesticChange =
            document.getElementById(
                "domesticIndexChange"
            );

        if (domesticChange) {

            const arrow =
                data.change >= 0
                    ? "▲"
                    : "▼";

            domesticChange.textContent =
                `${arrow} ${Math.abs(data.change)}% vs previous day`;


            // Remove old class
            domesticChange.classList.remove(
                "positive",
                "negative"
            );


            // Add correct class
            domesticChange.classList.add(
                data.change >= 0
                    ? "positive"
                    : "negative"
            );

        }

    } catch (error) {

        console.error(
            "Error loading Airfare Index:",
            error
        );

    }

}


// ==========================================
// PRICE INDEX PAGE
// ==========================================

async function loadPriceIndexPage() {

    try {

        // Get current index
        const indexResponse = await fetch(
            `${API_BASE_URL}/api/index`
        );

        const indexData = await indexResponse.json();

        console.log(
            "Price Index Page Data:",
            indexData
        );

        // ------------------------------
        // CURRENT INDEX
        // ------------------------------

        const indexValue =
            document.getElementById(
                "priceIndexValue"
            );

        if (indexValue) {

            indexValue.textContent =
                indexData.overall;
        }


        // ------------------------------
        // INDEX CHANGE
        // ------------------------------

        const indexChange =
            document.getElementById(
                "priceIndexChange"
            );

        if (indexChange) {

            const arrow =
                indexData.change >= 0
                    ? "▲"
                    : "▼";

            indexChange.textContent =
                `${arrow} ${Math.abs(indexData.change)}% vs previous day`;

            indexChange.classList.remove(
                "positive",
                "negative"
            );

            indexChange.classList.add(
                indexData.change >= 0
                    ? "positive"
                    : "negative"
            );
        }


        // ------------------------------
        // INDEX HISTORY
        // ------------------------------

        const historyResponse = await fetch(
            `${API_BASE_URL}/api/index/history`
        );

        const historyData =
            await historyResponse.json();

        console.log(
            "Index History:",
            historyData
        );

        drawPriceIndexPageChart(
            historyData
        );

    }

    catch (error) {

        console.error(
            "Error loading Price Index page:",
            error
        );
    }
}
function drawPriceIndexPageChart(data) {

    const canvas =
        document.getElementById(
            "priceIndexPageChart"
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    const width =
        canvas.width;

    const height =
        canvas.height;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------
    // PREPARE DATA
    // --------------------------------

    const values =
        data.map(item =>
            Number(
                item["Airfare Price Index"]
            )
        );

    const labels =
        data.map(item =>
            item["Date of Journey"]
        );


    if (!values.length) {

        ctx.font = "16px Arial";

        ctx.fillText(
            "No index data available",
            20,
            40
        );

        return;
    }


    // --------------------------------
    // GRAPH SETTINGS
    // --------------------------------

    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 45;

    const chartWidth =
        width -
        paddingLeft -
        paddingRight;

    const chartHeight =
        height -
        paddingTop -
        paddingBottom;


    const minValue =
        Math.min(...values);

    const maxValue =
        Math.max(...values);

    const range =
        maxValue - minValue || 1;


    // --------------------------------
    // GRID
    // --------------------------------

    ctx.strokeStyle = "#e5e7eb";

    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {

        const y =
            paddingTop +
            (chartHeight / 5) * i;

        ctx.beginPath();

        ctx.moveTo(
            paddingLeft,
            y
        );

        ctx.lineTo(
            width - paddingRight,
            y
        );

        ctx.stroke();


        const value =
            maxValue -
            (range / 5) * i;

        ctx.fillStyle = "#6b7280";

        ctx.font = "12px Arial";

        ctx.fillText(
            value.toFixed(1),
            10,
            y + 4
        );
    }


    // --------------------------------
    // LINE
    // --------------------------------

    ctx.beginPath();

    values.forEach(
        (value, index) => {

            const x =
                paddingLeft +
                (index /
                    (values.length - 1 || 1)
                ) *
                chartWidth;

            const y =
                paddingTop +
                (
                    (maxValue - value) /
                    range
                ) *
                chartHeight;

            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );
            }
        }
    );

    ctx.strokeStyle = "#2563eb";

    ctx.lineWidth = 3;

    ctx.stroke();


    // --------------------------------
    // X-AXIS LABELS
    // --------------------------------

    ctx.fillStyle = "#6b7280";

    ctx.font = "11px Arial";

    const labelCount =
        Math.min(
            6,
            labels.length
        );

    for (
        let i = 0;
        i < labelCount;
        i++
    ) {

        const index =
            Math.floor(
                i *
                (labels.length - 1) /
                (labelCount - 1 || 1)
            );

        const x =
            paddingLeft +
            (index /
                (labels.length - 1 || 1)
            ) *
            chartWidth;

        ctx.fillText(
            labels[index],
            x - 25,
            height - 15
        );
    }
}
// ==========================================
// LOAD ROUTE COUNT FROM BACKEND
// ==========================================

async function loadRouteCount() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/analysis`
        );

        const data = await response.json();

        console.log(
            "Route count received:",
            data.total_routes
        );

        const routesElement =
            document.getElementById("routesTracked");

        if (routesElement) {

            routesElement.textContent =
                data.total_routes;

        }

    } catch (error) {

        console.error(
            "Error loading route count:",
            error
        );

    }
}
// ==========================================
// LIVE FARES
// ==========================================
async function loadLiveFares() {

    const liveFareBox =
        document.getElementById("liveFareBox");

    if (!liveFareBox) {
        console.error("Live fare box not found.");
        return;
    }

    try {

        liveFareBox.innerHTML = `
            <p>🔄 Loading fares...</p>
        `;

        const response = await fetch(
    `${API_BASE_URL}/api/live-fares?from=DEL&to=BOM`
);

        const result = await response.json();

        console.log("Fare result:", result);

        // =====================================
        // FALLBACK / LIVE MESSAGE
        // =====================================

        if (result.mode === "fallback") {

            liveFareBox.innerHTML = `
                <div style="
                    padding:15px;
                    margin-bottom:15px;
                    border-radius:10px;
                    background:#fff8e1;
                    border:1px solid #f6c343;
                ">
                    <strong>🟡 Demo / Cached Fare Data</strong>

                    <p style="margin:8px 0 0;">
                        Live API is temporarily unavailable.
                        Showing cached fares for demonstration.
                    </p>
                </div>
            `;

        } else {

            liveFareBox.innerHTML = `
                <div style="
                    padding:15px;
                    margin-bottom:15px;
                    border-radius:10px;
                    background:#e8f5e9;
                    border:1px solid #81c784;
                ">
                    <strong>🟢 Live Fare Data</strong>

                    <p style="margin:8px 0 0;">
                        Fare data received from live API.
                    </p>
                </div>
            `;
        }

        // =====================================
        // NO DATA
        // =====================================

        if (!result.data || result.data.length === 0) {

            liveFareBox.innerHTML += `
                <p>⚠️ No flights found.</p>
            `;

            return;
        }

        // =====================================
        // DISPLAY FLIGHTS
        // =====================================

        result.data.forEach(flight => {

            const fareCard =
                document.createElement("div");

            fareCard.style.cssText = `
                padding:15px;
                margin:10px 0;
                border:1px solid #e2e8f0;
                border-radius:10px;
                background:#ffffff;
            `;

            fareCard.innerHTML = `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                    <strong style="font-size:17px;">
                        ✈️ ${flight.airline}
                    </strong>

                    <strong style="font-size:18px;">
                        ${flight.fareFormatted ||
                        "₹" + Number(flight.fare)
                        .toLocaleString("en-IN")}
                    </strong>

                </div>

                <p style="margin:8px 0;">
                    <strong>
                        ${flight.flightNumber}
                    </strong>
                    &nbsp; | &nbsp;
                    ${flight.from} → ${flight.to}
                </p>

                <p style="margin:5px 0;">
                    🛫 Departure:
                    ${flight.departure || "N/A"}
                </p>

                <p style="margin:5px 0;">
                    🛬 Arrival:
                    ${flight.arrival || "N/A"}
                </p>

                <p style="margin:5px 0;">
                    ⏱ Duration:
                    ${flight.durationMinutes || "N/A"} minutes
                </p>

                <p style="margin:5px 0;">
                    🛑 Stops:
                    ${flight.stops ?? "N/A"}
                </p>

                <small style="color:#718096;">
                    Source: ${flight.source || "Fare API"}
                </small>

            `;

            liveFareBox.appendChild(fareCard);

        });

        console.log("Fares displayed successfully.");

    } catch (error) {

        console.error("Error loading fares:", error);

        liveFareBox.innerHTML = `
            <div style="
                padding:15px;
                border-radius:10px;
                background:#fff3f3;
                border:1px solid #ffcccc;
            ">
                <strong>🔴 Unable to load fares</strong>

                <p style="margin:8px 0 0;">
                    Please try again later.
                </p>

                <small>
                    Historical airfare data remains available.
                </small>
            </div>
        `;
    }
}


// ==========================================
// START DASHBOARD DATA
// ==========================================

async function initDashboard() {

    console.log("Starting dashboard data loading...");

    await loadFares();

    await drawPriceChart();

    await drawIndexChart();

    await loadRouteComparison();

    await loadAirfareIndex();

    await loadPriceIndexPage();

    await loadRouteCount();

    await loadLiveFares();

    console.log("Dashboard data loading completed.");

}

initDashboard();
