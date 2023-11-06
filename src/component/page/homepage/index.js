import Footer from "../footer";

import { useEffect, useState } from "react";
import Timesheet from "../timesheet";
import Dateform from "../date";
import DepartmentForm from "../department";
import TimesheetApproval from "../manager";
import ManagerPage from "../manager";
import Header from "../header";

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
      <h1>Homepage</h1>
      {/* <Header /> */}
        {/* <Timesheet /> */}
        {/* <MyTable /> */}
        {/* <ManagerPage /> */}
        {/* <Footer>{namefooter}</Footer> */}
        {/* <Dateform /> */}
        {/* <DepartmentForm /> */}
        {/* <TimesheetApproval /> */}
    </div>
  );
}

export default Homepage;