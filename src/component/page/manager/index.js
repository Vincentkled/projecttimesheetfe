import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, InputGroup, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

function ManagerPage() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [timesheet, setTimesheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [note, setNote] = useState("");
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);

  const data = [
    {
      email: localStorage.getItem("Email"),
      name: localStorage.getItem("Name"),
      role: localStorage.getItem("Role"),
    },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        console.log(error);
        setLoading(false);
      });
  }, []);

  const updatestatus = (timesheet, status, note = "") => {
    axios({
      url: `http://localhost:8089/api/timesheet/${timesheet.id}`,
      method: "POST",
      data: {
        employee: timesheet.employee,
        dateentity: timesheet.dateentity,
        start_time: timesheet.start_time,
        end_time: timesheet.end_time,
        activity: timesheet.activity,
        attendance: timesheet.attendance,
        status: status,
      },
      params: {
        note: note,
      },
    })
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Timesheet has been saved",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          navigate(0);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReject = () => {
    if (selectedTimesheet) {
      updatestatus(selectedTimesheet, "Rejected", note);
      handleClose();
    }
  };

  const handleRejectClick = (timesheet) => {
    setSelectedTimesheet(timesheet);
    handleShow();
  };

  const filterstatus = timesheet.filter(
    (timesheet) =>
      timesheet.status === "Pending" &&
      timesheet.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showTable = () => {
    const formatTime = (time) => {
      const options = { hour: "2-digit", minute: "2-digit", hour12: false };
      return new Date(time).toLocaleTimeString(undefined, options);
    };
    return filterstatus.map((timesheet, i) => {
      return (
        <tr key={timesheet.id}>
          <td>{i + 1}</td>
          <td>{timesheet.employee?.name}</td>
          <td>{timesheet.dateentity.datetb}</td>
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
          <td style={{ color: "#E49B0F" }}>{timesheet.status}</td>
          {localStorage.getItem("Manager") !== 'null' ? null : (
            <td>
              <Button
                onClick={() => updatestatus(timesheet, "Approved")}
                variant="success"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleRejectClick(timesheet)}
                variant="danger"
              >
                Reject
              </Button>
            </td>
          )}
        </tr>
      );
    });
  };

  return (
    <div>
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
      <InputGroup className="mb-3" style={{ maxWidth: "300px", marginLeft: "1100px" }}>
        <FormControl
          placeholder="Search by Employee Name"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
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
            {localStorage.getItem("Manager") !== 'null' ? null : (
              <th>Action</th>
            )}
          </tr>
        </thead>
        <tbody>{showTable()}</tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Timesheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManagerPage;
