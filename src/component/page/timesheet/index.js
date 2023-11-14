import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from "sweetalert2";

const TimesheetForm = () => {

  const [dateentitys, setDateentitys] = useState([{
  }]);
  useEffect (() => {
    axios({
      url: "http://localhost:8089/api/dateentity",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then((response)=>{
      // console.log(response.data.results)
      setDateentitys(response.data.results)
      console.log(dateentitys)
    }).catch((error)=>{
      console.log(error)
    });
  },[]);
  const [formData, setFormData] = useState({
    employee: {
      id: localStorage.getItem("Id"),
    },
    dateentity: {
      id: null,
    },
    start_time: "",
    end_time: "",
    activity: "",
    attendance: "",
    status: "Pending",
  });

  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const checkData = () =>{
    console.log(dateentitys)
  }

  let resetForm = () => {
    setFormData({
      employee: {
        id: "",
      },
      dateentity: {
        id: "",
      },
      start_time: "",
      end_time: "",
      activity: "",
      attendance: "",
      status: "Pending",
    });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    let object = {
      employee: formData.employee,
      dateentity: formData.dateentity,
      start_time: formData.start_time,
      end_time: formData.end_time,
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
        setFormData({
          ...formData,
        });
        console.log(response);
       Swal.fire({
          position: "center",
          icon: "success",
          title: "Timesheet successfully inputted",
          showConfirmButton: false,
          timer: 1500
        })
        resetForm();
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "employee") {
      setFormData({
        ...formData,
        employee: {
          id: value,
        },
      });
    } else if (name === "dateentity") {
      setFormData({
        ...formData,
        dateentity: {
          id: value,
        },
      });
    } else if (name === "start_time") {
      // Update start_time
      setFormData({
        ...formData,
        start_time: value,
        end_time: value < formData.end_time ? value : formData.end_time,
      });
    } else if (name === "end_time") {
      // Update end_time
      setFormData({
        ...formData,
        end_time: value > formData.start_time ? value : formData.start_time,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  

  return (<>
    <Button variant="primary" onClick={handleShow}  style={{
    position: 'fixed',
    top: '25%',
    left: '50%',
    transform: 'translate(-20%, -20%)',
  }}>
      Input Timesheet
    </Button>

    <Modal show={show} onHide={handleClose}>
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
              onChange={handleChange}
              disabled
              hidden
            ></Form.Control>
          </Form.Group>

          {/* Date */}
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Select
              name="dateentity"
              value={formData.dateentity.id}
              onChange={handleChange}
            >
              <option disabled>Select Date </option>
              {dateentitys.map((x) => (
                <option value={x.id} key={x.id}>
                  {x.datetb}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* Start Time */}
          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              placeholder="yyyy-MM-dd(T)HH:mm:ss"
              required
            />
          </Form.Group>
          {/* End Time */}
          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              placeholder="yyyy-MM-dd(T)HH:mm:ss"
              required
            />
          </Form.Group>
          {/* Activity */}
          <Form.Group className="mb-3">
            <Form.Label>Activity</Form.Label>
            <Form.Control
              type="text"
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {/* Attendance */}
          <Form.Group className="mb-3">
            <Form.Label>Attendance</Form.Label>
            <select
            name="attendance"
            value={formData.attendance}
            onChange={handleChange}
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
              onChange={handleChange}
              required
              hidden
            />
          </Form.Group>
          <Button variant="secondary" onClick={handleClose}>
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