import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate ();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true)
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
        const decoded = jwtDecode(response.data.token);
        console.log("Received token:", token);
        console.log("Email:", decoded.sub);
        console.log("Name:", decoded.name);
        console.log("Role:", decoded.role);
        console.log("Id:", decoded.id)
        console.log("Manager:", decoded.manager_id)

        // Simpan data ke localStorage
        localStorage.setItem("Token", token);
        localStorage.setItem("Email", decoded.sub);
        localStorage.setItem("Name", decoded.name);
        localStorage.setItem("Role", decoded.role);
        localStorage.setItem("Id", decoded.id);
        localStorage.setItem("Manager", decoded.manager_id);
        setLoading(false)
        navigate(0)
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <div className="container">
      <p style={{ color: "red" }}>
        <b>   <ClipLoader
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="override"
      /></b>
      </p>
  <div className="mb-3">
    <label className="black-text">Email</label>
    <input
      name="email"
      type="text"
      value={data.email}
      onChange={handleChange}
      className="container"
      style={{ maxWidth: "300px", marginLeft:"30px", marginTop:"15px", marginBottom:"-3px" }} 
    />
  </div>
  <div className="mb-3">
    <label className="black-text">Password</label>
    <input
      name="password"
      type="password"
      value={data.password}
      onChange={handleChange}
      className="container"
      style={{ maxWidth: "300px", marginLeft:"3px",marginTop:"-10px" }} 
    />
  </div>
  <button onClick={handleSubmit} className="btn btn-primary">
    Submit
  </button>
</div>

  );
}

export default Login;
