import streamlit as st
import pandas as pd
import numpy as np
import joblib


# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="Predictive Maintenance",
    page_icon="⚙️",
    layout="centered"
)


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

MODEL_PATH = "models/random_forest_pipeline.pkl"

model = joblib.load(MODEL_PATH)


# ============================================================
# TITLE
# ============================================================

st.title("⚙️ Predictive Maintenance System")

st.write(
    "Machine Failure Prediction using Machine Learning"
)

st.divider()


# ============================================================
# INTRODUCTION
# ============================================================

st.subheader("Machine Condition Analysis")

st.write(
    """
    Enter the current operating conditions of a machine.
    The trained machine learning model will estimate the
    probability of machine failure.
    """
)


# ============================================================
# MACHINE OPERATING CONDITIONS
# ============================================================

st.subheader("Machine Operating Conditions")


# Product type

product_type = st.selectbox(
    "Product Type",
    options=["L", "M", "H"]
)


# Air temperature

air_temperature = st.number_input(
    "Air Temperature [K]",
    min_value=290.0,
    max_value=310.0,
    value=300.0,
    step=0.1
)


# Process temperature

process_temperature = st.number_input(
    "Process Temperature [K]",
    min_value=300.0,
    max_value=320.0,
    value=310.0,
    step=0.1
)


# Rotational speed

rotational_speed = st.number_input(
    "Rotational Speed [rpm]",
    min_value=1000,
    max_value=3000,
    value=1500,
    step=10
)


# Torque

torque = st.number_input(
    "Torque [Nm]",
    min_value=0.0,
    max_value=100.0,
    value=40.0,
    step=0.5
)


# Tool wear

tool_wear = st.number_input(
    "Tool Wear [min]",
    min_value=0,
    max_value=300,
    value=100,
    step=1
)


# ============================================================
# FEATURE ENGINEERING
# ============================================================

# Temperature difference

temperature_difference = (
    process_temperature - air_temperature
)


# Mechanical power

mechanical_power = (
    2 * np.pi * rotational_speed * torque / 60
)


# ============================================================
# CREATE INPUT DATAFRAME
# ============================================================

input_data = pd.DataFrame({
    "Type": [product_type],

    "Air temperature [K]": [
        air_temperature
    ],

    "Process temperature [K]": [
        process_temperature
    ],

    "Rotational speed [rpm]": [
        rotational_speed
    ],

    "Torque [Nm]": [
        torque
    ],

    "Tool wear [min]": [
        tool_wear
    ],

    "Temperature difference [K]": [
        temperature_difference
    ],

    "Mechanical power [W]": [
        mechanical_power
    ]
})


# ============================================================
# PREDICTION
# ============================================================

prediction = model.predict(input_data)[0]


# Get probability for failure class (1)

failure_class_index = list(model.classes_).index(1)

failure_probability = model.predict_proba(
    input_data
)[0][failure_class_index]


probability_percentage = (
    failure_probability * 100
)


# ============================================================
# PREDICTION RESULT
# ============================================================

st.subheader("Prediction Result")


# ------------------------------------------------------------
# HIGH RISK
# ------------------------------------------------------------

if probability_percentage >= 70:

    st.error(
        "🔴 HIGH FAILURE RISK"
    )

    st.write(
        f"Estimated failure probability: "
        f"**{probability_percentage:.2f}%**"
    )

    st.progress(
        min(failure_probability, 1.0)
    )

    st.warning(
        "Immediate maintenance inspection is recommended."
    )


# ------------------------------------------------------------
# MODERATE RISK
# ------------------------------------------------------------

elif probability_percentage >= 30:

    st.warning(
        "🟠 MODERATE FAILURE RISK"
    )

    st.write(
        f"Estimated failure probability: "
        f"**{probability_percentage:.2f}%**"
    )

    st.progress(
        min(failure_probability, 1.0)
    )

    st.info(
        "Monitor machine conditions and consider "
        "preventive maintenance."
    )


# ------------------------------------------------------------
# LOW RISK
# ------------------------------------------------------------

else:

    st.success(
        "🟢 LOW FAILURE RISK"
    )

    st.write(
        f"Estimated failure probability: "
        f"**{probability_percentage:.2f}%**"
    )

    st.progress(
        min(failure_probability, 1.0)
    )

    st.info(
        "Machine appears to be operating under "
        "normal conditions."
    )


# ============================================================
# INPUT SUMMARY
# ============================================================

st.divider()

st.subheader("Input Summary")

summary_data = pd.DataFrame({
    "Parameter": [
        "Product Type",
        "Air Temperature [K]",
        "Process Temperature [K]",
        "Temperature Difference [K]",
        "Rotational Speed [rpm]",
        "Torque [Nm]",
        "Tool Wear [min]",
        "Mechanical Power [W]"
    ],

    "Value": [
        product_type,
        air_temperature,
        process_temperature,
        temperature_difference,
        rotational_speed,
        torque,
        tool_wear,
        round(mechanical_power, 2)
    ]
})


st.dataframe(
    summary_data,
    hide_index=True,
    use_container_width=True
)


# ============================================================
# FOOTER
# ============================================================

st.divider()

st.caption(
    "Predictive Maintenance System | "
    "Machine Failure Prediction using Random Forest"
)