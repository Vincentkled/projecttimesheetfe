import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const TimesheetForm = () => {
  const [dateentitys, setDateentitys] = useState([]);
  const [formData, setFormData] = useState({
    employee: {
      id: localStorage.getItem("Id"),
    },
    dateentity: {
      id: null,
    },
    start_time: `${new Date().toISOString().split('T')[0]}T${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
    activity: "",
    attendance: "",
    status: "Pending",
  });
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dates from the API
    axios.get("http://localhost:8089/api/dateentity")
      .then(response => {
        const todayDate = new Date().toISOString().split('T')[0];
        console.log("Today Date:", todayDate); // Log today's date

        const dates = response.data.results;

        // Log all fetched dates
        console.log("Fetched Dates:", dates);

        // Find today's date in the fetched dates and get the corresponding date_id
        const todayDateEntity = dates.find(date => {
          const fetchedDate = date.datetb; // Directly use datetb from the response
          console.log("Fetched Date:", fetchedDate); // Log fetched date for comparison
          return fetchedDate === todayDate;
        });

        // Log the result of the search
        console.log("Today's Date Entity:", todayDateEntity);

        if (todayDateEntity) {
          setFormData(prevData => ({
            ...prevData,
            dateentity: { id: todayDateEntity.id }, // Use id from the response
            start_time: `${todayDateEntity.datetb}T${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
          }));
        } else {
          console.warn("Today's date not found in the fetched data.");
        }

        setDateentitys(dates);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let object = {
      employee: formData.employee,
      dateentity: formData.dateentity,
      start_time: formData.start_time,
      activity: formData.activity,
      attendance: formData.attendance,
      status: formData.status,
    };

    axios({
      url: "http://localhost:8089/api/timesheet",
      method: "POST",
      data: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Timesheet successfully inputted",
          showConfirmButton: false,
          timer: 1500
        });
        resetForm();
        navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const resetForm = () => {
    setFormData({
      employee: {
        id: localStorage.getItem("Id"),
      },
      dateentity: {
        id: null,
      },
      start_time: `${new Date().toISOString().split('T')[0]}T${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
      activity: "",
      attendance: "",
      status: "Pending",
    });
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)} style={{
        position: 'fixed',
        top: '25%',
        left: '50%',
        transform: 'translate(-20%, -20%)',
      }}>
        Start Timesheet
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Timesheet Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Employee */}
            <Form.Group className="mb-3 cons">
              <Form.Control
                type="text"
                name="employee"
                value={formData.employee.id}
                onChange={() => {}}
                disabled
                hidden
              ></Form.Control>
            </Form.Group>

            {/* Start Time */}
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={formData.start_time.split('T')[1] || ''}
                onChange={() => {}}
                readOnly
              />
            </Form.Group>

            {/* Activity */}
            {/* <Form.Group className="mb-3">
              <Form.Label>Activity</Form.Label>
              <Form.Control
                type="text"
                name="activity"
                value={formData.activity}
                onChange={(e) => setFormData({
                  ...formData,
                  activity: e.target.value
                })}
              />
            </Form.Group> */}

            {/* Attendance */}
            <Form.Group className="mb-3">
              <Form.Label>Attendance</Form.Label>
              <select
                name="attendance"
                value={formData.attendance}
                onChange={(e) => setFormData({
                  ...formData,
                  attendance: e.target.value
                })}
                required
              >
                <option disabled value="">
                  Pilih Kehadiran
                </option>
                <option value="Present">Present</option>
                <option value="Absence">Absence</option>
                <option value="Sick">Sick</option>
                <option value="Leave">Leave</option>
              </select>
            </Form.Group>

            {/* Status */}
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="status"
                value={formData.status}
                onChange={() => {}}
                hidden
              />
            </Form.Group>

            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save Timesheet
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TimesheetForm;
