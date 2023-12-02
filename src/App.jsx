import React, { useState, useEffect } from "react"
import initialData from "./data/initialData.json"
import EmployeeList from "./components/EmployeeList"
import EmployeeEditor from "./components/EmployeeEditor"

const App = () => {
  const loadData = () => {
    const savedData = localStorage.getItem("employeeData")
    return savedData ? JSON.parse(savedData) : initialData
  }

  const saveData = (dataToSave) => {
    localStorage.setItem("employeeData", JSON.stringify(dataToSave))
  }

  const [data, setData] = useState(loadData())
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("")
  useEffect(() => {
    saveData(data)
  }, [data])

  const handleDepartmentChange = (e) => {
    setSelectedDepartmentId(e.target.value)
  }

  const filteredEmployees = selectedDepartmentId
    ? data.employees.filter(
        (employee) => employee.departmentId.toString() === selectedDepartmentId
      )
    : data.employees

  const openEditor = () => {
    setIsEditorOpen(true)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    setEditingEmployee(null)
  }

  const addEmployee = (name, departmentId, dependents) => {
    if (isEditorOpen) {
      closeEditor()
      return
    }
    const newEmployee = {
      id: data.employees.length + 1,
      name,
      departmentId: parseInt(departmentId),
      dependents,
    }
    setData((prevData) => ({
      ...prevData,
      employees: [...prevData.employees, newEmployee],
    }))
    closeEditor()
  }

  const editEmployee = (updatedEmployee) => {
    setData((prevData) => ({
      ...prevData,
      employees: prevData.employees.map((employee) =>
        employee.id === editingEmployee.id ? updatedEmployee : employee
      ),
    }))
    setEditingEmployee(null)
    closeEditor()
  }

  const startEditingEmployee = (employee) => {
    setEditingEmployee(employee)
    openEditor()
  }

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

  const calculateTotalCostByDepartment = () => {
    const employeesToCalculate = selectedDepartmentId
      ? filteredEmployees
      : data.employees
    return employeesToCalculate.reduce((total, employee) => {
      const { annualCost } = calculateBenefitsCost(employee)
      return total + annualCost
    }, 0)
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-4">
        Employee Benefits Calculator
      </h1>
      <div>
        <h3 className="text-black/30 text-right">
          Total: ${calculateTotalCostByDepartment().toFixed(2)}
        </h3>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Department
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedDepartmentId}
          onChange={handleDepartmentChange}
        >
          <option value="">All Departments</option>
          {data.departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <button
          onClick={openEditor}
          className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isEditorOpen && (
          <EmployeeEditor
            onAddOrEditEmployee={editingEmployee ? editEmployee : addEmployee}
            editingEmployee={editingEmployee}
            departments={data.departments}
            onClose={closeEditor}
          />
        )}

        <EmployeeList
          employees={selectedDepartmentId ? filteredEmployees : data.employees}
          onEditEmployee={startEditingEmployee}
          total={calculateTotalCostByDepartment().toFixed(2)}
        />
      </div>
    </div>
  )
}

export default App
