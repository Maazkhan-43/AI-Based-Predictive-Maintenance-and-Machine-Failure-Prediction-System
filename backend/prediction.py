import numpy as np
import pandas as pd
import joblib

MODEL_PATH = "models/random_forest_pipeline.pkl"

model = joblib.load(MODEL_PATH)


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
        "Temperature difference [K]": [temperature_difference],
        "Mechanical power [W]": [mechanical_power]
    })

    prediction = model.predict(input_data)[0]

    failure_class_index = list(
        model.classes_
    ).index(1)

    failure_probability = model.predict_proba(
        input_data
    )[0][failure_class_index]

    probability_percentage = (
        failure_probability * 100
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
        "failure_probability": round(
            probability_percentage,
            2
        ),
        "risk_level": risk_level,
        "recommendation": recommendation,
        "temperature_difference": round(
            temperature_difference,
            2
        ),
        "mechanical_power": round(
            mechanical_power,
            2
        )
    }


def get_feature_importance():

    try:

        preprocessor = model.named_steps[
            "preprocessor"
        ]

        classifier = model.named_steps[
            "classifier"
        ]

        feature_names = (
            preprocessor
            .get_feature_names_out()
        )

        importances = (
            classifier.feature_importances_
        )

        feature_data = []

        for name, importance in zip(
            feature_names,
            importances
        ):

            clean_name = name

            if clean_name.startswith(
                "num__"
            ):
                clean_name = clean_name[
                    5:
                ]

            elif clean_name.startswith(
                "cat__"
            ):

                clean_name = clean_name[
                    5:
                ]

            feature_data.append({
                "feature": clean_name,
                "importance": round(
                    float(importance) * 100,
                    2
                )
            })

        feature_data.sort(
            key=lambda x: x["importance"],
            reverse=True
        )

        return feature_data

    except Exception as error:

        raise RuntimeError(
            f"Unable to extract feature importance: {error}"
        )