import { Button } from "@mui/material";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Home.css";
import HeaderBar from "./HeaderBar.js";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("body");

const ModuleSelect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "QMS";
    if (localStorage.getItem("token") == null) navigate("/");
  }, []);

  return (
    <div className="card-container">
      <HeaderBar title="Module Select" module="fabric" />
      {localStorage.getItem("permissions").includes("finish_fabric") ? (
        <Link to="/final_inspection" className="card">
          <div className="card-content">Final Fabric Inspection</div>
        </Link>
      ) : (
        <Link
          className="card"
          style={{ background: (1, 1, 1, 0.5) }}
          onClick={(event) => event.preventDefault()}
        >
          <div className="card-content">Final Fabric Inspection</div>
        </Link>
      )}

      {localStorage.getItem("permissions").includes("greige_fabric") ? (
        <Link to="/home_greige" className="card">
          <div className="card-content">Greige Fabric Inspection</div>
        </Link>
      ) : (
        <Link
          className="card"
          style={{ background: (1, 1, 1, 1) }}
          onClick={(event) => event.preventDefault()}
        >
          <div className="card-content">Greige Fabric Inspection</div>
        </Link>
      )}

      <Link to="/configuration" className="card">
        <div className="card-content">Configuration</div>
      </Link>
    </div>
  );
};

export default ModuleSelect;
