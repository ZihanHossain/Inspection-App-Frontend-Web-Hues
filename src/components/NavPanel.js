import React, { useEffect, useState } from "react";
import "../Css/NavPanel.css";
import { Link, useLocation } from "react-router-dom";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import GradientOutlinedIcon from "@mui/icons-material/GradientOutlined";
import RuleIcon from "@mui/icons-material/Rule";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SummarizeIcon from "@mui/icons-material/Summarize";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AnnouncementIcon from "@mui/icons-material/Announcement";

const NavPanel = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState("");

  return (
    <div className="nav-section">
      <div className="nav-userName">
        <AccountBoxIcon sx={{ color: "#00ABE4", fontSize: 35 }} />
        <div className="nav-link-text">{localStorage.getItem("name")}</div>
      </div>
      <Link
        to="/final_inspection"
        className={
          location.pathname === "/final_inspection"
            ? "nav-link-selected"
            : "nav-link"
        }
      >
        <HomeIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
        <div className="nav-link-text">Home</div>
      </Link>
      <Link
        to="/add_gsm"
        className={
          location.pathname === "/add_gsm" ? "nav-link-selected" : "nav-link"
        }
      >
        <AddCircleOutlinedIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
        <div className="nav-link-text">Add GSM</div>
      </Link>
      <Link
        to="/add_shade"
        className={
          location.pathname === "/add_shade" ? "nav-link-selected" : "nav-link"
        }
      >
        <GradientOutlinedIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
        <div className="nav-link-text">Add Shade</div>
      </Link>
      <Link
        to="/add_high_defects"
        className={
          location.pathname === "/add_high_defects"
            ? "nav-link-selected"
            : "nav-link"
        }
      >
        <PriorityHighIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
        <div className="nav-link-text">No of High Defects</div>
      </Link>
      <Link
        to="/pass_fail_status"
        className={
          location.pathname === "/pass_fail_status"
            ? "nav-link-selected"
            : "nav-link"
        }
      >
        <RuleIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
        <div className="nav-link-text">Pass Fail Status</div>
      </Link>
      <Link
        to="/batch_status"
        className={
          location.pathname === "/batch_status"
            ? "nav-link-selected"
            : "nav-link"
        }
      >
        <AssignmentTurnedInIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
        <div className="nav-link-text">Batch Status</div>
      </Link>
      <Link
        to="/reports"
        className={
          location.pathname === "/reports" ? "nav-link-selected" : "nav-link"
        }
      >
        <SummarizeIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
        <div className="nav-link-text">Report</div>
      </Link>
      <div
        onClick={() =>
          setShowDropdown(showDropdown == "settings" ? "" : "settings")
        }
        className={
          location.pathname === "/configuration"
            ? "nav-link-selected"
            : "nav-link"
        }
      >
        <SettingsApplicationsIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
        <div className="nav-link-text">Settings</div>
        {showDropdown === "settings" ? (
          <KeyboardArrowUpIcon
            sx={{
              marginTop: "2%",
              marginLeft: "50%",
              "@media screen and (max-width: 1366px)": {
                marginLeft: "40%",
              },
              color: "#00ABE4",
              fontSize: 20,
            }}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{
              marginTop: "2%",
              marginLeft: "50%",
              "@media screen and (max-width: 1366px)": {
                marginLeft: "40%",
              },
              color: "#00ABE4",
              fontSize: 20,
            }}
          />
        )}
      </div>
      <div style={{ display: showDropdown === "settings" ? "block" : "none" }}>
        <Link
          to="/add_user"
          className={
            location.pathname === "/configuration"
              ? "nav-link-selected"
              : "nav-link-dropdown"
          }
        >
          <PersonAddIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
          <div className="nav-link-text">Add User</div>
        </Link>
        <Link
          to="/user_permission"
          className={
            location.pathname === "/configuration"
              ? "nav-link-selected"
              : "nav-link-dropdown"
          }
        >
          <AccountTreeIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
          <div className="nav-link-text">User Permissions</div>
        </Link>
        <Link
          to="/add_machines"
          className={
            location.pathname === "/configuration"
              ? "nav-link-selected"
              : "nav-link-dropdown"
          }
        >
          <PrecisionManufacturingIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
          <div className="nav-link-text">Add Machines</div>
        </Link>
        <Link
          to="/add_defects"
          className={
            location.pathname === "/configuration"
              ? "nav-link-selected"
              : "nav-link-dropdown"
          }
        >
          <AnnouncementIcon sx={{ color: "#00ABE4", fontSize: 20 }} />
          <div className="nav-link-text">Add Defects</div>
        </Link>
      </div>
    </div>
  );
};

export default NavPanel;
