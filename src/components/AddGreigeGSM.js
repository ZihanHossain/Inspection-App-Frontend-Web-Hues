import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import {
  Alert,
  AlertTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchableDropdown from "./SearchableDropdown";
import "../Css/AddGSM.css";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import HomeIcon from "@mui/icons-material/Home";
import HeaderBar from "./HeaderBar";

export default function AddGreigeGSM() {
  const location = useLocation();
  const [batches, setBatches] = React.useState([]);
  const [rolls, setRolls] = React.useState([]);
  const [batch, setBatch] = useState();
  const [gsmData, setGsmData] = useState({});
  const [msg, setMsg] = useState("");

  const getBatchs = async (item) => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_saved_greige_batches`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: item,
          }),
        }
      );
      const json = await response.json();
      const arr = [];
      json.forEach((element) => {
        arr.push(element);
      });
      setBatches(arr);
    } catch (error) {
      console.error(error);
    }
  };

  const getRolls = async (selectedItem) => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_roll_by_batch_no_for_greige_gsm`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: batch,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const json = await response.json();
      if (json.length > 0) {
        const arr = [];
        json.forEach((element) => {
          arr.push({ ...element, roll_number: element.roll_number.toString() });
        });
        setRolls(arr);
        console.log(arr);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveGSM = async () => {
    if (batch == "Select batch...") {
      setMsg("Batch Number");
    } else {
      try {
        const url = `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/save_greige_gsm`;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: batch,
            gsmData,
          }),
        };

        const response = await fetch(url, options);
        const json = await response.text();
        if (json == "done") {
          window.location.reload();
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Add GSM";
    if (localStorage.getItem("token") == null) {
      navigate("/");
    } else {
      if (!localStorage.getItem("permissions").includes("add_gsm")) {
        return navigate("/access-denied");
      }
    }
  }, []);

  return (
    <div className="card-container">
      <HeaderBar title="Add GSM" module="greige" />
      <div className="main-section">
        <div className="batch-number-shade">
          <div className="batch-number-dropdown-passfail">
            <div className="dropdown-legend">Batch Number</div>
            <div className="dropdown-passfail">
              <SearchableDropdown
                options={batches}
                label="WorkOrderId"
                id="id"
                selectedVal={batch}
                onSearch={getBatchs}
                handleChange={(val) => {
                  setBatch(val);
                }}
              />
            </div>
          </div>
          <div className="search-roll-button">
            <Button variant="contained" onClick={() => getRolls(batch)}>
              Search
            </Button>
          </div>
        </div>

        {rolls.length < 1 ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "20px",
              color: "red",
            }}
          >
            Please Select a Batch
          </div>
        ) : (
          <div className="table-section">
            <div>
              <div style={{ height: "500px", overflow: "auto" }}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Roll Number</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rolls.map((row) =>
                        row.GSM ? (
                          <div key={row.id}></div>
                        ) : (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                            className="p"
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {row.roll_number}
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                id="standard-basic"
                                variant="standard"
                                label="GSM"
                                type="number"
                                onChange={(event) => {
                                  setGsmData({
                                    ...gsmData,
                                    [row.roll_number]: {
                                      GSM:
                                        event.target.value < 0
                                          ? null
                                          : event.target.value,
                                    },
                                  });
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="save-button">
                <Button variant="contained" onClick={() => saveGSM()}>
                  Save
                </Button>
              </div>
            </div>
            <div
              className="info-table"
              style={{ height: "500px", overflow: "auto" }}
            >
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Roll Number</TableCell>
                      <TableCell align="center">Roll GSM</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rolls.map((row) =>
                      !row.GSM ? (
                        <div key={row.id}></div>
                      ) : (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row" align="center">
                            {row.roll_number}
                          </TableCell>
                          <TableCell align="center">{row.GSM}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}

        <div className={msg.length < 1 ? "error-disable" : "error"}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            This is an error alert — <strong>Please fill {msg}!</strong>
          </Alert>
        </div>
      </div>
    </div>
  );
}
