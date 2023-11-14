import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FormControl, InputGroup } from "react-bootstrap";
import * as XLSX from "xlsx";
import Button from "react-bootstrap";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import "./index.css";

function ViewmyTimesheet() {
  const [timesheet, setTimesheet] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    axios({
      url: "http://localhost:8089/api/timesheet",
      method: "GET",
      data: JSON.stringify(timesheet),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setTimesheet(response.data.results);
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [timesheet.status]);

  let x = localStorage.getItem("Name");
  console.log(x);
  const filterstatus = timesheet.filter(
    (timesheet) => timesheet.employee?.name === x.toString()
  );
  const sortedFilterStatus = filterstatus.sort((a, b) => {
    return new Date(a.dateentity?.datetb) - new Date(b.dateentity?.datetb);
  });
  const formatTime = (time) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    return new Date(time).toLocaleTimeString(undefined, options);
  };
  let timerInterval;
  const exportToExcel = () => {
    const data = filterstatus.map(
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
  };
  const showTable = () => {
    const formatTime = (time) => {
      const options = { hour: "2-digit", minute: "2-digit", hour12: false };
      return new Date(time).toLocaleTimeString(undefined, options);
    };
    return sortedFilterStatus.map((timesheet, i) => {
      return (
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
      );
    });
  };
  return (
    <div>
      <p style={{ color: "red" }}>
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
      </p>
      <button onClick={exportToExcel} style={{ textAlign: "right", marginTop: "10px" }}>
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
          </tr>
        </thead>
        <tbody>{showTable()}</tbody>
      </Table>
    </div>
  );
}

export default ViewmyTimesheet;
