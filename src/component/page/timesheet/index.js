import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const TimesheetForm = () => {
  const [dateentitys, setDateentitys] = useState([]);
  
  const getCurrentMonthDates = (dates) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return dates.filter(date => {
      const dateObj = new Date(date.datetb);
      return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
    });
  };

  useEffect(() => {
    axios({
      url: "http://localhost:8089/api/dateentity",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then((response) => {
      const sortedDates = response.data.results.sort((a, b) => new Date(a.datetb) - new Date(b.datetb));
      const currentMonthDates = getCurrentMonthDates(sortedDates);
      setDateentitys(currentMonthDates);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

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
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetForm = () => {
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
      const selectedDate = dateentitys.find(x => x.id === parseInt(value)).datetb;
      const [startDate, startTime] = formData.start_time.split('T');
      const [endDate, endTime] = formData.end_time.split('T');
      setFormData({
        ...formData,
        dateentity: {
          id: value,
        },
        start_time: `${selectedDate}T${startTime || '00:00'}`,
        end_time: `${selectedDate}T${endTime || '00:00'}`,
      });
    } else if (name === "start_time") {
      const [date] = formData.start_time.split('T');
      setFormData({
        ...formData,
        start_time: `${date}T${value}`,
        end_time: `${date}T${value < formData.end_time.split('T')[1] ? formData.end_time.split('T')[1] : value}`,
      });
    } else if (name === "end_time") {
      const [date] = formData.end_time.split('T');
      setFormData({
        ...formData,
        end_time: `${date}T${value}`,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDay();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{
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
                  <option 
                    value={x.id} 
                    key={x.id} 
                    style={{ color: getDayOfWeek(x.datetb) === 0 || getDayOfWeek(x.datetb) === 6 ? 'red' : 'black' }}
                    disabled={getDayOfWeek(x.datetb) === 0 || getDayOfWeek(x.datetb) === 6}
                  >
                    {formatDate(x.datetb)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Start Time */}
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={formData.start_time.split('T')[1] || ''}
                onChange={handleChange}
              />
            </Form.Group>

            {/* End Time */}
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                value={formData.end_time.split('T')[1] || ''}
                onChange={handleChange}
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
