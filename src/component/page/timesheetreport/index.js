import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import * as XLSX from "xlsx";
import { InputGroup, FormControl } from "react-bootstrap";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";

const TimesheetReport = () => {
  const [timesheet, setTimesheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    const filteredTimesheet = timesheet.filter((entry) =>
      entry.employee?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    let timerInterval;
    const data = sortedTimesheet.map(
      (timesheet) => [
        timesheet.employee?.name,
        timesheet.dateentity?.datetb,
        formatTime(timesheet.start_time),
        formatTime(timesheet.end_time),
        timesheet.activity,
        timesheet.attendance,
        timesheet.status,
        (new Date(timesheet.end_time) - new Date(timesheet.start_time)) /
          (1000 * 60 * 60),
      ],
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
      })
    );

    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Employee",
        "Date",
        "Start Time",
        "End Time",
        "Activity",
        "Attendance",
        "Status",
        "Hour ",
      ],
      ...data,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet Report");
    XLSX.writeFile(wb, "timesheet_report.xlsx");
  };

  const formatTime = (time) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    return new Date(time).toLocaleTimeString(undefined, options);
  };

  const showTable = () => {
    const filteredTimesheet = timesheet.filter((entry) =>
      entry.employee?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
      </tr>
    ));
  };

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ color: "cyan" }}>
        <b>
          {" "}
          <ClipLoader
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="override"
          />
        </b>
        <InputGroup className="mb-3" style={{ maxWidth:"300px", marginLeft: "1100px" }}>
          <FormControl
            placeholder="Search by Employee Name"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </p>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button onClick={exportToExcel}>Export to Excel</button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Employee</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Activity</th>
            <th>Attendance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{showTable()}</tbody>
      </Table>
    </div>
  );
};

export default TimesheetReport;
