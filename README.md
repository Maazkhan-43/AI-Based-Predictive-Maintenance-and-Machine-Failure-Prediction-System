# Predictive Maintenance — Machine Failure Prediction

## Overview

This project develops a machine learning-based predictive maintenance
system that analyzes machine operating conditions and predicts the
probability of machine failure.

The goal is to identify potentially abnormal operating conditions
before equipment failure occurs, allowing maintenance teams to take
preventive action.

## Problem Statement

Unexpected machine failures can result in production downtime,
maintenance costs, and operational losses.

Traditional maintenance approaches may rely on fixed schedules or
reactive maintenance after a failure has occurred.

This project investigates whether machine operating parameters such
as temperature, rotational speed, torque, and tool wear can be used
to predict machine failures using supervised machine learning.

## Dataset

The project uses a machine predictive maintenance dataset containing
10,000 machine observations.

The dataset contains operating variables including:

- Air temperature
- Process temperature
- Rotational speed
- Torque
- Tool wear
- Product type

The target variable is:

`Machine failure`

The target represents whether a machine failure occurred.

## Data Preprocessing

The following preprocessing steps were performed:

- Checked for missing values
- Checked for duplicate observations
- Removed identifier columns
- Excluded failure-mode variables that could introduce target leakage
- Encoded categorical product type
- Prepared numerical features for model training
- Performed a stratified train-test split

The dataset contained 10,000 observations with no missing values
and no duplicate rows.

## Exploratory Data Analysis

Exploratory analysis was performed to investigate relationships
between machine operating conditions and failure.

The analysis examined:

- Temperature distributions
- Rotational speed
- Torque
- Tool wear
- Failure rates by product type
- Correlations between numerical variables
- Failure rates across tool-wear ranges

The analysis indicated that variables such as torque and tool wear
show meaningful differences between normal and failure observations.

## Feature Engineering

Two additional features were created:

### Temperature Difference

Process temperature minus air temperature.

### Mechanical Power

Mechanical power was estimated from rotational speed and torque.

These engineered features were included to provide the model with
additional representations of machine operating conditions.

## Machine Learning Models

Two supervised classification models were evaluated:

1. Logistic Regression
2. Random Forest

Logistic Regression was used as a baseline model.

Random Forest was then evaluated to capture nonlinear relationships
between machine operating conditions and failure.

## Model Results

### Logistic Regression

- Accuracy: 85.85%
- Precision: 17.72%
- Recall: 86.76%
- F1 Score: 29.43%
- ROC-AUC: 93.40%
- PR-AUC: 46.59%

### Random Forest

- Accuracy: 98.95%
- Precision: 89.83%
- Recall: 77.94%
- F1 Score: 83.46%
- ROC-AUC: 97.65%
- PR-AUC: 84.15%

Random Forest was selected as the final model because it provided
a substantially better overall balance between precision, recall,
F1-score and ranking performance on the imbalanced failure
prediction problem.

## Application

A Streamlit-based prediction application was developed.

The application accepts:

- Product type
- Air temperature
- Process temperature
- Rotational speed
- Torque
- Tool wear

and produces:

- Failure probability
- Failure risk classification
- Maintenance recommendation

## Project Structure

```text
predictive-maintenance/
│
├── app/
│   └── app.py
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── results/
│
├── models/
│   └── random_forest_pipeline.pkl
│
├── notebooks/
│   ├── 01_dataset_understanding.ipynb
│   ├── 02_data_preprocessing.ipynb
│   ├── 03_exploratory_data_analysis.ipynb
│   ├── 04_feature_engineering.ipynb
│   └── 05_model_training.ipynb
│
├── .gitignore
└── README.md