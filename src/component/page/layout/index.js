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
import { Button } from "react-bootstrap";


const Layout = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(true);
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
       <aside style={{ maxWidth: show ? "300px" : "100px" }}>
			<div>
				<Button onClick={() => setShow(!show)}variant="warning"></Button>
				{admin.map((link, index) => (
					<section className="wrap">
						<div className="icon"></div>
						<Link
							className={`mx-2 link ${show ? "" : "visible"}`}
							key={index}
							to={link.hash}
						>
							{link.page}
						</Link>
					</section>
				))}
			</div>

			<section className="wrap log-out">
				<div className="icon"></div>
				<Link
					to="/"
					onClick={clearLocal}
					className="sidebar-footer"
				>
					Log Out
				</Link>
			</section>
		</aside>

      <Outlet />
      </div>
    );
  } else if (x == "user"){
    return (
      <div>
     <aside style={{ maxWidth: show ? "300px" : "100px" }}>
			<div>
				<Button onClick={() => setShow(!show)}variant="warning"></Button>
				{user.map((link, index) => (
					<section className="wrap">
						<div className="icon"></div>
						<Link
							className={`mx-2 link ${show ? "" : "visible"}`}
							key={index}
							to={link.hash}
						>
							{link.page}
						</Link>
					</section>
				))}
			</div>

			<section className="wrap log-out">
				<div className="icon"></div>
				<Link
					to="/"
					onClick={clearLocal}
					className="sidebar-footer"
				>
					Log Out
				</Link>
			</section>
		</aside>

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
