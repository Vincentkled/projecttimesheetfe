import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";


function ShowRole() {
  const [role, setRole] = useState([{}]);
  const [loading, setLoading] =useState("");


  useEffect(() => {
    axios({
      url: "http://localhost:8089/api/role",
      method: "GET",
      data: JSON.stringify(role),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
       setRole(response.data.results)
        console.log(response);
        setLoading("")
      })
      .catch((error) => {
        console.log(error);
      });
      setLoading("lagi loading sebentar ya");
  }, []);



  const showTable = () => {

    return role.map((role, i) => {
        return (
            <tr key={role.id}>
                <td>{i + 1}</td>
                <td>{role.name}</td>
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
                <th>Role Name</th>
            </tr>
        </thead>
        <tbody>
            {showTable()}
        </tbody>
    </Table>
</div>
  );
};

export default ShowRole;
