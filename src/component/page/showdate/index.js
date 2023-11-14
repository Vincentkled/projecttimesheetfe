import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import ClipLoader from "react-spinners/ClipLoader";

function ShowDate() {
  const [dateentity, setDateentity] = useState([{}]);
  const [loading, setLoading] =useState(false);


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
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
      });
      setLoading(true);
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
   <p style={{ color: "red" }}>
        <b>   <ClipLoader
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="override"
      /></b>
      </p>
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
