# Predictive Maintenance – Machine Failure Prediction

## 1. Project Overview

Predictive maintenance aims to identify potential machine failures before they occur by analyzing machine operating conditions.

This project develops a machine learning-based predictive maintenance system that estimates the probability of machine failure from operating parameters such as temperature, rotational speed, torque, and tool wear.

The system compares multiple machine learning approaches and uses a tuned XGBoost model for the final prediction system.

---

## 2. Problem Statement

Unexpected machine failures can cause production downtime, maintenance costs, equipment damage, and operational delays.

Traditional maintenance approaches such as reactive maintenance often identify problems only after a failure has occurred, while fixed-schedule preventive maintenance may result in unnecessary maintenance.

This project addresses the problem by developing a data-driven system capable of estimating machine failure risk from current operating conditions and providing an actionable maintenance recommendation.

---

## 3. Objectives

- Predict whether a machine is likely to fail.
- Estimate the probability of machine failure.
- Compare different machine learning models.
- Tune the selected machine learning model.
- Analyze classification performance using suitable evaluation metrics.
- Provide interpretable risk levels.
- Develop a web-based interface for real-time predictions.
- Expose the trained model through a Flask REST API.

---

## 4. Machine Learning Approach

The project uses machine operating parameters including:

- Product Type
- Air Temperature
- Process Temperature
- Rotational Speed
- Torque
- Tool Wear

Two additional derived features are calculated:

- Temperature Difference
- Mechanical Power

### Models Evaluated

- Random Forest
- XGBoost

The models were evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC
- PR-AUC

PR-AUC was given particular importance because machine failure is a relatively rare event and class imbalance makes accuracy alone insufficient for evaluating failure detection.

---

## 5. Model Comparison

The initial models were evaluated on the held-out test set.

| Model | Accuracy | Precision | Recall | F1 Score | ROC-AUC | PR-AUC |
|---|---:|---:|---:|---:|---:|---:|
| Random Forest | 0.9895 | 0.8983 | 0.7794 | 0.8346 | 0.9765 | 0.8415 |
| XGBoost | 0.9905 | 0.9455 | 0.7647 | 0.8455 | 0.9836 | 0.8891 |
| Tuned XGBoost | 0.9900 | 0.9138 | 0.7794 | 0.8413 | 0.9802 | 0.8822 |

XGBoost provided stronger overall discrimination, particularly in PR-AUC and ROC-AUC.

After hyperparameter tuning, the tuned XGBoost model was selected as the final machine learning model for deployment.

---

## 6. XGBoost Hyperparameter Tuning

The final XGBoost model was tuned using cross-validation.

Best parameters:

```text
n_estimators = 100
max_depth = 6
learning_rate = 0.1
subsample = 0.8
colsample_bytree = 1.0
min_child_weight = 1