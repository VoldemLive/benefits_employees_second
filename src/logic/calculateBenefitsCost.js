export const calculateBenefitsCost = (employee) => {
  const annualEmployeeCost = 1000
  const annualDependentCost = 500
  const paychecksPerYear = 26

  const discount = (name) => (name?.startsWith("A") ? 0.9 : 1)

  let totalAnnualCost = annualEmployeeCost * discount(employee.name)
  if (employee.dependents && Array.isArray(employee.dependents)) {
    totalAnnualCost += employee.dependents.reduce(
      (total, dependent) =>
        total + annualDependentCost * discount(dependent.name),
      0
    )
  }

  const costPerPaycheck = totalAnnualCost / paychecksPerYear
  return { annualCost: totalAnnualCost, perPaycheckCost: costPerPaycheck }
}

export default calculateBenefitsCost
