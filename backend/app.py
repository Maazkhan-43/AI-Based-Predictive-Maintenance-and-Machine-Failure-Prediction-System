import os

from flask import Flask, request, jsonify
from flask_cors import CORS

from prediction import predict_machine_failure


app = Flask(__name__)

CORS(app)


# ============================================================
# HOME ROUTE
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Predictive Maintenance API",
        "status": "running",
        "model": "XGBoost"
    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "healthy"
    })


# ============================================================
# PREDICTION ROUTE
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "error": "No JSON data received."
            }), 400


        required_fields = [
            "type",
            "air_temperature",
            "process_temperature",
            "rotational_speed",
            "torque",
            "tool_wear"
        ]


        missing_fields = [
            field
            for field in required_fields
            if field not in data
        ]


        if missing_fields:

            return jsonify({
                "error": "Missing required fields.",
                "fields": missing_fields
            }), 400


        product_type = data["type"]


        if product_type not in ["L", "M", "H"]:

            return jsonify({
                "error": "Invalid product type. Use L, M, or H."
            }), 400


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


        result = predict_machine_failure(
            product_type,
            air_temperature,
            process_temperature,
            rotational_speed,
            torque,
            tool_wear
        )


        return jsonify(result)


    except ValueError:

        return jsonify({
            "error": "Invalid numeric input."
        }), 400


    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    port = int(
        os.environ.get("PORT", 5000)
    )

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )