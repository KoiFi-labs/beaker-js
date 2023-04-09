// convert micro to standard
export const microToStandard: (number: number) => number = (micro: number) => {
  return micro / 1000000
}

export const compareWithTolerance: (num1: number, num2: number, tolerance?: number) => boolean =
(num1: number, num2: number, tolerance?: number) => {
  tolerance = tolerance || 0.005
  const difference = Math.abs(num1 - num2)
  const average = (num1 + num2) / 2
  const calculatedTolerance = average * tolerance
  return difference <= calculatedTolerance
}
