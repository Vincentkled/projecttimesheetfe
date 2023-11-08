import { Link, Outlet } from "react-router-dom";
const Layout = () => {
  const auth = "admin";
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/">Homepage</Link>
          </li>
            <li>
              <Link to="/timesheet">Input Timesheet</Link>
            </li>
          {auth == "admin" ? (
            <li>
              <Link to="/manager">Timesheet Approval</Link>
            </li>
          ) : null}
          {auth == "admin" ? (
            <li>
              <Link to="/date">Create Date Table</Link>
            </li>
          ) : null}
          <li>
            <Link to="/showdate">Show Date</Link>
          </li>
          {auth == "admin" ? (
            <li>
              <Link to="/department">Create Department</Link>
            </li>
          ) : null}
          <li>
            <Link to="/showdepartment">Show Department</Link>
          </li>
          {/* {auth == "admin" ? (
            <li>
              <Link to="/showrole">ShowRole</Link>
            </li>
          ) : null} */}
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/viewmytimesheet">View My Timesheet</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
