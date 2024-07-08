import { Button } from "@mui/material";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Home.css";
import HeaderBar from "./HeaderBar";
import NavPanel from "./NavPanel";

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

const Home = () => {
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

  return (
    <div className="card-container">
      <HeaderBar title="Home" module="fabric" />
      <div className="bottom-section">
        <NavPanel />
      </div>
    </div>
  );
};

export default Home;
