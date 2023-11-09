import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FormControl, InputGroup } from "react-bootstrap";

function ViewmyTimesheet() {
  const [timesheet, setTimesheet] = useState([{}]);
  const [loading, setLoading] =useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // const dispatch = useDispatch();
  // const navigate = useNavigate();
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
  
  let x = localStorage.getItem("Name")
  console.log(x);
  const filterstatus = timesheet.filter(
    (timesheet) =>
      timesheet.employee?.name === x.toString()
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
