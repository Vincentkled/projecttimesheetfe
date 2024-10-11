import Footer from "../footer";

import { useEffect, useState } from "react";
import Timesheet from "../timesheet";
import Dateform from "../date";
import DepartmentForm from "../department";
import TimesheetApproval from "../manager";
import ManagerPage from "../manager";
import Header from "../header";
import Login from "../login";
import Register from "../register";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import zoro from "./usd.jpg"
import { Link } from "react-router-dom";

function Homepage() {
    // const [namecontent, setNamecontent] = useState([]);
    const [namefooter, setNamefooter] = useState('');
    const [count, setCount] = useState (0)
    const [x, setX] = useState(true)
    const [y, setY] = useState(true)

    useEffect(() => {
        setNamefooter("Contact Us vincentkled@gmail.com")
        // setNamecontent([
            // {   
            //     name : "Present",
            //     activity : "Study Database",
            //     datetime : "2023-10-04"
            // },
            // {   
            //     name : "Present",
            //     activity : "Study Java Fundamental",
            //     datetime : "2023-10-15"
            // },
            // {   
            //     name : "Present",
            //     activity : "Study JPQL, JPA",
            //     datetime : "2023-10-30"
            // }
        // ])
        if (count <= 0){
            setX(true);
            setY(false);
        }
        else if(count >= 10){
            setX(false);
            setY(true);
        } else {
            setX(false);
            setY(false);
        }
    }, [count])
        


  return (
    <div>
      {/* <h1>Homepage</h1> */}
      {/* <Header /> */}
        {/* <Timesheet /> */}
        {/* <MyTable /> */}
        {/* <ManagerPage /> */}
        {/* <Footer>{namefooter}</Footer> */}
        {/* <Dateform /> */}
        {/* <DepartmentForm /> */}
        {/* <TimesheetApproval /> */}
        {/* <Login />
        <Register /> */}
      <Card style={{ width: '18rem', marginLeft: '580px', boxShadow: '0 16px 32px rgba(0, 0, 0, 0.6)' }}>
  <Card.Img variant="top" src={zoro} />
  <Card.Body>
    <Card.Title><b>Project Timesheet</b></Card.Title>
    <Card.Text>
      Welcome to PT.Universe Solusi Digital
    </Card.Text>
    <button>
      <Link to="/timesheet" variant="primary">Input Timesheet</Link>
    </button>
  </Card.Body>
</Card>

    {/* <namefooter>{namefooter}</namefooter> */}
    
    </div>
    
  );
}

export default Homepage;