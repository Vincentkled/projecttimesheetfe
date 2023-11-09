import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Login from "../login";
import Register from "../register";
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
        <nav>
        <ul>
          <li>
            <Link to="/">Homepage</Link>
          </li>
            <li>
              <Link to="/timesheet">Input Timesheet</Link>
            </li>
            <li>
              <Link to="/manager">Timesheet Approval</Link>
            </li>
            <li>
              <Link to="/date">Create Date Table</Link>
            </li>
          <li>
            <Link to="/showdate">Show Date</Link>
          </li>
            <li>
              <Link to="/department">Create Department</Link>
            </li>
          <li>
            <Link to="/showdepartment">Show Department</Link>
          </li>
            <li>
              <Link to="/showrole">ShowRole</Link>
            </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/viewmytimesheet">View My Timesheet</Link>
          </li>
                <li>
            <Link to="/" onClick={clearLocal}>Logout</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
      </div>
    );
  } else if (x == "user"){
    return (
      <div>
      <nav>
      <ul>
        <li>
          <Link to="/">Homepage</Link>
        </li>
          <li>
            <Link to="/timesheet">Input Timesheet</Link>
          </li>
        <li>
          <Link to="/showdate">Show Date</Link>
        </li>
        <li>
          <Link to="/showdepartment">Show Department</Link>
        </li>
          <li>
            <Link to="/showrole">ShowRole</Link>
          </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/viewmytimesheet">View My Timesheet</Link>
        </li>
              <li>
          <Link to="/" onClick={clearLocal}>Logout</Link>
        </li>
      </ul>
    </nav>

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
