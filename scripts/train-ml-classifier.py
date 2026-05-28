import os
import json
import joblib
import pandas as pd

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATASET_PATH = os.path.join(
    ROOT_DIR,
    "src",
    "datasets",
    "sample-scam-messages.csv"
)

MODEL_DIR = os.path.join(ROOT_DIR, "src", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "scam-classifier.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "scam-classifier-metrics.json")


def main():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)

    required_columns = {"message", "label"}
    missing_columns = required_columns - set(df.columns)

    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")

    df = df.dropna(subset=["message", "label"])

    X = df["message"].astype(str)
    y = df["label"].astype(str)

    if len(df) < 10:
        raise ValueError("Dataset is too small. Add at least 10 examples.")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y
    )

    pipeline = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                ngram_range=(1, 2),
                stop_words="english"
            )
        ),
        (
            "classifier",
            LogisticRegression(
                max_iter=1000,
                class_weight="balanced"
            )
        )
    ])

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    report = classification_report(
        y_test,
        predictions,
        output_dict=True,
        zero_division=0
    )

    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(pipeline, MODEL_PATH)

    with open(METRICS_PATH, "w", encoding="utf-8") as file:
        json.dump(
            {
                "accuracy": accuracy,
                "classification_report": report,
                "dataset_size": len(df),
                "model": "TF-IDF + Logistic Regression"
            },
            file,
            indent=2
        )

    print("ML scam classifier trained successfully.")
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Metrics saved to: {METRICS_PATH}")
    print(f"Accuracy: {accuracy:.2f}")


if __name__ == "__main__":
    main()
