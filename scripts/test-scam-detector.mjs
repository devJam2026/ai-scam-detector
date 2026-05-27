import fs from 'fs'

const testCases = JSON.parse(fs.readFileSync('./data/test-cases.json', 'utf-8'))

const API_URL = 'http://localhost:3000/api/analyze-scam'

let passed = 0
let failed = 0

function isRiskAcceptable(actual, expected) {
  const order = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

  const actualIndex = order.indexOf(actual)
  const expectedIndex = order.indexOf(expected)

  if (actualIndex === -1 || expectedIndex === -1) {
    return false
  }

  // Allow one-level difference because LLM classification may vary slightly.
  return Math.abs(actualIndex - expectedIndex) <= 1
}

for (const testCase of testCases) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: testCase.message,
    }),
  })

  const result = await response.json()

  const riskOk = isRiskAcceptable(result.riskLevel, testCase.expectedRiskLevel)

  const categoryOk = result.category === testCase.expectedCategory

  if (riskOk && categoryOk) {
    passed++
    console.log(`✅ ${testCase.id}`)
  } else {
    failed++
    console.log(`❌ ${testCase.id}`)
    console.log('Expected:', {
      riskLevel: testCase.expectedRiskLevel,
      category: testCase.expectedCategory,
    })
    console.log('Actual:', {
      riskLevel: result.riskLevel,
      category: result.category,
      summary: result.summary,
    })
  }
}

console.log('\nTest Summary')
console.log('------------')
console.log(`Passed: ${passed}`)
console.log(`Failed: ${failed}`)
console.log(`Total: ${testCases.length}`)
