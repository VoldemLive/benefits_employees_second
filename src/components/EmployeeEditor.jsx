import React, { useState, useEffect } from "react"

const EmployeeEditor = ({
  onAddOrEditEmployee,
  editingEmployee,
  departments,
  onClose,
}) => {
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [dependents, setDependents] = useState([])

  useEffect(() => {
    if (editingEmployee) {
      setId(editingEmployee.id)
      setName(editingEmployee.name)
      setDepartmentId(editingEmployee.departmentId.toString())
      setDependents(editingEmployee.dependents || [])
    } else {
      setName("")
      setDepartmentId("")
      setDependents([])
    }
  }, [editingEmployee])

  const handleAddDependent = () => {
    setDependents([...dependents, { name: "", relation: "" }])
  }

  const handleDependentChange = (index, field, value) => {
    const updatedDependents = dependents.map((dependent, i) => {
      if (i === index) {
        return { ...dependent, [field]: value }
      }
      return dependent
    })
    setDependents(updatedDependents)
  }

  const handleRemoveDependent = (index) => {
    setDependents(dependents.filter((_, i) => i !== index))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (name && departmentId) {
      onAddOrEditEmployee(name, departmentId, dependents, id)
      setName("")
      setDepartmentId("")
      setDependents([])
    } else {
      console.log("Employee data is incomplete")
    }
  }

  const handleClose = (e) => {
    e.preventDefault()
    onClose()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      {/* Name Input */}
      <div className="mb-4 relative">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="employee-name"
        >
          Employee Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="employee-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Employee Name"
        />
      </div>

      {/* Department Select */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="department"
        >
          Department
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="department"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dependents Input */}
      {dependents.map((dependent, index) => (
        <div
          key={index}
          className="flex relative overflow-clip items-center mb-4"
        >
          <div className="flex flex-wrap gap-2">
            <input
              className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700"
              type="text"
              placeholder="Dependent Name"
              value={dependent.name}
              onChange={(e) =>
                handleDependentChange(index, "name", e.target.value)
              }
            />
            <input
              className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700"
              type="text"
              placeholder="Relation"
              value={dependent.relation}
              onChange={(e) =>
                handleDependentChange(index, "relation", e.target.value)
              }
            />
          </div>
          <div className="flex">
            <button
              className="ml-2 h-full text-white bg-red-500 hover:bg-red-700 font-bold py-1 px-2 rounded"
              type="button"
              onClick={() => handleRemoveDependent(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        type="button"
        onClick={handleAddDependent}
      >
        Add Dependent
      </button>

      {/* Submit Button */}
      <div className="mt-6 flex gap-2">
        <button
          data-testid="submit-button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {editingEmployee ? "Update" : "Add"} Employee
        </button>
        <button
          data-testid="close-button"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </form>
  )
}

export default EmployeeEditor
