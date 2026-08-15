from flask import Flask, request, jsonify
from flask_cors import CORS

from prediction import predict_machine_failure


# ============================================================
# CREATE FLASK APPLICATION
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# HOME ROUTE
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Predictive Maintenance API",
        "status": "running"
    })


# ============================================================
# PREDICTION ROUTE
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # ----------------------------------------------------
        # RECEIVE JSON DATA
        # ----------------------------------------------------

        data = request.get_json()


        # ----------------------------------------------------
        # EXTRACT INPUTS
        # ----------------------------------------------------

        product_type = data["type"]

        air_temperature = float(
            data["air_temperature"]
        )

        process_temperature = float(
            data["process_temperature"]
        )

        rotational_speed = float(
            data["rotational_speed"]
        )

        torque = float(
            data["torque"]
        )

        tool_wear = float(
            data["tool_wear"]
        )


        # ----------------------------------------------------
        # RUN MODEL
        # ----------------------------------------------------

        result = predict_machine_failure(
            product_type,
            air_temperature,
            process_temperature,
            rotational_speed,
            torque,
            tool_wear
        )


        # ----------------------------------------------------
        # RETURN JSON RESPONSE
        # ----------------------------------------------------

        return jsonify(result)


    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 400


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )