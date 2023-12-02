import { calculateBenefitsCost } from "../logic/calculateBenefitsCost"

describe("calculateBenefitsCost", () => {
  test("calculates cost for employee without dependents", () => {
    const employee = { name: "John", dependents: [] }
    const result = calculateBenefitsCost(employee)
    expect(result.annualCost).toBe(1000)
    expect(result.perPaycheckCost).toBeCloseTo(1000 / 26)
  })

  test("calculates cost for employee with dependents", () => {
    const employee = {
      name: "John",
      dependents: [{ name: "Dependent1" }, { name: "Dependent2" }],
    }
    const result = calculateBenefitsCost(employee)
    expect(result.annualCost).toBe(2000) // 1000 for employee + 500*2 for dependents
    expect(result.perPaycheckCost).toBeCloseTo(2000 / 26)
  })

  test('applies discount for names starting with "A"', () => {
    const employee = { name: "Alice", dependents: [{ name: "Andy" }] }
    const result = calculateBenefitsCost(employee)
    expect(result.annualCost).toBeLessThan(1000 + 500) // Discounts applied
  })
})
