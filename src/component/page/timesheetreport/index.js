import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import * as XLSX from "xlsx";
import { InputGroup, FormControl } from "react-bootstrap";

const TimesheetReport = () => {
  const [timesheet, setTimesheet] = useState([]);
  const [loading, setLoading] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading("Loading data...");
    axios({
      url: "http://localhost:8089/api/timesheet",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setTimesheet(response.data.results);
        setLoading("");
      })
      .catch((error) => {
        console.error(error);
        setLoading("Error");
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

    const data = sortedTimesheet.map((timesheet) => [
      timesheet.employee?.name,
      timesheet.dateentity?.datetb,
      formatTime(timesheet.start_time),
      formatTime(timesheet.end_time),
      timesheet.activity,
      timesheet.attendance,
      timesheet.status,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Employee",
        "Date",
        "Start Time",
        "End Time",
        "Activity",
        "Attendance",
        "Status",
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
        <td>{timesheet.attendance}</td>
        <td>{timesheet.status}</td>
      </tr>
    ));
  };

  return (
    <div style={{ marginLeft: '250px', padding: '20px' }}>
      <p style={{ color: "cyan" }}>
        <b>{loading}</b>
        <InputGroup className="mb-3">
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
