import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Homepage from "./component/page/homepage";
import About from "./component/page/about";
import Layout from "./component/page/layout";
import Header from "./component/page/header";
import Footer from "./component/page/footer";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./component/page/pagenotfound";
import Timesheet from "./component/page/timesheet";
import Dateform from "./component/page/date";
import ManagerPage from "./component/page/manager";
import DepartmentForm from "./component/page/department";
import ShowRole from "./component/page/showrole";
import ShowDate from "./component/page/showdate";
import ShowDepartment from "./component/page/showdepartment";
import Login from "./component/page/login";
import Register from "./component/page/register";
import ViewmyTimesheet from "./component/page/viewmytimesheet";
import Unauthorized from "./component/page/unauthorized";
import "bootstrap/dist/css/bootstrap.min.css";
import TimesheetReport from "./component/page/timesheetreport";
function App() {
  // const count = useSelector((state) => state.counter.value);
  // const dispatch = useDispatch();
  // const [data, setData] = useState({
  //   email: "",
  //   password: "",
  // });


  const [inputValue, setInputValue] = useState(0);
  const [people, setPeople] = useState([]);

  const [user, setUser] = useState(() => {
    const saveduser = JSON.parse(localStorage.getItem("user"));
    return (
      saveduser || {
        token: "",
        email: "",
        name: "",
        role: "",
      }
    );
  });

  // useEffect(() => {
  //   axios({
  //     url: "https://swapi.dev/api/people",
  //     method: "GET",
  //     data: JSON.stringify(data),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => {
  //       setPeople({
  //         ...people,
  //         name: response.data.name,
  //         height: response.height,
  //         mass: response.mass,
  //       });
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
    // localStorage.setItem("user", JSON.stringify(user));
  // }, []);

  // let handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setData((prevState) => ({
  //     ...prevState,
  //     name: parseInt(value),
  //   }));
  // };

  let handleChange = (e) => {
    const { value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      name: value,
    }));
  };

  let handleSubmit = () => {
    //   let object ={
    //     username: data.email,
    //     password: data.password
    //   }
    // axios({
    //   url: "http://localhost:8089/authenticate",
    //   method: "POST",
    //   data: JSON.stringify(data),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => {
    //     var decoded = jwt_decode(response.data.token);
    //     setUser({
    //       ...user,
    //       token: response.data.token,
    //       email: decoded.sub,
    //       name: decoded.name,
    //       role: decoded.role[0].authority,
    //     });

    //     console.log(decoded);
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };
  let x = localStorage.getItem("Role");
  return (
    <div className="App">
    <div>
    {/* //     <Header />
    //   <Homepage /> */}
      {/* <h1 className="cyan-text"><b>Login</b></h1>
    //   <input
    //     name="email"
    //     type="text"
    //     value={data.email}
    //     onChange={handleChange}
    //     placeholder="Masukan Email"
    //   />
    //   <input
    //     name="password"
    //     type="password"
    //     value={data.password}
    //     onChange={handleChange}
    //     placeholder="Masukan Password"
    //   />
      // <button onClick={handleSubmit}>submit</button> */}
     {/* <button onClick={() => dispatch(decrement())}>-</button>
      // <label>{count}</label>
      // <button onClick={() => dispatch(increment())}>+</button>
      // <input type = "text" name = "inputValue" onChange={handleChange} placeholder="value"></input>
      // <button onClick={() => dispatch(incrementBy(parseInt(inputValue.name)))}>+add</button>
      // <button onClick={() => dispatch(decrementBy(parseInt(inputValue.name)))}>-minus</button> */}
   </div>
    {/* <NewRegister /> */}
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/manager" element={x=="admin"?<ManagerPage />:<Unauthorized/>} />
          <Route path="/*" element={<PageNotFound />} />
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/date" element={x=="admin"?<Dateform />:<Unauthorized/>} />
          <Route path="/department" element={x=="admin"?<DepartmentForm />:<Unauthorized/>} />
          <Route path="/showrole" element={x=="admin"?<ShowRole />:<Unauthorized/>} />
          <Route path="/showdate" element={<ShowDate />} />
          <Route path="/showdepartment" element={<ShowDepartment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/viewmytimesheet/" element={<ViewmyTimesheet />} />
          <Route path="/timesheetreport" element={x=="admin"?<TimesheetReport />:<Unauthorized/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
