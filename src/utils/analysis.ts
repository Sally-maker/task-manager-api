interface AnalysisResult {
  somaPares: number
  mediaImpares: number
}

export function analyzeNumbers(input: unknown[]): AnalysisResult {
  let evenSum = 0
  let oddSum = 0
  let oddCount = 0

  for (const value of input) {
    if (typeof value !== 'number' || !Number.isInteger(value)) continue

    if (value % 2 === 0) {
      evenSum += value
    } else {
      oddSum += value
      oddCount++
    }
  }

  return {
    somaPares: evenSum,
    mediaImpares: oddCount > 0 ? oddSum / oddCount : 0,
  }
}
