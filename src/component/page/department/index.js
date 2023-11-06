import React, { useState } from "react";
import axios from "axios";

const DepartmentForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  let resetForm = () => {
    setFormData({
        id: "",
        name: "",
    })
};
  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
        url: "http://localhost:8089/api/department",
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
          alert("Department berhasil dibuat");
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
        <label htmlFor="name">Name Departement </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default DepartmentForm;
