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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/AddMachines.css";
import HeaderBar from "./HeaderBar";

const AddMachines = () => {
  const [mNumber, setMNumber] = useState();
  const [mName, setMName] = useState();
  const [machines, setMachines] = useState([]);
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
    getMachines();
  }, []);

  const getMachines = async () => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_machines_for_conf`,
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
        setMachines(json);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://${localStorage.getItem("server-ip")}/inspaction/add_machine`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mNumber,
            mName,
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
      <HeaderBar title="Add Machine" module="" />
      <div>
        <div className="table-section-add-machines">
          <form onSubmit={handleSubmit} className="form-section-add-machines">
            <div className="input-element">
              <div className="input-element-title">Machine Number:</div>
              <div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  name="id"
                  type="tel"
                  label="Enter Machine No..."
                  id="id"
                  onChange={(event) => setMNumber(event.target.value)}
                />
              </div>
            </div>
            <div className="input-element">
              <div className="input-element-title">Machine Name:</div>
              <div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  name="name"
                  label="Enter Machine Name..."
                  id="name"
                  onChange={(event) => setMName(event.target.value)}
                />
              </div>
            </div>
            <div className="input-element">
              <div className="input-element-title">Machine Module:</div>
              <select
                name="module"
                onChange={(event) => setModule(event.target.value)}
              >
                <option id="0">finish_fabric</option>
                <option id="1">greige_fabric</option>
              </select>
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
          <div
            className="info-table-add-machines"
            style={{ height: "600px", overflow: "auto" }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 250 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Added Machines</TableCell>
                    <TableCell>Machine Name</TableCell>
                    <TableCell>Module</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {machines.map((row) => (
                    <TableRow
                      key={row.Id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">{row.machine_number}</TableCell>
                      <TableCell align="center">{row.machine_name}</TableCell>
                      <TableCell align="center">{row.module}</TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => handleDelete(row.machine_number)}
                        >
                          <DeleteForeverIcon></DeleteForeverIcon>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMachines;
