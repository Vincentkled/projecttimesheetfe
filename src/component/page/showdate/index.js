import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ShowDate() {
  const [dateentity, setDateentity] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedDetail, setEditedDetail] = useState("");

  const navigate = useNavigate();

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
        const sortedDateentity = response.data.results.sort((a, b) => new Date(a.datetb) - new Date(b.datetb));
        setDateentity(sortedDateentity);
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(true);
  }, []);
  const getFormattedDate = (dateString) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = new Date(dateString).getDay();
    const dayName = days[dayIndex];
    const formattedDate = new Date(dateString);

    const dd = String(formattedDate.getDate()).padStart(2, '0');
    const mm = String(formattedDate.getMonth() + 1).padStart(2, '0'); // January = 0
    const yyyy = formattedDate.getFullYear();

    return `${dayName}, ${dd}-${mm}-${yyyy}`;
  };
  const updateHoliday = (dateentity, isholiday) => {
    axios({
      url: `http://localhost:8089/api/dateentity/${dateentity.id}`,
      method: "POST",
      data: {
        id: dateentity.id,
        datetb: dateentity.datetb,
        detail: dateentity.detail,
        isholiday: isholiday
      },
    })
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Holiday has been updated",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateDetail = (dateentity, detail) => {
    axios({
      url: `http://localhost:8089/api/dateentity/${dateentity.id}`,
      method: "POST",
      data: {
        id: dateentity.id,
        datetb: dateentity.datetb,
        detail: detail,
        isholiday: dateentity.isholiday,
      },
    });
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Detail has been updated",
      showConfirmButton: false,
      timer: 2000,
    })
      .then(() => {
        navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditDetail = (id, currentDetail) => {
    setEditingId(id);
    setEditedDetail(currentDetail);
  };

  const handleSaveDetail = (dateentity) => {
    updateDetail(dateentity, editedDetail);

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Detail has been updated",
      showConfirmButton: false,
      timer: 2000,
    })
      .then(() => {
        navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showTable = () => {
    return dateentity.map((dateentity, i) => {
      const isHolidayText = dateentity.isholiday ? "Holiday" : "Work";
      const textColor = dateentity.isholiday ? "red" : "black";
      const isEditing = editingId === dateentity.id;

      return (
        <tr key={dateentity.id} className={{ color: textColor }}>
          <td>{i + 1}</td>
          <td>
            {getFormattedDate(dateentity.datetb)}
          </td>
          <td>
          {isEditing ? (
            <input
              type="text"
              value={editedDetail}
              onChange={(e) => setEditedDetail(e.target.value)}
            />
          ) : (
            dateentity.detail
          )}
        </td>
          <td style={{ color: textColor }}>{isHolidayText}</td>
          {localStorage.getItem("Role") !== "admin" ? null : (
            <td>
              <Button
                variant="warning"
                onClick={() =>
                  handleEditDetail(dateentity.id, dateentity.detail)
                }
              >
                Edit Detail
              </Button>
              <Button
                style={{ marginLeft: "3px" }}
                onClick={() => updateHoliday(dateentity, !dateentity.isholiday)}
                variant={dateentity.isholiday ? "warning" : "danger"}
              >
                {dateentity.isholiday ? "Work" : "Holiday"}
              </Button>
              {isEditing && (
                <Button
                  style={{ marginLeft: "3px" }}
                  variant="success"
                  onClick={() => handleSaveDetail(dateentity)}
                >
                  Save
                </Button>
              )}
            </td>
          )}
        </tr>
      );
    });
  };

  return (
    <div>
      <p style={{ color: "red" }}>
        <b>
          {" "}
          <ClipLoader
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="override"
          />
        </b>
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ color: "black" }}>
              <b>#</b>
            </th>
            <th style={{ color: "black" }}>
              <b>Date</b>
            </th>
            <th style={{ color: "black" }}>
              <b>Detail</b>
            </th>
            <th style={{ color: "black" }}>
              <b>Keterangan</b>
            </th>
            {localStorage.getItem("Role") !== "admin" ? null : (
              <th style={{ color: "black" }}>
                <b>Action</b>
              </th>
            )}
          </tr>
        </thead>
        <tbody>{showTable()}</tbody>
      </Table>
    </div>
  );
}

export default ShowDate;
