import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, InputGroup } from "react-bootstrap";

function ViewmyTimesheet() {
  const [timesheet, setTimesheet] = useState([{}]);
  const [loading, setLoading] =useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    axios({
      url: "http://localhost:8089/api/timesheet",
      method: "GET",
      data: JSON.stringify(timesheet),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
       setTimesheet(response.data.results)
        console.log(response);
        setLoading("")
      })
      .catch((error) => {
        console.log(error);
      });
      setLoading("lagi loading sebentar ya");
  }, [timesheet.status]);
  const [a, setA] = useState("");
  const updatestatus = (timesheet) => {
    axios({
      url: `http://localhost:8089/api/viewmytimesheet/${timesheet.id}`,
      method: "GET",
      data: {
        employee: timesheet.employee,
        dateentity: timesheet.dateentity,
        start_time: timesheet.start_time,
        end_time: timesheet.end_time,
        activity: timesheet.activity,
        attendance: timesheet.attendance,
        status: timesheet.status
      }
    })
    navigate(0)
  }

  const filterstatus = timesheet.filter(
    (timesheet) =>
      timesheet.employee?.id === 3
  );
  const showTable = () => {
    const formatTime = (time) => {
      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
      return new Date(time).toLocaleTimeString(undefined, options);
    };
    return filterstatus.map((timesheet, i) => {
        return (
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
        )
    })
}
  return (
    <div>
    <p style={{color:"cyan"}}><b>{loading}</b></p>
    <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Employee Name"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
    <Table striped bordered hover variant="dark">
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
        <tbody>
            {showTable()}
        </tbody>
    </Table>
</div>
  );
};

export default ViewmyTimesheet;
