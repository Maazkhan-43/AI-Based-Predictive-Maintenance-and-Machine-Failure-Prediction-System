// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL =
    "https://ai-based-predictive-maintenance-and.onrender.com/predict";


// ============================================================
// DOM ELEMENTS
// ============================================================

const form = document.getElementById("predictionForm");
const predictButton = document.getElementById("predictButton");

const productType = document.getElementById("productType");
const airTemperature = document.getElementById("airTemperature");
const processTemperature = document.getElementById("processTemperature");
const rotationalSpeed = document.getElementById("rotationalSpeed");
const torque = document.getElementById("torque");
const toolWear = document.getElementById("toolWear");

const emptyState = document.getElementById("emptyState");
const loading = document.getElementById("loading");
const predictionResult = document.getElementById("predictionResult");

const riskIndicator = document.getElementById("riskIndicator");
const probability = document.getElementById("probability");
const probabilityText = document.getElementById("probabilityText");
const probabilityBar = document.getElementById("probabilityBar");

const machineStatus = document.getElementById("machineStatus");
const temperatureDifference =
    document.getElementById("temperatureDifference");
const mechanicalPower =
    document.getElementById("mechanicalPower");
const recommendation =
    document.getElementById("recommendation");

const historyEmpty =
    document.getElementById("historyEmpty");
const historyBody =
    document.getElementById("historyBody");
const clearHistoryButton =
    document.getElementById("clearHistoryButton");


// ============================================================
// UI STATE
// ============================================================

function showEmptyState() {

    emptyState.classList.remove("hidden");

    loading.classList.add("hidden");

    predictionResult.classList.add("hidden");

}


function showLoadingState() {

    emptyState.classList.add("hidden");

    loading.classList.remove("hidden");

    predictionResult.classList.add("hidden");

    predictButton.disabled = true;

    const buttonText =
        predictButton.querySelector("span:first-child");

    if (buttonText) {

        buttonText.textContent =
            "Analyzing Machine";

    }

}


function showResultState() {

    emptyState.classList.add("hidden");

    loading.classList.add("hidden");

    predictionResult.classList.remove("hidden");

    resetButton();

}


function resetButton() {

    predictButton.disabled = false;

    const buttonText =
        predictButton.querySelector("span:first-child");

    if (buttonText) {

        buttonText.textContent =
            "Run AI Analysis";

    }

}


// ============================================================
// RISK HELPERS
// ============================================================

function getRiskClass(risk) {

    if (risk === "LOW") {

        return "risk-low";

    }

    if (risk === "MODERATE") {

        return "risk-moderate";

    }

    return "risk-high";

}


function getMachineStatus(risk) {

    if (risk === "LOW") {

        return "Operating Normally";

    }

    if (risk === "MODERATE") {

        return "Monitoring Required";

    }

    return "Immediate Attention Required";

}


// ============================================================
// UPDATE PREDICTION RESULT
// ============================================================

function updateRiskDisplay(data) {

    const probabilityValue =
        Number(data.failure_probability);

    const risk =
        String(data.risk_level).toUpperCase();

    const riskClass =
        getRiskClass(risk);


    // --------------------------------------------------------
    // Risk indicator
    // --------------------------------------------------------

    riskIndicator.textContent =
        `${risk} FAILURE RISK`;

    riskIndicator.classList.remove(
        "risk-low",
        "risk-moderate",
        "risk-high"
    );

    riskIndicator.classList.add(
        riskClass
    );


    // --------------------------------------------------------
    // Failure probability
    // --------------------------------------------------------

    probability.textContent =
        `${probabilityValue.toFixed(2)}%`;

    probabilityText.textContent =
        `${probabilityValue.toFixed(2)}%`;


    const progressValue =
        Math.min(
            Math.max(
                probabilityValue,
                0
            ),
            100
        );


    probabilityBar.style.width =
        `${progressValue}%`;


    probabilityBar.classList.remove(
        "risk-low",
        "risk-moderate",
        "risk-high"
    );

    probabilityBar.classList.add(
        riskClass
    );


    // --------------------------------------------------------
    // Machine status
    // --------------------------------------------------------

    machineStatus.textContent =
        getMachineStatus(risk);

    machineStatus.classList.remove(
        "risk-low",
        "risk-moderate",
        "risk-high"
    );

    machineStatus.classList.add(
        riskClass
    );


    // --------------------------------------------------------
    // Calculated machine values
    // --------------------------------------------------------

    temperatureDifference.textContent =
        Number(
            data.temperature_difference
        ).toFixed(2);


    mechanicalPower.textContent =
        Number(
            data.mechanical_power
        ).toFixed(2);


    // --------------------------------------------------------
    // Recommendation
    // --------------------------------------------------------

    recommendation.textContent =
        data.recommendation ||
        "No recommendation available.";

}


// ============================================================
// PREDICTION HISTORY
// ============================================================

function getHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "predictionHistory"
            ) || "[]"
        );

    } catch (error) {

        console.error(
            "Unable to read prediction history:",
            error
        );

        return [];

    }

}


function saveHistory(data) {

    const history =
        getHistory();


    history.unshift(data);


    // Keep only the latest 10 predictions

    if (history.length > 10) {

        history.splice(10);

    }


    localStorage.setItem(
        "predictionHistory",
        JSON.stringify(history)
    );

}


function getStatusText(item) {

    if (item.risk_level === "LOW") {

        return "Normal";

    }

    if (item.risk_level === "MODERATE") {

        return "Monitor";

    }

    return "Attention";

}


function getStatusClass(item) {

    if (item.risk_level === "LOW") {

        return "status-normal";

    }

    if (item.risk_level === "MODERATE") {

        return "status-monitor";

    }

    return "status-attention";

}


// ============================================================
// RENDER HISTORY
// ============================================================

function renderHistory() {

    const history =
        getHistory();


    historyBody.innerHTML = "";


    if (history.length === 0) {

        historyEmpty.classList.remove(
            "hidden"
        );

        return;

    }


    historyEmpty.classList.add(
        "hidden"
    );


    history.forEach(item => {

        const row =
            document.createElement("tr");


        const time =
            new Date(item.timestamp);


        const formattedTime =
            time.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        const riskClass =
            getRiskClass(
                item.risk_level
            );


        const statusClass =
            getStatusClass(item);


        row.innerHTML = `
            <td>${formattedTime}</td>

            <td>${item.type}</td>

            <td class="${riskClass}">
                ${item.risk_level}
            </td>

            <td>
                ${Number(
                    item.failure_probability
                ).toFixed(2)}%
            </td>

            <td class="${statusClass}">
                ${getStatusText(item)}
            </td>
        `;


        historyBody.appendChild(row);

    });

}


// ============================================================
// RUN PREDICTION
// ============================================================

async function runPrediction(event) {

    event.preventDefault();


    // --------------------------------------------------------
    // Collect form data
    // --------------------------------------------------------

    const requestData = {

        type:
            productType.value,

        air_temperature:
            Number(
                airTemperature.value
            ),

        process_temperature:
            Number(
                processTemperature.value
            ),

        rotational_speed:
            Number(
                rotationalSpeed.value
            ),

        torque:
            Number(
                torque.value
            ),

        tool_wear:
            Number(
                toolWear.value
            )

    };


    // --------------------------------------------------------
    // Validate input
    // --------------------------------------------------------

    if (

        !requestData.type ||

        !Number.isFinite(
            requestData.air_temperature
        ) ||

        !Number.isFinite(
            requestData.process_temperature
        ) ||

        !Number.isFinite(
            requestData.rotational_speed
        ) ||

        !Number.isFinite(
            requestData.torque
        ) ||

        !Number.isFinite(
            requestData.tool_wear
        )

    ) {

        alert(
            "Please enter valid machine parameters."
        );

        return;

    }


    // --------------------------------------------------------
    // Show loading
    // --------------------------------------------------------

    showLoadingState();


    try {

        // ----------------------------------------------------
        // Send request to deployed Render API
        // ----------------------------------------------------

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestData
                        )
                }
            );


        // ----------------------------------------------------
        // Parse response
        // ----------------------------------------------------

        const data =
            await response.json();


        // ----------------------------------------------------
        // Handle API errors
        // ----------------------------------------------------

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Prediction request failed."
            );

        }


        // ----------------------------------------------------
        // Update prediction UI
        // ----------------------------------------------------

        updateRiskDisplay(
            data
        );


        // ----------------------------------------------------
        // Save prediction to history
        // ----------------------------------------------------

        saveHistory({

            timestamp:
                new Date().toISOString(),

            type:
                requestData.type,

            air_temperature:
                requestData.air_temperature,

            process_temperature:
                requestData.process_temperature,

            rotational_speed:
                requestData.rotational_speed,

            torque:
                requestData.torque,

            tool_wear:
                requestData.tool_wear,

            failure_probability:
                data.failure_probability,

            risk_level:
                data.risk_level,

            prediction:
                data.prediction

        });


        // ----------------------------------------------------
        // Refresh history
        // ----------------------------------------------------

        renderHistory();


        // ----------------------------------------------------
        // Show result
        // ----------------------------------------------------

        showResultState();


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        resetButton();


        alert(
            "Unable to connect to the prediction API.\n\n" +
            "Please check that the deployed API is running."
        );


        showEmptyState();

    }

}


// ============================================================
// CLEAR HISTORY
// ============================================================

function clearHistory() {

    localStorage.removeItem(
        "predictionHistory"
    );

    renderHistory();

}


// ============================================================
// EVENT LISTENERS
// ============================================================

form.addEventListener(
    "submit",
    runPrediction
);


clearHistoryButton.addEventListener(
    "click",
    clearHistory
);


// ============================================================
// INITIALIZE APPLICATION
// ============================================================

renderHistory();

showEmptyState();