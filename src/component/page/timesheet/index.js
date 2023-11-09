import React, { useEffect, useState } from "react";
import axios from "axios";

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
        alert("Timesheet berhasil di input");
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
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="container">
      <h1>Timesheet Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="white-text">
          <input
            type="text"
            name="employee"
            value={formData.employee.id}
            onChange={handleChange}
            disabled
            hidden
          />
        </div>
        <div className="white-text">
          <label>Select Date </label>
          <select
            name="dateentity"
            value={formData.dateentity.id}
            onChange={handleChange}
          >
            <option disabled>Select Date </option>
            {dateentitys.map((x) => (
              <option value={x.id}  key={x.id}>
                {x.datetb}
              </option>
            ))}
          </select>
        </div>
        <div className="white-text">
          <label>Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            placeholder="yyyy-MM-dd(T)HH:mm:ss"
            required
          />
        </div>
        <div className="white-text">
          <label>End Time</label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            placeholder="yyyy-MM-dd(T)HH:mm:ss"
            required
          />
        </div>
        <div className="white-text">
          <label>Activity</label>
          <input
            type="text"
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="white-text">
          <label>Attendance</label>
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
        </div>
        <div className="white-text">
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            hidden
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Timesheet
        </button>
        

      </form>
    </div>
  );
};

export default TimesheetForm;
