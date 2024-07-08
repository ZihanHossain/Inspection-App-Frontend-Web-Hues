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
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchableDropdown from "./SearchableDropdown";
import "../Css/AddGSM.css";
import SaveIcon from "@mui/icons-material/Save";
import HomeIcon from "@mui/icons-material/Home";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import HeaderBar from "./HeaderBar";
import NavPanel from "./NavPanel";

export default function AddGSM() {
  const location = useLocation();
  const [batches, setBatches] = React.useState([]);
  const [rolls, setRolls] = React.useState([]);
  const [batch, setBatch] = useState();
  const [gsmData, setGsmData] = useState({});
  const [unique, setUnique] = useState(0);
  const [message, setMessage] = useState([]);
  const [msg, setMsg] = useState("");

  const getBatchs = async (item) => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_saved_batches`,
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
      console.log(arr);
    } catch (error) {
      console.error(error);
    }
  };

  const getRolls = async (selectedItem) => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_roll_by_batch_no_for_gsm`,
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
        )}/inspaction/save_gsm`;
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
      <HeaderBar title="Add GSM" module="fabric" />
      <div className="bottom-section">
        <NavPanel />
        <div className="bottom-right-section">
          <div className="main-section">
            <div className="batch-number-shade">
              <div className="batch-number-dropdown-passfail">
                <div className="dropdown-legend">Select a batch:</div>

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
              <div className="search-roll-button">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#00ABE4", padding: "3px 15px" }}
                  onClick={() => getRolls(batch)}
                >
                  Search
                </Button>
              </div>
              <div className="save-button search-roll-button">
                <Button
                  variant="contained"
                  onClick={() => saveGSM()}
                  startIcon={<SaveIcon />}
                >
                  Save Records
                </Button>
              </div>
            </div>

            {rolls.length < 1 ? (
              <div
                style={{
                  marginTop: "20%",
                  textAlign: "center",
                  fontSize: "20px",
                  color: "red",
                }}
              >
                Please select & search a batch.
              </div>
            ) : (
              <div className="table-section">
                <div className="info-table">
                  <TableContainer component={Paper} sx={{ height: "100%" }}>
                    <Typography
                      sx={{
                        backgroundColor: "#E9F1FA",
                        borderBottom: "2px solid #00ABE4",
                      }}
                      variant="h6"
                    >
                      <span className="typography">Assigned GSM</span>
                    </Typography>
                    <Table
                      stickyHeader
                      sx={{ minWidth: 400 }}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ height: "10px", backgroundColor: "#E9F1FA" }}
                            align="center"
                          >
                            Roll Number
                          </TableCell>
                          <TableCell
                            sx={{ backgroundColor: "#E9F1FA" }}
                            align="center"
                          >
                            Enter GSM
                          </TableCell>
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
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
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
                                  // label="GSM"
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
                <div className="rightArrow">
                  <ArrowRightAltIcon sx={{ fontSize: 100, color: "#00ABE4" }} />
                </div>
                <div className="info-table">
                  <TableContainer component={Paper} sx={{ height: "100%" }}>
                    <Typography
                      sx={{
                        backgroundColor: "#E9F1FA",
                        borderBottom: "2px solid #00ABE4",
                      }}
                      variant="h6"
                    >
                      <span className="typography">Saved GSM</span>
                    </Typography>
                    <Table
                      sx={{ minWidth: 400 }}
                      stickyHeader
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ backgroundColor: "#E9F1FA" }}
                            align="center"
                          >
                            Roll Number
                          </TableCell>
                          <TableCell
                            sx={{ backgroundColor: "#E9F1FA" }}
                            align="center"
                          >
                            Roll GSM
                          </TableCell>
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
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
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
      </div>
    </div>
  );
}
