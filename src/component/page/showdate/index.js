import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

function ShowDate() {
  const [dateentity, setDateentity] = useState([{}]);
  const [loading, setLoading] =useState("");


  useEffect(() => {
    axios({
      url: "http://localhost:8089/api/dateentity",
      method: "GET",
      data: JSON.stringify(dateentity),
      headers: {
        "Content-Type": "application/json",
      },
    })
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
        const textColor = dateentity.isholiday ? "red" : "black";
        return (
            <tr key={dateentity.id} className={{color : textColor}}>
                <td>{i + 1}</td>
                <td>{dateentity.datetb}</td>
                <td>{dateentity.detail}</td>
                <td style={{color : textColor}}>{isHolidayText}</td>
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
                <th style={{color : "cyan"}}><b>#</b></th>
                <th style={{color : "cyan"}}><b>Date</b></th>
                <th style={{color : "cyan"}}><b>Detail</b></th>
                <th style={{color : "cyan"}}><b>Keterangan</b></th>
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
