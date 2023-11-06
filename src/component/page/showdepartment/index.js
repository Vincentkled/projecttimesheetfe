import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";


function ShowDepartment() {
  const [department, setDepartment] = useState([{}]);
  const [loading, setLoading] =useState("");


  useEffect(() => {
    axios("http://localhost:8089/api/department"
    )
      .then((response) => {
       setDepartment(response.data.results)
        console.log(response);
        setLoading("")
      })
      .catch((error) => {
        console.log(error);
      });
      setLoading("lagi loading sebentar ya");
  }, []);



  const showTable = () => {

    return department.map((department, i) => {
        return (
            <tr key={department.id}>
                <td>{i + 1}</td>
                <td>{department.name}</td>
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
                <th>Department Name</th>
            </tr>
        </thead>
        <tbody>
            {showTable()}
        </tbody>
    </Table>
</div>
  );
};

export default ShowDepartment;
