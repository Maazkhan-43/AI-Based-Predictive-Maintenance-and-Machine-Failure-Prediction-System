const API_URL = "http://127.0.0.1:5000/predict";

const predictionForm =
    document.getElementById("predictionForm");

const predictButton =
    document.getElementById("predictButton");

const emptyState =
    document.getElementById("emptyState");

const loading =
    document.getElementById("loading");

const predictionResult =
    document.getElementById("predictionResult");

const riskIndicator =
    document.getElementById("riskIndicator");

const probability =
    document.getElementById("probability");

const probabilityBar =
    document.getElementById("probabilityBar");

const machineStatus =
    document.getElementById("machineStatus");

const temperatureDifference =
    document.getElementById("temperatureDifference");

const mechanicalPower =
    document.getElementById("mechanicalPower");

const recommendation =
    document.getElementById("recommendation");

const historyBody =
    document.getElementById("historyBody");

const historyEmpty =
    document.getElementById("historyEmpty");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");

let predictionHistory =
    JSON.parse(
        localStorage.getItem("predictionHistory")
    ) || [];

renderHistory();

predictionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const machineData = {

            type:
                document.getElementById(
                    "productType"
                ).value,

            air_temperature:
                parseFloat(
                    document.getElementById(
                        "airTemperature"
                    ).value
                ),

            process_temperature:
                parseFloat(
                    document.getElementById(
                        "processTemperature"
                    ).value
                ),

            rotational_speed:
                parseFloat(
                    document.getElementById(
                        "rotationalSpeed"
                    ).value
                ),

            torque:
                parseFloat(
                    document.getElementById(
                        "torque"
                    ).value
                ),

            tool_wear:
                parseFloat(
                    document.getElementById(
                        "toolWear"
                    ).value
                )
        };

        emptyState.classList.add(
            "hidden"
        );

        predictionResult.classList.add(
            "hidden"
        );

        loading.classList.remove(
            "hidden"
        );

        predictButton.disabled = true;

        predictButton.querySelector(
            "span"
        ).textContent = "Analyzing...";

        try {

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
                                machineData
                            )
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Prediction server returned an error."
                );

            }

            const result =
                await response.json();

            displayResult(result);

            savePrediction(
                machineData,
                result
            );

        } catch (error) {

            console.error(error);

            loading.classList.add(
                "hidden"
            );

            emptyState.classList.remove(
                "hidden"
            );

            alert(
                "Unable to connect to the prediction server. " +
                "Make sure Flask is running."
            );

        } finally {

            predictButton.disabled =
                false;

            predictButton.querySelector(
                "span"
            ).textContent =
                "Run Failure Analysis";
        }

    }
);


function displayResult(result) {

    loading.classList.add(
        "hidden"
    );

    predictionResult.classList.remove(
        "hidden"
    );

    const probabilityValue =
        Number(
            result.failure_probability ??
            result.probability ??
            0
        );

    probability.textContent =
        `${probabilityValue.toFixed(2)}%`;

    probabilityBar.style.width =
        `${Math.min(
            probabilityValue,
            100
        )}%`;

    temperatureDifference.textContent =
        Number(
            result.temperature_difference ??
            0
        ).toFixed(2);

    mechanicalPower.textContent =
        Number(
            result.mechanical_power ??
            0
        ).toFixed(2);

    recommendation.textContent =
        result.recommendation ??
        "No recommendation available.";

    const riskLevel =
        String(
            result.risk_level ??
            ""
        ).toUpperCase();

    riskIndicator.className =
        "risk-indicator";

    if (riskLevel === "HIGH") {

        riskIndicator.textContent =
            "🔴 HIGH FAILURE RISK";

        riskIndicator.style.background =
            "#fee2e2";

        riskIndicator.style.color =
            "#b91c1c";

        probabilityBar.style.background =
            "#dc2626";

        machineStatus.textContent =
            "Immediate Attention Required";

        machineStatus.style.color =
            "#b91c1c";

    } else if (
        riskLevel === "MODERATE"
    ) {

        riskIndicator.textContent =
            "🟠 MODERATE FAILURE RISK";

        riskIndicator.style.background =
            "#ffedd5";

        riskIndicator.style.color =
            "#c2410c";

        probabilityBar.style.background =
            "#ea580c";

        machineStatus.textContent =
            "Monitor Machine";

        machineStatus.style.color =
            "#c2410c";

    } else {

        riskIndicator.textContent =
            "🟢 LOW FAILURE RISK";

        riskIndicator.style.background =
            "#dcfce7";

        riskIndicator.style.color =
            "#15803d";

        probabilityBar.style.background =
            "#16a34a";

        machineStatus.textContent =
            "Operating Normally";

        machineStatus.style.color =
            "#15803d";
    }

    predictionResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function savePrediction(
    machineData,
    result
) {

    const probabilityValue =
        Number(
            result.failure_probability ??
            result.probability ??
            0
        );

    const riskLevel =
        String(
            result.risk_level ??
            "LOW"
        ).toUpperCase();

    let status;

    if (riskLevel === "HIGH") {

        status =
            "Attention Required";

    } else if (
        riskLevel === "MODERATE"
    ) {

        status =
            "Monitor";

    } else {

        status =
            "Normal";
    }

    const prediction = {

        time:
            new Date().toLocaleTimeString(),

        product:
            machineData.type,

        risk:
            riskLevel,

        probability:
            probabilityValue,

        status:
            status
    };

    predictionHistory.unshift(
        prediction
    );

    predictionHistory =
        predictionHistory.slice(
            0,
            10
        );

    localStorage.setItem(
        "predictionHistory",
        JSON.stringify(
            predictionHistory
        )
    );

    renderHistory();
}


function renderHistory() {

    historyBody.innerHTML = "";

    if (
        predictionHistory.length === 0
    ) {

        historyEmpty.classList.remove(
            "hidden"
        );

        return;
    }

    historyEmpty.classList.add(
        "hidden"
    );

    predictionHistory.forEach(
        function (item) {

            const row =
                document.createElement(
                    "tr"
                );

            let riskClass;
            let statusClass;

            if (
                item.risk === "HIGH"
            ) {

                riskClass =
                    "risk-high";

                statusClass =
                    "status-attention";

            } else if (
                item.risk === "MODERATE"
            ) {

                riskClass =
                    "risk-moderate";

                statusClass =
                    "status-monitor";

            } else {

                riskClass =
                    "risk-low";

                statusClass =
                    "status-normal";
            }

            row.innerHTML = `
                <td>${item.time}</td>
                <td>${item.product}</td>
                <td class="${riskClass}">
                    ${item.risk}
                </td>
                <td>
                    ${Number(
                        item.probability
                    ).toFixed(2)}%
                </td>
                <td class="${statusClass}">
                    ${item.status}
                </td>
            `;

            historyBody.appendChild(
                row
            );
        }
    );
}


clearHistoryButton.addEventListener(
    "click",
    function () {

        predictionHistory = [];

        localStorage.removeItem(
            "predictionHistory"
        );

        renderHistory();
    }
);