// This for adding Users

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
import React, { useEffect, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link, useNavigate } from "react-router-dom";
import "../Css/AddUser.css";
import HeaderBar from "./HeaderBar";

const AddUser = () => {
  const [eId, setEID] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Add User";
    if (localStorage.getItem("token") == null) {
      navigate("/");
    } else {
      if (!localStorage.getItem("permissions").includes("add_user")) {
        return navigate("/access-denied");
      }
    }
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_users_for_conf`,
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
        setUsers(json);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://${localStorage.getItem("server-ip")}/inspaction/add_user`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eId,
            password,
            userName,
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem("server-ip")}/inspaction/delete_user`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
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
      <HeaderBar title="Add User" module="" />
      <div>
        <div className="table-section-add-machines">
          <form onSubmit={handleSubmit} className="form-section-add-machines">
            <div className="input-element">
              <div className="input-element-title">Employee Id:</div>
              <div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  name="id"
                  label="Enter Employee ID"
                  id="id"
                  onChange={(event) => setEID(event.target.value)}
                />
              </div>
            </div>
            <div className="input-element">
              <div className="input-element-title">Employee Name:</div>
              <div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  name="id"
                  label="Enter Employee ID"
                  id="id"
                  onChange={(event) => setUserName(event.target.value)}
                />
              </div>
            </div>
            <div className="input-element">
              <div className="input-element-title">Password:</div>
              <div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  name="password"
                  label="Enter Password"
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
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
          <div
            className="info-table-add-machines"
            style={{ height: "600px", overflow: "auto" }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 250 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Added Users</TableCell>
                    <TableCell>User Id</TableCell>
                    <TableCell>Password</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((row) => (
                    <TableRow
                      key={row.Id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">{row.user_name}</TableCell>
                      <TableCell align="center">{row.eId}</TableCell>
                      <TableCell align="center">{row.password}</TableCell>
                      <TableCell align="center">
                        <Button onClick={() => handleDelete(row.eId)}>
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

export default AddUser;
