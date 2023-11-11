import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Login from "../login";
import Register from "../register";
import { admin, user } from "../lib/navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar"
import "./index.css";

const Layout = () => {
    const navigate = useNavigate();
    const [data, setData] = useState ([{
      email: localStorage.getItem("Email"),
      name: localStorage.getItem("Name"),
      role: localStorage.getItem("Role")
    }]);
    // const [ role, setRole ] = useState(localStorage.getItem("Role"));

    const clearLocal = () =>{
      localStorage.clear();
    }
    // const cekdata =() =>{
    //   console.log(localStorage.getItem("Email"))
    // }

    let x = localStorage.getItem("Role")
// useEffect (() => {
//   setRole(localStorage.getItem("Role"));
//   console.log(role);

//   navigate(0)
// },[])
// useEffect (() => {
//   navigate("/")
// },[])
  {if(x == "admin") {
    return (
      <div>
       <Navbar expand="lg" className="bg-body-tertiary">
				<Container>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="sidebar">
							{admin.map((link, index) => (
							<Link
              className="mx-2"
              key={index}
              to={link.hash}
              
            >
              {link.page}
            </Link>
							))}
              <Link to="/" onClick={clearLocal}>Logout</Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

      <Outlet />
      </div>
    );
  } else if (x == "user"){
    return (
      <div>
     <Navbar expand="lg" className="bg-body-tertiary">
				<Container>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							{user.map((link, index) => (
							<Link
              className="mx-2"
              key={index}
              to={link.hash}
              
            >
              {link.page}
            </Link>
							))}
              <Link to="/" onClick={clearLocal}>Logout</Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

    <Outlet />
    </div>
      );
  }else{
    return (
    <div>
      <nav>
        <ul>
        <li>
         <Login />
         <Register />
        </li>
        </ul>
      </nav>
    </div>
      )
  }} 

};

export default Layout;
