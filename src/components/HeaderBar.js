import { Button } from "@mui/material";
import React, { useState } from "react";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("body");

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

const HeaderBar = ({ title, module }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("updating");

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
    <div className="top-section">
      <div className="top-section-left">
        <div className="logo">
          <div>QMS</div>
          {/* <img src="/icon.png" className="logo" /> */}
        </div>
        {/* {title != "Module Select" ? (
          localStorage
            .getItem("permissions")
            .includes("import_batch_and_roll_from_T-Aps") ? (
            <div className="home-button">
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={() => {
                  module == "fabric"
                    ? navigate("/final_inspection")
                    : navigate("/home_greige");
                }}
              >
                Home
              </Button>
            </div>
          ) : (
            <div></div>
          )
        ) : (
          <div></div>
        )} */}

        {/* <div className="head-title">{title}</div> */}
        {/* {module == "fabric" ? (
          localStorage
            .getItem("permissions")
            .includes("import_batch_and_roll_from_T-Aps") ? (
            <div style={{ marginLeft: 10, justifyItems: "center" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  import_rolls();
                  setIsOpen(true);
                  setMsg("updating");
                }}
                style={{ padding: "0px", margin: "0px" }}
              >
                <img src={require("../database.gif")} height={35} />
              </Button>
            </div>
          ) : (
            <div></div>
          )
        ) : (
          <div></div>
        )} */}
      </div>

      <div className="top-section-right">
        <Button
          variant="outlined"
          style={{
            color: "#00ABE4",
            backgroundColor: "white",
            minWidth: "none",
            padding: "5px 10%", // Adjust the padding as needed
            border: "none",
            marginRight: "10%",
          }}
          startIcon={<LogoutTwoToneIcon />}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </Button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Reprocess"
        shouldCloseOnOverlayClick={false}
      >
        {msg === "successful" ? (
          <div>
            <div style={{ width: "100%" }}>
              <img src={require("../complete.gif")} height={250} />
            </div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button variant="outlined" onClick={closeModal}>
                OK
              </Button>
            </div>
          </div>
        ) : msg === "failed" ? (
          <h1>Failed!!!</h1>
        ) : (
          <div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img src={require("../loading.gif")} height={250} />
            </div>
            <span>This might take 1.5-2 minutes. Please be patient.</span>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HeaderBar;
