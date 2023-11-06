import { useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    axios({
      url: "http://localhost:8089/authenticate",
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        const token = response.data.token;

        // Decode token untuk mendapatkan info pengguna
        const decoded = jwtDecode(token);

        console.log("Received token:", token);
        console.log("Email:", decoded.sub);
        console.log("Name:", decoded.name);
        console.log("Role:", decoded.role);

        // Simpan data ke localStorage
        localStorage.setItem("Token", token);
        localStorage.setItem("Email", decoded.sub);
        localStorage.setItem("Name", decoded.name);
        localStorage.setItem("Role", decoded.role);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
  <div className="mb-3">
    <label className="white-text">Email</label>
    <input
      name="email"
      type="text"
      value={data.email}
      onChange={handleChange}
      className="form-control"
    />
  </div>
  <div className="mb-3">
    <label className="white-text">Password</label>
    <input
      name="password"
      type="password"
      value={data.password}
      onChange={handleChange}
      className="form-control"
    />
  </div>
  <button onClick={handleSubmit} className="btn btn-primary">
    Submit
  </button>
</div>

  );
}

export default Login;
