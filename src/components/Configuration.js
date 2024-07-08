import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Home.css";
import HeaderBar from "./HeaderBar";

const Configuration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Configuration";
    if (localStorage.getItem("token") == null) navigate("/");
  }, []);

  return (
    <div className="card-container">
      <HeaderBar title="Configuration" module="" />
      {localStorage.getItem("permissions").includes("add_use") ? (
        <Link to="/add_user" className="card">
          <div className="card-content">Add User</div>
        </Link>
      ) : (
        <div></div>
      )}
      {localStorage.getItem("permissions").includes("edit_permission") ? (
        <Link to="/user_permission" className="card">
          <div className="card-content">User Permission</div>
        </Link>
      ) : (
        <div></div>
      )}
      {localStorage.getItem("permissions").includes("add_defects") ? (
        <Link to="/add_defects" className="card">
          <div className="card-content">Add Defects</div>
        </Link>
      ) : (
        <div></div>
      )}
      {localStorage.getItem("permissions").includes("add_machines") ? (
        <Link to="/add_machines" className="card">
          <div className="card-content">Add Machines</div>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Configuration;
