import os
import sys
import json
import joblib

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    ROOT_DIR,
    "src",
    "models",
    "scam-classifier.pkl"
)


def get_risk_level(label, probability):
    if label == "scam":
        if probability >= 0.75:
            return "high"
        return "medium"

    if probability < 0.60:
        return "medium"

    return "low"


def get_scam_type(message, label):
    text = message.lower()

    if label != "scam":
        return "none"

    if "kyc" in text:
        return "kyc_phishing"

    if "otp" in text or "password" in text or "cvv" in text or "pin" in text:
        return "credential_theft"

    if "lottery" in text or "prize" in text or "reward" in text or "won" in text:
        return "fake_reward"

    if "fee" in text or "pay" in text or "processing" in text:
        return "advance_fee_fraud"

    if "bank" in text or "account" in text or "click" in text or "verify" in text:
        return "phishing"

    return "unknown"


def get_red_flags(message, label):
    text = message.lower()
    flags = []

    if label == "scam":
        flags.append("ML model classified this message as scam-like")

    if "urgent" in text or "immediately" in text or "today" in text:
        flags.append("Urgency or time pressure")

    if "blocked" in text or "suspended" in text or "locked" in text:
        flags.append("Threat of account blocking or suspension")

    if "kyc" in text or "verify" in text:
        flags.append("Verification or KYC request")

    if "otp" in text or "password" in text or "pin" in text or "cvv" in text:
        flags.append("Sensitive credential request")

    if "http" in text or "click" in text:
        flags.append("Link or click-based action")

    if "won" in text or "reward" in text or "prize" in text or "lottery" in text:
        flags.append("Reward or prize promise")

    if "pay" in text or "fee" in text:
        flags.append("Payment or fee request")

    return list(dict.fromkeys(flags))


def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "Message argument is required"
        }))
        sys.exit(1)

    message = sys.argv[1]

    if not os.path.exists(MODEL_PATH):
        print(json.dumps({
            "error": f"Model not found at {MODEL_PATH}. Run training first."
        }))
        sys.exit(1)

    model = joblib.load(MODEL_PATH)

    prediction = model.predict([message])[0]

    probabilities = model.predict_proba([message])[0]
    classes = list(model.classes_)

    predicted_index = classes.index(prediction)
    confidence = float(probabilities[predicted_index])

    risk_level = get_risk_level(prediction, confidence)
    risk_score = int(round(confidence * 100)) if prediction == "scam" else int(round((1 - confidence) * 100))

    scam_type = get_scam_type(message, prediction)
    red_flags = get_red_flags(message, prediction)

    if prediction == "scam":
        explanation = "The traditional ML classifier identified this message as scam-like based on learned text patterns from the training dataset."
        safe_action = "Do not click links or share sensitive information. Verify the sender through official channels."
    else:
        explanation = "The traditional ML classifier did not find strong scam-like text patterns based on the training dataset."
        safe_action = "No strong scam pattern was detected, but verify unexpected messages before taking action."

    result = {
        "label": prediction,
        "riskLevel": risk_level,
        "riskScore": risk_score,
        "confidence": round(confidence, 2),
        "scamType": scam_type,
        "redFlags": red_flags,
        "explanation": explanation,
        "safeAction": safe_action
    }

    print(json.dumps(result))


if __name__ == "__main__":
    main()
