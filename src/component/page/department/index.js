import React, { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

const DepartmentForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });
  const [show, setShow] = useState(true);
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
    <>
    <Button variant="primary" onClick={() => setShow(true)}>
      Create Department
    </Button>
    <Modal
      show={show}
      onHide={() => setShow(false)}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
        Create Department
        </Modal.Title>
      </Modal.Header>
      <Modal.Body> <form onSubmit={handleSubmit}>
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
      <Button type="submit">Create</Button>
    </form></Modal.Body>
    </Modal>
  </>
  );
};

export default DepartmentForm;
