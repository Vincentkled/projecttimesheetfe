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
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios({
      url: "http://localhost:8089/api/dateentity",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let filteredData = response.data.results;

        if (selectedMonth !== "all") {
          filteredData = filteredData.filter((item) => {
            const date = new Date(item.datetb);
            return date.getMonth() + 1 === parseInt(selectedMonth);
          });
        }

        if (selectedYear !== "all") {
          filteredData = filteredData.filter((item) => {
            const date = new Date(item.datetb);
            return date.getFullYear() === parseInt(selectedYear);
          });
        }

        const sortedDateentity = filteredData.sort(
          (a, b) => new Date(a.datetb) - new Date(b.datetb)
        );
        setDateentity(sortedDateentity);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [selectedMonth, selectedYear]);

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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [];
  for (let i = 2020; i <= new Date().getFullYear(); i++) {
    years.push({ value: i.toString(), label: i.toString() });
  }

  return (
    <div>
      <div>
        <label>Filter by Month: </label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="all">All</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <label>Filter by Year: </label>
        <select value={selectedYear} onChange={handleYearChange}>
          <option value="all">All</option>
          {years.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
      </div>
      <p style={{ color: "red" }}>
        <b>
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
