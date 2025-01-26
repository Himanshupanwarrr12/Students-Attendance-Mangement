import React, { useState, useEffect } from "react"

const StudentTrackerMonthly = () => {
  const [students, setStudents] = useState([])
  const [newStudent, setNewStudent] = useState({ name: "", class: "", amount: "" })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState("")
  const [studentListSearchTerm, setStudentListSearchTerm] = useState("")
  const [feeFilter, setFeeFilter] = useState("all")

  useEffect(() => {
    // Initialize with some sample data
    setStudents([
      { id: 1, name: "Himanshu", class: "12", amount: 1000, feesPaid: true, attendance: {} },
      { id: 2, name: "Rahul", class: "11", amount: 800, feesPaid: false, attendance: {} },
    ])
  }, [])

  const addStudent = (e) => {
    e.preventDefault()
    if (newStudent.name && newStudent.class && newStudent.amount) {
      setStudents([
        ...students,
        {
          id: students.length + 1,
          name: newStudent.name,
          class: newStudent.class,
          amount: Number.parseFloat(newStudent.amount),
          feesPaid: false,
          attendance: {},
        },
      ])
      setNewStudent({ name: "", class: "", amount: "" })
    }
  }

  const toggleFeeStatus = (id) => {
    setStudents(students.map((student) => (student.id === id ? { ...student, feesPaid: !student.feesPaid } : student)))
  }

  const toggleAttendance = (studentId, date) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? {
              ...student,
              attendance: {
                ...student.attendance,
                [date]: !student.attendance[date],
              },
            }
          : student,
      ),
    )
  }

  const removeStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id))
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  const getTotalAttendance = (studentId) => {
    const student = students.find((s) => s.id === studentId)
    if (!student) return 0
    const currentMonthDates = Object.keys(student.attendance).filter(
      (date) => new Date(date).getMonth() === currentMonth.getMonth(),
    )
    return currentMonthDates.filter((date) => student.attendance[date]).length
  }

  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name))

  const filteredAttendanceStudents = sortedStudents.filter((student) =>
    student.name.toLowerCase().includes(attendanceSearchTerm.toLowerCase()),
  )

  const filteredStudentList = sortedStudents.filter((student) => {
    const nameMatch = student.name.toLowerCase().includes(studentListSearchTerm.toLowerCase())
    const feeMatch =
      feeFilter === "all" || (feeFilter === "paid" && student.feesPaid) || (feeFilter === "unpaid" && !student.feesPaid)
    return nameMatch && feeMatch
  })

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const dates = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
      return formatDate(date)
    })

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Student</th>
              {dates.map((date) => (
                <th key={date} className="px-4 py-2 border">
                  {new Date(date).getDate()}
                </th>
              ))}
              <th className="px-4 py-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendanceStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-2 border font-medium">{student.name}</td>
                {dates.map((date) => (
                  <td key={date} className="px-4 py-2 border text-center">
                    <input
                      type="checkbox"
                      checked={student.attendance[date] || false}
                      onChange={() => toggleAttendance(student.id, date)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                ))}
                <td className="px-4 py-2 border text-center font-bold">{getTotalAttendance(student.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Student Tracker (Monthly)</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section - Attendance */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Monthly Attendance</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0"
              >
                Previous Month
              </button>
              <h3 className="text-xl font-semibold my-2">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </h3>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Next Month
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search students for attendance..."
                value={attendanceSearchTerm}
                onChange={(e) => setAttendanceSearchTerm(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {renderCalendar()}
          </div>
        </div>

        {/* Right Section - Add New Student Form and Student List */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Student Management</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold mt-8 mb-2">Add New Student</h3>
            <form onSubmit={addStudent} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div>
                <label htmlFor="class" className="block text-gray-700 text-sm font-bold mb-2">
                  Class
                </label>
                <input
                  type="text"
                  id="class"
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter class"
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
                  Fee Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={newStudent.amount}
                  onChange={(e) => setNewStudent({ ...newStudent, amount: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter fee amount"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Add Student
              </button>
            </form>

            <h3 className="text-xl font-semibold mb-2">Student List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fees Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudentList.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{student.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeeStatus(student.id)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            student.feesPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.feesPaid ? "Paid" : "Unpaid"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => removeStudent(student.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentTrackerMonthly
