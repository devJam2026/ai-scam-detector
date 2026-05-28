# Traditional ML Approach (Updated)

Overview

- The `ml_classifier` analyzer runs a local Python process to classify text using feature-based models.
- Implemented in: `src/services/ml-classifier/mlClassifierAnalyzer.ts`.

Key points

- Good for low-latency local inference and explainability (feature importance).
- Requires a trained model and labeled data to be useful in practice.

Learning outcomes

- Building a simple local inference pipeline
- Normalizing ML outputs to the same API contract as LLM outputs

Practical ideas

- Add training scripts and model artifact storage
- Use model explainability (e.g. SHAP) for feature insights
- Consider embeddings or hybrid features to improve generalization
