import React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import EmployeeEditor from "../components/EmployeeEditor"

describe("EmployeeEditor Component", () => {
  const mockOnAddOrEditEmployee = jest.fn()
  const mockOnClose = jest.fn()
  const departments = [{ id: "1", name: "Development" }]

  test("allows entry of employee name and department", () => {
    render(
      <EmployeeEditor
        onAddOrEditEmployee={mockOnAddOrEditEmployee}
        onClose={mockOnClose}
        departments={departments}
      />
    )

    fireEvent.change(screen.getByLabelText("Employee Name"), {
      target: { value: "John Doe" },
    })
    fireEvent.change(screen.getByLabelText("Department"), {
      target: { value: "1" },
    })

    expect(screen.getByLabelText("Employee Name").value).toBe("John Doe")
    expect(screen.getByLabelText("Department").value).toBe("1")
  })

  test("allows adding and removing dependents", () => {
    render(
      <EmployeeEditor
        onAddOrEditEmployee={mockOnAddOrEditEmployee}
        onClose={mockOnClose}
        departments={departments}
      />
    )

    fireEvent.click(screen.getByText("Add Dependent"))
    expect(screen.getAllByPlaceholderText("Dependent Name").length).toBe(1)

    fireEvent.click(screen.getAllByText("Remove")[0])
    expect(screen.queryByPlaceholderText("Dependent Name")).toBeNull()
  })

  test("submits the form with correct data", () => {
    render(
      <EmployeeEditor
        onAddOrEditEmployee={mockOnAddOrEditEmployee}
        onClose={mockOnClose}
        departments={departments}
      />
    )

    fireEvent.change(screen.getByLabelText("Employee Name"), {
      target: { value: "John Doe" },
    })
    fireEvent.change(screen.getByLabelText("Department"), {
      target: { value: "1" },
    })
    fireEvent.click(screen.getByTestId("submit-button"))

    expect(mockOnAddOrEditEmployee).toHaveBeenCalledWith(
      "John Doe",
      "1",
      [],
      ""
    )
  })
  test("closes the form", () => {
    render(
      <EmployeeEditor
        onAddOrEditEmployee={mockOnAddOrEditEmployee}
        onClose={mockOnClose}
        departments={departments}
      />
    )
    fireEvent.click(screen.getByTestId("close-button"))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
