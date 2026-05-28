# Evaluation Results

## Overview

This document tracks the evaluation of different scam detection approaches.

The goal is to compare not only whether the system detects scam messages, but also how each approach performs across:

- Accuracy
- Latency
- Cost
- Explainability
- Infrastructure requirement
- Reliability

---

## Current Approaches Evaluated

| Approach | Status |
|---|---|
| Rule-Based | Implemented |
| Traditional ML | Implemented |
| OpenAI LLM | Implemented |
| Local LLM | Implemented |
| Hybrid | Implemented |

---

## Evaluation Dataset

The ML classifier is trained using a labelled dataset:

```txt
src/datasets/sample-scam-messages.csv
```

Dataset columns:

| Column          | Description                           |
| --------------- | ------------------------------------- |
| message         | Input message                         |
| label           | scam or safe                          |
| scam_type       | Scam category or none                 |
| source_channel  | SMS, email, WhatsApp, etc.            |
| contains_url    | Whether message contains URL          |
| contains_amount | Whether message contains money amount |
| expected_risk   | Expected risk level                   |
| notes           | Extra note for analysis               |

---

## ML Training Result

Example training output:

```txt
ML scam classifier trained successfully.
Model saved to: src/models/scam-classifier.pkl
Metrics saved to: src/models/scam-classifier-metrics.json
Accuracy: 0.67
```

The first accuracy score may be low if the dataset is small.

This is expected because traditional ML depends heavily on:

* Dataset size
* Label quality
* Scam type coverage
* Safe message variety
* Hard-safe examples
* Hard-scam examples

---

## Important Metrics

For scam detection, accuracy alone is not enough.

| Metric         | Meaning                                      |
| -------------- | -------------------------------------------- |
| Accuracy       | Overall correct predictions                  |
| Precision      | How many predicted scams were actually scams |
| Recall         | How many actual scams were detected          |
| F1 Score       | Balance between precision and recall         |
| False Positive | Safe message incorrectly marked as scam      |
| False Negative | Scam message incorrectly marked as safe      |

---

## Why Recall Matters

In scam detection, false negatives are dangerous.

A false negative means:

```txt
A real scam was marked safe.
```

So scam recall is very important.

However, false positives also matter.

A false positive means:

```txt
A safe message was marked scam.
```

This can reduce user trust.

A good system should balance both.

---

## Manual Test Cases

| Message Type        | Example                                       | Expected Risk |
| ------------------- | --------------------------------------------- | ------------- |
| KYC phishing        | Your account will be blocked. Update KYC now. | High          |
| OTP theft           | Share your OTP to avoid suspension.           | High          |
| Fake reward         | You won ₹10 lakh. Pay fee to claim.           | High          |
| Delivery scam       | Your parcel is held. Pay customs fee.         | Medium/High   |
| Safe order update   | Your order has been delivered.                | Low           |
| Safe meeting update | Are we still meeting at 4 PM?                 | Low           |
| Safe OTP alert      | Your OTP is 123456. Do not share it.          | Low/Medium    |

---

## Approach Comparison Template

| Approach       | Risk        |   Score |  Confidence |     Latency |       Cost | Infra    | Explainability |
| -------------- | ----------- | ------: | ----------: | ----------: | ---------: | -------- | -------------- |
| Rule-Based     | High        |      95 |         95% |        1 ms |         ₹0 | Very Low | High           |
| Traditional ML | Medium/High | Depends |     Depends |        Fast |         ₹0 | Low      | Medium         |
| OpenAI LLM     | High        |     90+ |        High |      Medium |   API Cost | Very Low | Very High      |
| Local LLM      | High        | Depends | Medium/High | Medium/Slow |     ₹0 API | Medium   | High           |
| Hybrid         | High        |     90+ |        High |      Medium | Controlled | Medium   | Very High      |

---

## Current Observations

### Rule-Based

Strengths:

* Fastest
* Zero cost
* Highly explainable
* Good for obvious scam patterns

Weaknesses:

* Can miss new or subtle scam wording
* Requires manual rule updates

---

### Traditional ML

Strengths:

* Low cost
* Fast
* Measurable
* Works without external API

Weaknesses:

* Needs quality labelled dataset
* Limited explanation
* Needs retraining for new scam patterns

---

### OpenAI LLM

Strengths:

* Best natural language understanding
* Strong explanation
* Handles ambiguous messages well

Weaknesses:

* API cost
* External dependency
* Needs structured output validation

---

### Local LLM

Strengths:

* No hosted API cost
* Better privacy
* Good for local experimentation

Weaknesses:

* Requires local CPU/RAM
* Slower than rule-based and ML
* JSON output may need fallback handling

---

### Hybrid

Strengths:

* Best overall balance
* Combines deterministic signals with AI reasoning
* Better trust and explanation
* Good production-style design

Weaknesses:

* More complex
* Requires scoring strategy
* Needs more testing

---

## Next Improvements

### Dataset Improvements

* Add 1000+ labelled examples
* Add different scam categories
* Add hard-safe examples
* Add multilingual examples later
* Add real-world style message variations

### ML Improvements

* Improve TF-IDF n-gram settings
* Try Linear SVM
* Add cross-validation
* Track precision, recall, and F1
* Improve scam-type classification

### System Improvements

* Add compare-all output persistence
* Add evaluation dashboard
* Add false positive / false negative test cases
* Add cost and latency logs
* Add confidence calibration

---

## Final Evaluation Conclusion

Each approach solves the same scam detection problem differently.

The main learning is not only model usage.

The main learning is understanding trade-offs:

```txt
Rules = speed and explainability
ML = low-cost measurable classification
OpenAI LLM = reasoning and explanation
Local LLM = privacy and local control
Hybrid = practical production-style balance
```

The hybrid approach is currently the best overall architecture for this project because it combines reliability, explanation quality, and cost-aware decision-making.
