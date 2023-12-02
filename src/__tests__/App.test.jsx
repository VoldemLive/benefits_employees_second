import React from "react"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import App from "../App"

window.scrollTo = jest.fn()

describe("App Component", () => {
  test("filters employees by department correctly", async () => {
    render(<App />)
    const departmentSelect = screen.getByTestId("department-select")
    fireEvent.change(departmentSelect, { target: { value: "1" } })

    await waitFor(() => {
      const allAliceItems = screen.getAllByText("Alice")
      expect(allAliceItems.length).toBe(1)
      expect(allAliceItems[0]).toBeInTheDocument()
    })

    expect(screen.queryByText("Nathan")).not.toBeInTheDocument()
  })
  test("adds a new employee correctly", async () => {
    render(<App />)

    fireEvent.click(screen.getByText("Add Employee"))
    fireEvent.change(screen.getByLabelText("Employee Name"), {
      target: { value: "John Doe" },
    })
    fireEvent.change(screen.getByLabelText("Department"), {
      target: { value: "1" },
    })

    fireEvent.click(screen.getByTestId("submit-button"))
    expect(screen.getByText("John Doe")).toBeInTheDocument()
  })
  test("opens and closes the employee editor interface", () => {
    render(<App />)

    expect(screen.queryByText("Employee Name")).not.toBeInTheDocument()

    fireEvent.click(screen.getByText("Add Employee"))

    expect(screen.getByText("Employee Name")).toBeInTheDocument()
    expect(screen.getByText("Department")).toBeInTheDocument()
    expect(screen.getByText("Add Dependent")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Close"))

    expect(screen.queryByText("Employee Name")).not.toBeInTheDocument()
  })
  test("edits an employee correctly", () => {
    render(<App />)
    fireEvent.click(screen.getByTestId("edit-button-5"))

    const nameInput = screen.getByLabelText("Employee Name")
    expect(nameInput.value).toBe("Nathan")

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } })

    fireEvent.click(screen.getByTestId("submit-button"))
    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    expect(screen.queryByText("Nathan")).not.toBeInTheDocument()
  })
})
