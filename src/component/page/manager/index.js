import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, InputGroup } from "react-bootstrap";

function ManagerPage() {
  const [timesheet, setTimesheet] = useState([{}]);
  const [loading, setLoading] =useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    axios("http://localhost:8089/api/timesheet"
    )
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
  
  const updatestatus = (timesheet, status) => {
    axios.post(`http://localhost:8089/api/timesheet/${timesheet.id}`,  {
      employee: timesheet.employee,
      dateentity: timesheet.dateentity,
      start_time: timesheet.start_time,
      end_time: timesheet.end_time,
      activity: timesheet.activity,
      attendance: timesheet.attendance,
      status: status
    })
    navigate(0)
  }

  const filterstatus = timesheet.filter(
    (timesheet) =>
      timesheet.status === "Pending" &&
      timesheet.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showTable = () => {
    const formatTime = (time) => {
      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
      return new Date(time).toLocaleTimeString(undefined, options);
    };
    return filterstatus.map((timesheet, i) => {
        return (
            <tr key={timesheet.id}>
                <td>{i + 1}</td>
                <td>{timesheet.employee.name}</td>
                <td>{timesheet.dateentity.datetb}</td>
                <td>{formatTime(timesheet.start_time)}</td>
                <td>{formatTime(timesheet.end_time)}</td>
                <td>{timesheet.activity}</td>
                <td>{timesheet.attendance}</td>
                <td>{timesheet.status}</td>
                <td><Button onClick={() => updatestatus(timesheet, "Approved")} variant="success">Approve</Button>
                <Button onClick={() => updatestatus(timesheet, "Rejected")} variant="danger"> Reject</Button></td>
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
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {showTable()}
        </tbody>
    </Table>
</div>
  );
};

export default ManagerPage;
