import { Button } from "@mui/material";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Home.css";
import HeaderBar from "./HeaderBar";

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

const HomeGreige = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("updating");

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "QMS";
    if (localStorage.getItem("token") == null) navigate("/");
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  const import_rolls = async () => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem("server-ip")}/inspaction/update_data`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const re = await response.text();
      if (re === "Complete") {
        setMsg("successful");
      } else {
        setMsg("failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card-container">
      <HeaderBar title="Home" module="greige" />
      <Link to="/add_greige_gsm" className="card">
        <div className="card-content">Add GSM</div>
      </Link>
      {/* <Link to="/add_shade" className="card">
        <div className="card-content">Add Shade</div>
      </Link> */}
      {/* <Link to="/add_high_defects" className="card">
        <div className="card-content">Add No Of High Defects</div>
      </Link> */}
      {/* <Link to="/pass_fail_greige_status" className="card">
        <div className="card-content">Pass Fail Status</div>
      </Link> */}
      <Link to="/batch_status_greige" className="card">
        <div className="card-content">Batch Status</div>
      </Link>
      <Link to="/reports" className="card">
        <div className="card-content">Reports</div>
      </Link>
    </div>
  );
};

export default HomeGreige;
