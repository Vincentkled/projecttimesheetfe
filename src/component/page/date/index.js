import React, { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Swal from "sweetalert2";

const Dateform = () => {
  const [formData, setFormData] = useState({
    id: "",
    month: "",
    year: "",
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
      month: "",
      year: "",
      detail: "",
      isholiday: false,
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (formData.month && formData.year) {
      const selectedMonth = parseInt(formData.month, 10);
      const selectedYear = parseInt(formData.year, 10);
      const lastDayOfMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  
        for (let day = 1; day <= lastDayOfMonth; day++) {
          const date = `${selectedYear}-${selectedMonth < 10 ? '0' : ''}${selectedMonth}-${day < 10 ? '0' : ''}${day}`;
        
          let object = {
            detail: formData.detail,
            isholiday: formData.isholiday,
            datetb: date,
          };
        
          axios({
            url: "http://localhost:8089/api/dateentity",
            method: "POST",
            data: JSON.stringify(object),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            console.log(response);
            resetForm();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Holiday has been updated",
              showConfirmButton: false,
              timer: 2000,
            })
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translate(-20%, -20%)',
        }}
      >
        Create Schedule
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Create Schedule
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              <label>Month </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select Month
                </option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div>
              <label>Year </label>
              <input
                type="text"
                name="year"
                value={formData.year}
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
              <label>Is Holiday </label>
              <input
                type="checkbox"
                name="isholiday"
                checked={formData.isholiday}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Dateform;
