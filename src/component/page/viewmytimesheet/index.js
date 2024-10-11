import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { FormControl, InputGroup, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import "./index.css";

function ViewmyTimesheet() {
  const [timesheet, setTimesheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTimesheetId, setEditingTimesheetId] = useState(null);
  const [editActivity, setEditActivity] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");
  const [currentFilter, setCurrentFilter] = useState("today");

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
        const fetchedTimesheets = response.data.results.map((timesheet) => ({
          ...timesheet,
          employee: {
            id: timesheet.employee.id,
            name: timesheet.employee.name,
          },
          dateentity: {
            id: timesheet.dateentity.id,
            datetb: timesheet.dateentity.datetb,
          },
        }));
        setTimesheet(fetchedTimesheets);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const todayDate = new Date().toISOString().split("T")[0];
  const x = localStorage.getItem("Name");
  
  const filteredTimesheet = timesheet.filter((ts) => {
    if (currentFilter === "today") {
      return ts.employee?.name === x && ts.dateentity?.datetb === todayDate;
    }
    return ts.employee?.name === x;
  });

  const sortedTimesheet = filteredTimesheet.sort((a, b) => {
    return new Date(a.dateentity?.datetb) - new Date(b.dateentity?.datetb);
  });

  const formatTime = (time) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    return new Date(time).toLocaleTimeString(undefined, options);
  };

  let timerInterval;
  const exportToExcel = () => {
    const data = sortedTimesheet.map((timesheet) => [
      timesheet.employee?.name,
      timesheet.dateentity?.datetb,
      formatTime(timesheet.start_time),
      formatTime(timesheet.end_time),
      timesheet.activity,
      timesheet.attendance,
      timesheet.status,
      (new Date(timesheet.end_time) - new Date(timesheet.start_time)) /
        (1000 * 60 * 60),
    ]);

    // Hitung total hours menggunakan reduce
    const totalHours = filteredTimesheet.reduce((total, timesheet) => {
      if (timesheet.status === "Approved") {
        return (
          total +
          (new Date(timesheet.end_time) - new Date(timesheet.start_time)) /
            (1000 * 60 * 60)
        );
      }
      return total;
    }, 0);

    // Menambahkan baris untuk total hours
    data.push(["", "", "", "", "", "", "Total Hours", totalHours]);

    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Employee",
        "Date",
        "Start",
        "End",
        "Activity",
        "Attendance",
        "Status",
        "Hour",
      ],
      ...data,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet Report");
    XLSX.writeFile(wb, "timesheet.xlsx");

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

  const handleEdit = (timesheet) => {
    setEditingTimesheetId(timesheet.id);
    const currentDate = new Date();
    const timeString = currentDate.toTimeString().slice(0, 5); // Set current time
    setCurrentEndTime(timeString);
    setEditActivity(timesheet.activity || "");
  };


  const handleSave = () => {
    const timesheetToUpdate = timesheet.find(
      (ts) => ts.id === editingTimesheetId
    );

    const updatedData = {
      id: editingTimesheetId,
      employee: { id: timesheetToUpdate.employee.id },
      dateentity: { id: timesheetToUpdate.dateentity.id },
      start_time: timesheetToUpdate.start_time,
      end_time: `${timesheetToUpdate.dateentity.datetb}T${currentEndTime}:00`, // Set end time with current time
      activity: editActivity,
      attendance: timesheetToUpdate.attendance,
      status: timesheetToUpdate.status,
      updateType: "update", // Custom flag to indicate it's an update
    };

    axios
      .post(`http://localhost:8089/api/timesheet`, updatedData)
      .then((response) => {
        setTimesheet((prev) =>
          prev.map((item) =>
            item.id === editingTimesheetId ? { ...item, ...updatedData } : item
          )
        );
        setEditingTimesheetId(null);
        Swal.fire("Success", "Timesheet updated successfully", "success");
        console.log(updatedData)
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", "Failed to update timesheet", "error");
      });
  };

  const showTable = () => {
    return sortedTimesheet.map((timesheet, i) => (
      <tr key={timesheet.id}>
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
          {editingTimesheetId === timesheet.id ? (
            <>
              <InputGroup className="mb-3">
                <FormControl type="text" value={currentEndTime} readOnly />
                <FormControl
                  type="text"
                  placeholder="Activity, Presentase Pekerjaan (%)"
                  value={editActivity}
                  onChange={(e) => setEditActivity(e.target.value)}
                />
                <Button variant="success" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setEditingTimesheetId(null)}
                >
                  Cancel
                </Button>
              </InputGroup>
            </>
          ) : (
            <>
              {new Date(timesheet.dateentity?.datetb)
                .toISOString()
                .split("T")[0] === todayDate && (
                <Button
                  variant="warning"
                  onClick={() => handleEdit(timesheet)}
                  style={{ marginRight: "5px" }}
                >
                 Finish Timesheet
                </Button>
              )}
            </>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="filter-buttons">
        <Button
          onClick={() => setCurrentFilter("today")}
          variant={currentFilter === "today" ? "primary" : "secondary"}
        >
          Today
        </Button>
        <Button
          onClick={() => setCurrentFilter("all")}
          variant={currentFilter === "all" ? "primary" : "secondary"}
        >
          All Time
        </Button>
      </div>
      <p style={{ color: "red" }}>
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
      <button
        onClick={exportToExcel}
        style={{ textAlign: "right", marginTop: "10px" }}
      >
        Export to Excel
      </button>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{showTable()}</tbody>
      </Table>
    </div>
  );
}

export default ViewmyTimesheet;
