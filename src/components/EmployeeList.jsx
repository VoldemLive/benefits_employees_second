import React from "react"
import calculateBenefitsCost from "../logic/calculateBenefitsCost"

const EmployeeList = ({ employees, onEditEmployee, total }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Employees</h2>

      {employees.map((employee) => {
        const { annualCost, perPaycheckCost } = calculateBenefitsCost(employee)

        return (
          <div key={employee.id}>
            <div className="flex justify-between items-center">
              <div>
                <p className=" text-lg font-semibold">{employee.name}</p>
                <p>
                  Dependents:{" "}
                  {employee.dependents &&
                    employee.dependents.map((d) => d.name).join(", ")}
                </p>
                <p>Annual Cost: ${annualCost.toFixed(2)}</p>
                <p>Per Paycheck Cost: ${perPaycheckCost.toFixed(2)}</p>
              </div>
              <button
                onClick={() => onEditEmployee(employee)}
                data-testid={`edit-button-${employee.id}`}
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
        <h3 className="text-2xl font-semibold text-black text-right">
          Total : ${total}
        </h3>
      </div>
    </div>
  )
}

export default EmployeeList
