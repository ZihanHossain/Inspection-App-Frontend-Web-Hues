import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import HomeIcon from "@mui/icons-material/Home";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/AddMachines.css";

const AddDefects = () => {
  const [dType, setDType] = useState();
  const [dCode, setDCode] = useState();
  const [dName, setDName] = useState();
  const [defects, setDefects] = useState([]);
  const [module, setModule] = useState("finish_fabric");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Add Machines";
    if (localStorage.getItem("token") == null) {
      navigate("/");
    } else {
      if (!localStorage.getItem("permissions").includes("add_machines")) {
        return navigate("/access-denied");
      }
    }
    getDefects();
  }, []);

  const getDefects = async () => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_defects_for_conf`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const json = await response.json();
      if (json.length > 0) {
        setDefects(json);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://${localStorage.getItem("server-ip")}/inspaction/add_defect`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dType,
            dCode,
            dName,
            module,
          }),
        }
      );
      const json = await response.text();
      console.log(json);
      if (json === "success") {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (number) => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem("server-ip")}/inspaction/delete_machine`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number,
          }),
        }
      );
      const json = await response.text();
      console.log(json);
      if (json === "success") {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card-container">
      <div className="top-section">
        <div className="home-button">
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => {
              navigate("/home");
            }}
          >
            Home
          </Button>
        </div>
        <div className="head-title">Add Machine</div>
        <div className="logout">
          <Button
            variant="outlined"
            startIcon={<LogoutTwoToneIcon />}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="table-section-add-machines">
        <form onSubmit={handleSubmit} className="form-section-add-machines">
          <div className="input-element">
            <div className="input-element-title">Module:</div>
            <select
              name="module"
              onChange={(event) => setModule(event.target.value)}
            >
              <option id="0">finish_fabric</option>
              <option id="1">greige_fabric</option>
            </select>
          </div>
          <div className="input-element">
            <div className="input-element-title">Defect Type:</div>
            <div>
              <TextField
                variant="outlined"
                margin="normal"
                required
                name="type"
                label="Enter Defect Type..."
                id="type"
                onChange={(event) => setDType(event.target.value)}
              />
            </div>
          </div>
          <div className="input-element">
            <div className="input-element-title">Defect Code:</div>
            <div>
              <TextField
                variant="outlined"
                margin="normal"
                required
                name="code"
                type="tel"
                label="Enter Defect Code..."
                id="code"
                onChange={(event) => setDCode(event.target.value)}
              />
            </div>
          </div>
          <div className="input-element">
            <div className="input-element-title">Defect Name:</div>
            <div>
              <TextField
                variant="outlined"
                margin="normal"
                required
                name="name"
                label="Enter Defect Name..."
                id="name"
                onChange={(event) => setDName(event.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="outlined"
              startIcon={<LogoutTwoToneIcon />}
            >
              Add/Update
            </Button>
          </div>
        </form>
        <div className="info-table-add-machines">
          <TableContainer component={Paper} sx={{ maxHeight: 550 }}>
            <Table
              stickyHeader
              sx={{ minWidth: 250 }}
              aria-label="simple table"
            >
              <TableHead style={{ backgroundColor: "#D9E3DA" }}>
                <TableRow>
                  <TableCell style={{ color: "#008000", fontWeight: "bold" }}>
                    Finishing Defects
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {defects.map((row) =>
                  row.module === "finish_fabric" ? (
                    <TableRow
                      key={row.Id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">{row.DefectName}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow></TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="info-table-add-machines">
          <TableContainer component={Paper} sx={{ maxHeight: 550 }}>
            <Table
              stickyHeader
              sx={{ minWidth: 250 }}
              aria-label="simple table"
            >
              <TableHead style={{ backgroundColor: "#D9E3DA" }}>
                <TableRow>
                  <TableCell style={{ color: "#008000", fontWeight: "bold" }}>
                    Greige Defects
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {defects.map((row) =>
                  row.module === "greige_fabric" ? (
                    <TableRow
                      key={row.Id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">{row.DefectName}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow></TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default AddDefects;
