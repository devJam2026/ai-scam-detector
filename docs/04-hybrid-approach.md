# Hybrid Approach

## Overview

This document describes a hybrid approach to scam detection that combines multiple techniques for optimal performance.

## Architecture

- **Primary Layer**: Traditional ML for fast filtering
- **Secondary Layer**: Local LLM for detailed analysis
- **Fallback Layer**: OpenAI API for edge cases
- **Confidence Threshold**: Dynamic routing based on scores

## Key Features

- Balanced cost and performance
- Redundancy and failover capabilities
- Context-aware classification
- Adaptive confidence thresholds

## Implementation Details

### Detection Pipeline

1. **Stage 1: Fast Filter** (Traditional ML)
   - Quick classification with Random Forest
   - Identify obvious scams/non-scams
   - Route uncertain cases to Stage 2

2. **Stage 2: Detailed Analysis** (Local LLM)
   - In-depth contextual understanding
   - Complex pattern recognition
   - Explainability

3. **Stage 3: Premium Analysis** (OpenAI API)
   - Handle edge cases
   - Low-confidence samples
   - Continuous learning feedback

### Decision Flow

```
Input
  ↓
[ML Filter]
  ├─→ High confidence (>0.9) → Output
  ├─→ Medium confidence (0.5-0.9) → [Local LLM]
  └─→ Low confidence (<0.5) → [OpenAI API]

[Local LLM]
  ├─→ Agrees with ML → Output
  └─→ Disagrees → [OpenAI API] for arbitration

[OpenAI API]
  └─→ Final decision
```

## Advantages

- Cost-effective (ML handles 80% of cases)
- Low latency for most requests
- Privacy-preserving for common cases
- High accuracy through multi-model consensus
- Graceful degradation with fallbacks
- Better explainability than single models

## Disadvantages

- Increased complexity
- Multiple models to maintain
- Orchestration overhead
- Potential routing artifacts

## Performance Metrics

- Average Accuracy: TBD
- Average Response Time: TBD
- Cost per Request: TBD
- API call reduction: TBD

## Routing Strategy

### Confidence Thresholds

- **Very High (>0.95)**: Direct output
- **High (0.85-0.95)**: Optional LLM validation
- **Medium (0.5-0.85)**: LLM analysis mandatory
- **Low (<0.5)**: OpenAI API consultation

### Cost Optimization

- ~80% handled by ML (near-zero cost)
- ~15% handled by Local LLM (compute cost only)
- ~5% handled by OpenAI API (highest cost)

## Implementation

### Components

1. ML Pipeline Module
2. Local LLM Interface
3. OpenAI API Client
4. Routing Logic
5. Result Aggregator

### Configuration

```yaml
hybrid:
  stage1:
    enabled: true
    model: random_forest
    threshold_high: 0.9
    threshold_low: 0.5

  stage2:
    enabled: true
    model: mistral
    timeout: 5000

  stage3:
    enabled: true
    model: gpt-4
    max_calls_per_hour: 100
```

## Monitoring & Optimization

- Track routing decisions
- Monitor accuracy by stage
- Cost tracking per request type
- Model performance comparison

## Usage Example

```python
# Example implementation
```

## References

- All relevant documentation from other approaches
- Multi-model ensemble techniques
