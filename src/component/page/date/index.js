import React, { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

const Dateform = () => {
  const [formData, setFormData] = useState({
    id: "",
    datetb: "",
    detail: "",
    isholiday: false,
  });
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
    <>
    <Button variant="primary" onClick={() => setShow(true)}>
    Create Schedule
    </Button>
    <Modal
      show={show}
      onHide={() => setShow(false)}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          Create Schedule
        </Modal.Title>
      </Modal.Header>
      <Modal.Body> <form onSubmit={handleSubmit}>
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
      <Button type="submit">Submit</Button>
    </form></Modal.Body>
    </Modal>
  </>
  );
};

export default Dateform;
