import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import * as XLSX from "xlsx";
import { InputGroup, FormControl, Dropdown, DropdownButton, ButtonGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

const TimesheetReport = () => {
  const [timesheet, setTimesheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("All Time");

  useEffect(() => {
    setLoading(true);
    axios({
      url: "http://localhost:8089/api/timesheet",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setTimesheet(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const exportToExcel = () => {
    let timerInterval;

    const filteredTimesheet = filterTimesheet();

    const sortedTimesheet = filteredTimesheet.sort((a, b) => {
      const nameA = a.employee?.name.toUpperCase();
      const nameB = b.employee?.name.toUpperCase();
      const nameComparison = nameA.localeCompare(nameB);

      if (nameComparison !== 0) {
        return nameComparison;
      }

      const dateA = new Date(a.dateentity?.datetb);
      const dateB = new Date(b.dateentity?.datetb);
      return dateA - dateB;
    });

    const data = sortedTimesheet.map((timesheet) => [
      timesheet.employee?.name,
      timesheet.dateentity?.datetb,
      formatTime(timesheet.start_time),
      formatTime(timesheet.end_time),
      timesheet.activity,
      timesheet.attendance,
      timesheet.status,
      timesheet.attendance === "Present" ? (new Date(timesheet.end_time) - new Date(timesheet.start_time)) / (1000 * 60 * 60) : 0,
    ]);

    const sheetTitle = `Timesheet ${selectedEmployee} ${selectedMonth !== "" ? months[selectedMonth] : ""} ${selectedYear !== "All Time" ? selectedYear : ""}`;

    const ws = XLSX.utils.aoa_to_sheet([
      [sheetTitle],
      [],
      ["Employee", "Date", "Start Time", "End Time", "Activity", "Attendance", "Status", "Hour "],
      ...data,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet Report");
    XLSX.writeFile(wb, "timesheet_report.xlsx");

    Swal.fire({
      title: "Hi There! Please wait a moment.",
      html: "Timesheet is Downloading in <b></b> milliseconds.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("It was closed by the timer");
      }
    });
  };

  const formatTime = (time) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    return new Date(time).toLocaleTimeString(undefined, options);
  };

  const filterTimesheet = () => {
    return timesheet.filter(
      (entry) =>
        entry.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedEmployee || entry.employee?.name === selectedEmployee) &&
        (selectedYear === "All Time" ||
          ((!selectedMonth || new Date(entry.dateentity?.datetb).getMonth() === parseInt(selectedMonth)) &&
          (!selectedYear || new Date(entry.dateentity?.datetb).getFullYear() === parseInt(selectedYear))))
    );
  };

  const showTable = () => {
    const filteredTimesheet = filterTimesheet();

    const sortedTimesheet = filteredTimesheet.sort((a, b) => {
      const nameA = a.employee?.name.toUpperCase();
      const nameB = b.employee?.name.toUpperCase();
      const nameComparison = nameA.localeCompare(nameB);

      if (nameComparison !== 0) {
        return nameComparison;
      }

      const dateA = new Date(a.dateentity?.datetb);
      const dateB = new Date(b.dateentity?.datetb);
      return dateA - dateB;
    });

    return sortedTimesheet.map((timesheet, i) => (
      <tr key={timesheet?.id}>
        <td>{i + 1}</td>
        <td>{timesheet.employee?.name}</td>
        <td>{timesheet.dateentity?.datetb}</td>
        <td>{formatTime(timesheet.start_time)}</td>
        <td>{formatTime(timesheet.end_time)}</td>
        <td>{timesheet.activity}</td>
        <td
          style={{
            color:
              timesheet.attendance === "Present"
                ? "#097969" 
                : timesheet.attendance === "Absence"
                ? "red"
                : timesheet.attendance === "Sick"
                ? "#E49B0F"
                : "red",
          }}
        >
          {timesheet.attendance}
        </td>
        <td
          style={{
            color:
              timesheet.status === "Approved"
                ? "#097969"
                : timesheet.status === "Rejected"
                ? "red"
                : "#E49B0F",
          }}
        >
          {timesheet.status}
        </td>
        <td>
          {timesheet.attendance === "Present" 
            ? ((new Date(timesheet.end_time) - new Date(timesheet.start_time)) / (1000 * 60 * 60)).toFixed(2)
            : 0}
        </td>
      </tr>
    ));
  };

  const employeeNames = [...new Set(timesheet.map((entry) => entry.employee?.name))];

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedMonth("");
  };

  const getChartData = () => {
    const filteredTimesheet = filterTimesheet().filter(
      (entry) => entry.attendance === "Present"
    );

    const dates = filteredTimesheet.map((entry) => entry.dateentity?.datetb);
    const hours = filteredTimesheet.map(
      (entry) => (new Date(entry.end_time) - new Date(entry.start_time)) / (1000 * 60 * 60)
    );
    const backgroundColors = hours.map(
      (hour) =>
        hour < 8 ? "rgba(255, 0, 0, 0.6)" : hour === 9 ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 193, 7, 0.6)"
    );

    return {
      labels: dates,
      datasets: [
        {
          label: "Hours Worked",
          data: hours,
          backgroundColor: backgroundColors,
        },
      ],
    };
  };

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = ["All Time", ...new Set(timesheet.map((entry) => new Date(entry.dateentity?.datetb).getFullYear()))];

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ color: "cyan" }}>
        <b>
          <ClipLoader
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="override"
          />
        </b>
      </p>
      <ButtonGroup style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <DropdownButton
          id="dropdown-basic-button"
          title={selectedEmployee || "Select Employee"}
          onSelect={handleEmployeeSelect}
        >
          <InputGroup className="mb-3" style={{ maxWidth: "300px" }}>
            <FormControl
              placeholder="Search by Employee Name"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          {employeeNames.map((name) => (
            <Dropdown.Item key={name} eventKey={name}>
              {name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          id="dropdown-basic-button"
          title={selectedMonth ? months[selectedMonth] : "Select Month"}
          onSelect={handleMonthSelect}
          disabled={selectedYear === "All Time"}
        >
          {months.map((month, index) => (
            <Dropdown.Item key={index} eventKey={index.toString()}>
              {month}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          id="dropdown-basic-button"
          title={selectedYear || "Select Year"}
          onSelect={handleYearSelect}
        >
          {years.map((year) => (
            <Dropdown.Item key={year} eventKey={year.toString()}>
              {year}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </ButtonGroup>
      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button onClick={exportToExcel} className="btn btn-primary">
          Export to Excel
        </button>
      </div>
      <div style={{ display: "flex", marginTop: "20px" }}>
        <Table striped bordered hover size="sm" style={{ marginRight: "20px", flex: 1 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Activity</th>
              <th>Attendance</th>
              <th>Status</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>{showTable()}</tbody>
        </Table>
        {selectedEmployee && selectedYear !== "All Time" && (
          <div style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
            <Bar data={getChartData()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimesheetReport;
