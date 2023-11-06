import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";


function ShowDate() {
  const [dateentity, setDateentity] = useState([{}]);
  const [loading, setLoading] =useState("");


  useEffect(() => {
    axios("http://localhost:8089/api/dateentity"
    )
      .then((response) => {
       setDateentity(response.data.results)
        console.log(response);
        setLoading("")
      })
      .catch((error) => {
        console.log(error);
      });
      setLoading("lagi loading sebentar ya");
  }, []);



  const showTable = () => {

    return dateentity.map((dateentity, i) => {
        const isHolidayText = dateentity.isholiday ? "Holiday" : "Work";
        return (
            <tr key={dateentity.id}>
                <td>{i + 1}</td>
                <td>{dateentity.datetb}</td>
                <td>{dateentity.detail}</td>
                <td>{isHolidayText}</td>
            </tr>
        )
    })
}
  return (
    <div>
    <p style={{color:"cyan"}}><b>{loading}</b></p>
    <Table striped bordered hover>
        <thead>
            <tr>    
                <th>#</th>
                <th>Date</th>
                <th>Detail</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            {showTable()}
        </tbody>
    </Table>
</div>
  );
};

export default ShowDate;
