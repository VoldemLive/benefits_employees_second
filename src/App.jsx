import React, { useState, useEffect, useRef } from "react"
import initialData from "./data/initialData.json"
import EmployeeList from "./components/EmployeeList"
import EmployeeEditor from "./components/EmployeeEditor"
import calculateBenefitsCost from "./logic/calculateBenefitsCost"

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
  const myEditingComponentRef = useRef(null)

  const scrollToMyEditing = () => {
    if (myEditingComponentRef.current) {
      const offsetTop = myEditingComponentRef.current.offsetTop
      const offset = 100

      window.scrollTo({
        top: offsetTop - offset,
        behavior: "smooth",
      })
    }
  }

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
    scrollToMyEditing()
    setIsEditorOpen(true)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    setEditingEmployee(null)
  }

  const validateDependents = (dependents) => {
    const nnn = dependents.reduce((acc, item) => {
      if (item.name.length > 0) acc.push(item)
      return acc
    }, [])
    return nnn
  }

  const addEmployee = (name, departmentId, dependents) => {
    const newEmployee = {
      id: data.employees.length + 1,
      name,
      departmentId: parseInt(departmentId),
      dependents: validateDependents(dependents),
    }
    setData((prevData) => ({
      ...prevData,
      employees: [...prevData.employees, newEmployee],
    }))
    closeEditor()
  }

  const editEmployee = (name, departmentId, dependents, id) => {
    const updatedEmployee = {
      id,
      name,
      departmentId: parseInt(departmentId),
      dependents: validateDependents(dependents),
    }
    setData((prevData) => ({
      ...prevData,
      employees: prevData.employees.map((employee) =>
        employee.id === id ? updatedEmployee : employee
      ),
    }))
    setEditingEmployee(null)
    closeEditor()
  }

  const startEditingEmployee = (employee) => {
    setEditingEmployee(employee)
    openEditor()
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
    <div className="container mx-auto px-1 sm:px-4">
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
          data-testid="department-select"
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

      <div className="flex flex-col md:flex-row gap-4">
        <div ref={myEditingComponentRef} className="w-full">
          {isEditorOpen && (
            <EmployeeEditor
              onAddOrEditEmployee={editingEmployee ? editEmployee : addEmployee}
              editingEmployee={editingEmployee}
              departments={data.departments}
              onClose={closeEditor}
            />
          )}
        </div>

        <div className="w-full">
          <EmployeeList
            employees={
              selectedDepartmentId ? filteredEmployees : data.employees
            }
            onEditEmployee={startEditingEmployee}
            total={calculateTotalCostByDepartment().toFixed(2)}
          />
        </div>
      </div>
    </div>
  )
}

export default App
