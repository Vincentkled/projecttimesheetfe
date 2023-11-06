import React, { useState } from "react";
import axios from "axios";

const Dateform = () => {
  const [formData, setFormData] = useState({
    id: "",
    datetb: "",
    detail: "",
    isholiday: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };
  let resetForm = () => {
    setFormData({
        id: "",
        datetb: "",
        detail: "",
        isholiday: false,
    })
};
  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
        url: "http://localhost:8089/api/dateentity",
        method: "POST",
        data: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((response) => {
          setFormData({
            ...formData
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
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleInputChange}
          hidden
        />
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          name="datetb"
          value={formData.datetb}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Detail:</label>
        <input
          type="text"
          name="detail"
          value={formData.detail}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Is Holiday:</label>
        <input
          type="checkbox"
          name="isholiday"
          checked={formData.isholiday}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Dateform;
