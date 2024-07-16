import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Register() {
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    department_id: "",
    manager_id: null,
  });
  const [show, setShow] = useState(false);
  const [retypePassword, setRetypePassword] = useState("");
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [managerErrorMessage, setManagerErrorMessage] = useState("");
  const [departmentErrorMessage, setDepartmentErrorMessage] = useState("");
  const navigate = useNavigate ();
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password harus terdiri dari minimal 8 karakter!";
    } else if (!/[A-Z]/.test(password)) {
      return "Password harus menggunakan huruf kapital!";
    } else if (!/\W/.test(password)) {
      return "Password harus menggunakan simbol!";
    } else if (!/\d/.test(password)) {
      return "Password harus mengandung angka!";
    }
    return ""; // Tidak ada error
  };
  useEffect(() => {
     // Fetch departments
     axios.get("http://localhost:8089/api/department").then((response) => {
      setDepartments(response.data.results);
    });

    // Fetch managers
    axios.get("http://localhost:8089/api/manager").then((response) => {
      setManagers(response.data.results);
    });
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validasi password saat input password berubah
    if (name === "password") {
      const passwordErrorMessage = validatePassword(value);
      setPasswordErrorMessage(passwordErrorMessage);
    }

    // Update data sesuai input
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "manager_id") {
      setManagerErrorMessage(""); // Reset error message when manager is selected
    }
  };

  const handleSubmit = () => {
    if (!data.manager_id) {
      setManagerErrorMessage("Pilih seorang manajer");
      return;
    } else {
      setManagerErrorMessage(""); // Reset manager error message
    }

    // Cek pesan kesalahan password
    if (passwordErrorMessage) {
      return;
    }

    if (!data.department_id) {
      // Menampilkan pesan kesalahan jika departemen tidak dipilih
      setDepartmentErrorMessage("Pilih departement");
      return;
    } else {
      // Menghapus pesan kesalahan jika departemen sudah dipilih
      setDepartmentErrorMessage("");
    }

    if (data.password !== retypePassword) {
      setPasswordErrorMessage("Password dan Retype tidak cocok.");
      return;
    }
    console.log(data);
    // Bersihkan pesan kesalahan
    setPasswordErrorMessage("");

    axios({
      url: "http://localhost:8089/register",
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Registration Successful: ", response.data);
        alert("SUKSES")
        navigate(0)
      })
      .catch((error) => {
        console.error("Registration Failed: ", error);
      });
  };
  const handleClose = () =>{
    navigate("/")
  }
  return (
    <>
    <div>Don't Have an Account ? 
    <Link to="/register"className="mt-2" variant="primary" onClick={() => setShow(true)}>
      Regist
    </Link>
    </div>
    <Modal
      show={show}
      onHide={() => setShow(false)}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title id="example-custom-modal-styling-title">
          Register
        </Modal.Title>
      </Modal.Header>
      <Modal.Body> <div
      style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}
    >
      <h2>Register</h2>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={data.name}
        onChange={handleChange}
      />
      <label>Email:</label>
      <input
        type="text"
        name="email"
        value={data.email}
        onChange={handleChange}
      />
      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={data.password}
        onChange={handleChange}
      />
      {passwordErrorMessage && <p>{passwordErrorMessage}</p>}
      <label>Retype Password:</label>
      <input
        type="password"
        name="retypePassword"
        value={retypePassword}
        onChange={(e) => setRetypePassword(e.target.value)}
      />
      <label>Department:</label>
<select
  name="department_id"
  value={data.department_id}
  onChange={handleChange}
>
  <option value="">Select Department</option>
  {departments.map((department) => (
    <option key={department.id} value={department.id}>
      {department.name}
    </option>
  ))}
</select>
{departmentErrorMessage && <p>{departmentErrorMessage}</p>}

<label>Manager:</label>
<select name="manager_id" value={data.manager_id} onChange={handleChange}>
  <option value="">Select Manager</option>
  {managers.map((manager) => (
    <option key={manager.id} value={manager.id}>
      {manager.name}
    </option>
  ))}
</select>
{managerErrorMessage && <p>{managerErrorMessage}</p>}


      <Button onClick={handleSubmit} className="mt-3">Register</Button>
    </div></Modal.Body>
    </Modal>
  </>
  );
}

export default Register;