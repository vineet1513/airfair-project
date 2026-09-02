/* =========================================
   AIRFARE PROJECT - FRONTEND JAVASCRIPT
========================================= */


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


/* =========================================
   INITIAL TABLE
========================================= */

displayFareTable(airfareData);


/* =========================================
   SEARCH FARES
========================================= */

searchBtn.addEventListener(
    "click",
    function () {

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


        /*
            For now we use mock data.

            Later:

            fetch(
                `/api/fares?from=${fromCode}&to=${toCode}`
            )
        */


        const filteredData =
            airfareData.map(
                flight => {

                    return {
                        ...flight,

                        route:
                            `${fromCode} → ${toCode}`
                    };

                }
            );


        displayFareTable(filteredData);


        /* Update timestamp */

        updateTimestamp();


        alert(
            `Searching fares for ${from} → ${to}`
        );

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
        function () {

            updateTimestamp();

            this.style.transform =
                "rotate(360deg)";

            setTimeout(
                () => {

                    this.style.transform =
                        "rotate(0deg)";

                },
                500
            );

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


/* =========================================
   PRICE TREND CHART
========================================= */

function drawPriceChart() {

    const canvas =
        document.getElementById(
            "priceChart"
        );

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


    const prices = [

        4100,
        4350,
        4200,
        4650,
        4800,
        5100,
        4950,
        5350,
        5500

    ];


    const labels = [

        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug"

    ];


    const padding = 45;


    const max =
        Math.max(...prices) + 300;

    const min =
        Math.min(...prices) - 300;


    /* Grid */

    ctx.strokeStyle =
        "#e7edf4";

    ctx.lineWidth = 1;


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const y =
            padding +
            i *
            ((height -
                padding * 2) / 4);


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


    /* Line */

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


    ctx.strokeStyle =
        "#1677ff";

    ctx.lineWidth = 3;

    ctx.stroke();


    /* Points */

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
                4,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#ffffff";

            ctx.fill();


            ctx.strokeStyle =
                "#1677ff";

            ctx.lineWidth = 2;

            ctx.stroke();


            /* Labels */

            ctx.fillStyle =
                "#718096";

            ctx.font =
                "11px Arial";

            ctx.textAlign =
                "center";


            ctx.fillText(
                labels[index],
                x,
                height - 15
            );

        }
    );

}


drawPriceChart();


/* =========================================
   INDEX COMPARISON CHART
========================================= */

function drawIndexChart() {

    const canvas =
        document.getElementById(
            "indexChart"
        );

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


    const data = {

        overall: [
            91,
            95,
            94,
            98,
            99,
            106,
            105,
            110
        ],

        domestic: [
            78,
            81,
            80,
            83,
            85,
            90,
            90,
            94
        ],

        international: [
            99,
            104,
            102,
            108,
            112,
            120,
            119,
            128
        ]

    };


    const padding = 40;


    function drawLine(
        values,
        lineColor
    ) {

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
                        (value - 70)
                        /
                        65
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


        ctx.strokeStyle =
            lineColor;

        ctx.lineWidth = 2.5;

        ctx.stroke();

    }


    /* Grid */

    ctx.strokeStyle =
        "#e7edf4";

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
                    padding * 2)
                / 4
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


    drawLine(
        data.overall,
        "#1677ff"
    );

    drawLine(
        data.domestic,
        "#13a66a"
    );

    drawLine(
        data.international,
        "#8d54e9"
    );

}


drawIndexChart();


/* =========================================
   ROUTE COMPARISON
========================================= */

const routes = [

    {
        route: "Delhi → Mumbai",
        price: 4215
    },

    {
        route: "Delhi → Bengaluru",
        price: 3890
    },

    {
        route: "Delhi → Kolkata",
        price: 3520
    },

    {
        route: "Mumbai → Bengaluru",
        price: 3680
    },

    {
        route: "Delhi → Chennai",
        price: 4670
    },

    {
        route: "Mumbai → Kolkata",
        price: 4980
    }

];


const routeComparison =
    document.getElementById(
        "routeComparison"
    );


routes.forEach(
    route => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "route-row";


        div.innerHTML = `

            <span>
                ${route.route}
            </span>

            <strong>
                ₹${route.price.toLocaleString("en-IN")}
            </strong>

        `;


        routeComparison.appendChild(
            div
        );

    }
);


/* =========================================
   CSV DOWNLOAD
========================================= */

function downloadCSV() {

    let csv =
        "Airline,Route,Fare,Source,Captured\n";


    airfareData.forEach(
        flight => {

            csv +=
                `${flight.airline},` +
                `${flight.route},` +
                `${flight.fare},` +
                `${flight.source},` +
                `${flight.captured}\n`;

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "airfare-data.csv";


    link.click();


    URL.revokeObjectURL(
        url
    );

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
   VIEW ALL
========================================= */

document
    .getElementById(
        "viewAllBtn"
    )
    .addEventListener(
        "click",
        function () {

            alert(
                "Full airfare database will be displayed here."
            );

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