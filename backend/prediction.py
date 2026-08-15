import os
import numpy as np
import pandas as pd
import joblib

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "xgboost",
    "xgboost_model.pkl"
)

PREPROCESSOR_PATH = os.path.join(
    BASE_DIR,
    "models",
    "xgboost",
    "xgboost_preprocessor.pkl"
)

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)


def predict_machine_failure(
    product_type,
    air_temperature,
    process_temperature,
    rotational_speed,
    torque,
    tool_wear
):

    temperature_difference = (
        process_temperature - air_temperature
    )

    mechanical_power = (
        2 * np.pi * rotational_speed * torque / 60
    )

    input_data = pd.DataFrame({
        "Type": [product_type],
        "Air temperature [K]": [air_temperature],
        "Process temperature [K]": [process_temperature],
        "Rotational speed [rpm]": [rotational_speed],
        "Torque [Nm]": [torque],
        "Tool wear [min]": [tool_wear],
        "Temperature difference [K]": [
            temperature_difference
        ],
        "Mechanical power [W]": [
            mechanical_power
        ]
    })

    processed_data = preprocessor.transform(
        input_data
    )

    prediction = model.predict(
        processed_data
    )[0]

    failure_class_index = list(
        model.classes_
    ).index(1)

    failure_probability = model.predict_proba(
        processed_data
    )[0][failure_class_index]

    probability_percentage = round(
        float(failure_probability * 100),
        2
    )

    if probability_percentage >= 70:

        risk_level = "HIGH"

        recommendation = (
            "Immediate maintenance inspection "
            "is recommended."
        )

    elif probability_percentage >= 30:

        risk_level = "MODERATE"

        recommendation = (
            "Monitor machine conditions and "
            "consider preventive maintenance."
        )

    else:

        risk_level = "LOW"

        recommendation = (
            "Machine appears to be operating "
            "under normal conditions."
        )

    return {
        "prediction": int(prediction),

        "failure_probability": probability_percentage,

        "risk_level": risk_level,

        "recommendation": recommendation,

        "temperature_difference": round(
            float(temperature_difference),
            2
        ),

        "mechanical_power": round(
            float(mechanical_power),
            2
        )
    }