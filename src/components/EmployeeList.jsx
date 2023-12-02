import React from "react"

const EmployeeList = ({ employees, onEditEmployee, total }) => {
  const calculateBenefitsCost = (employee) => {
    const annualEmployeeCost = 1000
    const annualDependentCost = 500
    const paychecksPerYear = 26

    const discount = (name) => {
      if (!name) {
        return 1
      }
      return name.startsWith("A") ? 0.9 : 1
    }

    let totalAnnualCost = annualEmployeeCost * discount(employee.name)

    if (employee.dependents && Array.isArray(employee.dependents)) {
      totalAnnualCost += employee.dependents.reduce((total, dependent) => {
        return total + annualDependentCost * discount(dependent.name)
      }, 0)
    }

    const costPerPaycheck = totalAnnualCost / paychecksPerYear
    return {
      annualCost: totalAnnualCost,
      perPaycheckCost: costPerPaycheck,
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Employees</h2>

      {employees.map((employee) => {
        const { annualCost, perPaycheckCost } = calculateBenefitsCost(employee)

        return (
          <div key={employee.id}>
            <div className="flex justify-between items-center">
              <div>
                <p>
                  {employee.name} - Dependents:{" "}
                  {employee.dependents &&
                    employee.dependents.map((d) => d.name).join(", ")}
                </p>
                <p>Annual Cost: ${annualCost.toFixed(2)}</p>
                <p>Per Paycheck Cost: ${perPaycheckCost.toFixed(2)}</p>
              </div>
              <button
                onClick={() => onEditEmployee(employee)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          </div>
        )
      })}
      <div>
        <h3 className=" text-lg font-semibold text-black text-right">
          Total : ${total}
        </h3>
      </div>
    </div>
  )
}

export default EmployeeList
