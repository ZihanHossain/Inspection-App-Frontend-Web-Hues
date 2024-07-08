import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import {
  Alert,
  AlertTitle,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import "../Css/AddGSM.css";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import HomeIcon from "@mui/icons-material/Home";

export default function EditInspection() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [inspectionDataBefore, setInspectionDataBefore] = React.useState([]); //this is for initial data, which will not been changed after the edit by user.
  const [inspectionData, setInspectionData] = React.useState([]); //this is the updated data after the user edits inspection details. See the data structure and edit block to understand why two variables are declared.
  const [inspectionWWWData, setInspectionWWWData] = React.useState([]); //this is for Actual Width, Actual Weight and Cutable Width edited data is also stored in this as its data stucture is simple.
  const [batch, setBatch] = useState();

  const getInspectionData = async () => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_inspection_data`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: searchParams.get("batch"),
            roll: searchParams.get("roll"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const json = await response.json();
      if (json.length > 0) {
        setInspectionDataBefore(json);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateInspection = async () => {
    if (batch == "Select batch...") {
      setMsg("Batch Number");
    } else {
      try {
        const url = `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/update_inspection`;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: searchParams.get("batch"),
            roll: searchParams.get("roll"),
            roll_id: searchParams.get("roll_id"),
            USERID: localStorage.getItem("token"),
            inspectionData: inspectionData,
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

  const updateInspectionWWW = async () => {
    if (batch == "Select batch...") {
      setMsg("Batch Number");
    } else {
      try {
        const url = `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/update_inspection_www`;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: searchParams.get("batch"),
            roll_id: searchParams.get("roll_id"),
            USERID: localStorage.getItem("token"),
            inspectionWWWData: inspectionWWWData,
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
    document.title = "Edit Inspection";
    getInspectionData();
    if (localStorage.getItem("token") == null) {
      navigate("/");
    } else {
      if (!localStorage.getItem("permissions").includes("edit_inspection")) {
        return navigate("/access-denied");
      }
    }
  }, []);

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
        <div className="head-title">Edit Inspection</div>
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
      <div style={{ width: "100%" }}>
        <div className="table-section-edit-inspection">
          <div className="inspection-table-section">
            <div style={{ width: "50%" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 450 }} aria-label="simple table">
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#D2EBFE" }}>
                      <TableCell align="center">Defect</TableCell>
                      <TableCell align="center">One Point</TableCell>
                      <TableCell align="center">Two Point</TableCell>
                      <TableCell align="center">Three Point</TableCell>
                      <TableCell align="center">Four Point</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inspectionDataBefore.map((row) => (
                      <TableRow
                        key={row.DefectName}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          align="center"
                          style={{ backgroundColor: "#D2EBFE " }}
                        >
                          {row.DefectName}
                        </TableCell>
                        <TableCell align="center">
                          <span style={{ color: "blue" }}>{row.OnePoint}</span>
                          <span> --to-- </span>
                          <Input
                            style={{ width: "35px" }}
                            type="tel"
                            onChange={(event) => {
                              if (event.target.value.length < 1) {
                                setInspectionData(() => {
                                  // create copy of state object
                                  const copy = { ...inspectionData };

                                  // remove salary key from object
                                  delete copy[row.DefectCode];

                                  return copy;
                                });
                              } else {
                                setInspectionData({
                                  ...inspectionData,
                                  [row.DefectCode]: {
                                    ...inspectionData[row.DefectCode],
                                    OnePoint:
                                      event.target.value < 0
                                        ? null
                                        : event.target.value,
                                  },
                                });
                              }
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell align="center">
                          <span style={{ color: "blue" }}>{row.TwoPoint}</span>
                          <span> --to-- </span>
                          <Input
                            style={{ width: "35px" }}
                            type="tel"
                            onChange={(event) => {
                              if (event.target.value.length < 1) {
                                setInspectionData(() => {
                                  // create copy of state object
                                  const copy = { ...inspectionData };

                                  // remove salary key from object
                                  delete copy[row.DefectCode];

                                  return copy;
                                });
                              } else {
                                setInspectionData({
                                  ...inspectionData,
                                  [row.DefectCode]: {
                                    ...inspectionData[row.DefectCode],
                                    TwoPoint:
                                      event.target.value < 0
                                        ? null
                                        : parseInt(event.target.value),
                                  },
                                });
                              }
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell align="center">
                          <span style={{ color: "blue" }}>
                            {row.ThreePoint}
                          </span>
                          <span> --to-- </span>
                          <Input
                            style={{ width: "35px" }}
                            type="tel"
                            onChange={(event) => {
                              if (event.target.value.length < 1) {
                                setInspectionData(() => {
                                  // create copy of state object
                                  const copy = { ...inspectionData };

                                  // remove salary key from object
                                  delete copy[row.DefectCode];

                                  return copy;
                                });
                              } else {
                                setInspectionData({
                                  ...inspectionData,
                                  [row.DefectCode]: {
                                    ...inspectionData[row.DefectCode],
                                    ThreePoint:
                                      event.target.value < 0
                                        ? null
                                        : parseInt(event.target.value),
                                  },
                                });
                              }
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell align="center">
                          <span style={{ color: "blue" }}>{row.FourPoint}</span>
                          <span> --to-- </span>
                          <Input
                            style={{ width: "35px" }}
                            type="tel"
                            onChange={(event) => {
                              if (event.target.value.length < 1) {
                                setInspectionData(() => {
                                  // create copy of state object
                                  const copy = { ...inspectionData };

                                  // remove salary key from object
                                  delete copy[row.DefectCode];

                                  return copy;
                                });
                              } else {
                                setInspectionData({
                                  ...inspectionData,
                                  [row.DefectCode]: {
                                    ...inspectionData[row.DefectCode],
                                    FourPoint:
                                      event.target.value < 0
                                        ? null
                                        : parseInt(event.target.value),
                                  },
                                });
                              }
                            }}
                          ></Input>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  onClick={() => {
                    if (Object.keys(inspectionData).length > 0)
                      updateInspection();
                  }}
                >
                  Update
                </Button>
              </TableContainer>
            </div>
            <div style={{ width: "40%" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 250 }} aria-label="simple table">
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#D2EBFE" }}>
                      <TableCell align="center">Actual Weight</TableCell>
                      <TableCell align="center">Actual Width</TableCell>
                      <TableCell align="center">Cutable Width</TableCell>
                      <TableCell align="center">Inventory Code</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableCell align="center">
                      <span style={{ color: "blue" }}>
                        {inspectionDataBefore.length > 0
                          ? inspectionDataBefore[0].ActualRollWeight
                          : null}
                      </span>
                      <span> --to-- </span>
                      <Input
                        style={{ width: "35px" }}
                        type="tel"
                        onChange={(event) => {
                          setInspectionWWWData({
                            ...inspectionWWWData,
                            ActualRollWeight: event.target.value,
                          });
                        }}
                      ></Input>
                    </TableCell>
                    <TableCell align="center">
                      <span style={{ color: "blue" }}>
                        {inspectionDataBefore.length > 0
                          ? inspectionDataBefore[0].ActualRollWidth
                          : null}
                      </span>
                      <span> --to-- </span>
                      <Input
                        style={{ width: "35px" }}
                        type="tel"
                        onChange={(event) => {
                          setInspectionWWWData({
                            ...inspectionWWWData,
                            ActualRollWidth: event.target.value,
                          });
                        }}
                      ></Input>
                    </TableCell>
                    <TableCell align="center">
                      <span style={{ color: "blue" }}>
                        {inspectionDataBefore.length > 0
                          ? inspectionDataBefore[0].CutableWidth
                          : null}
                      </span>
                      <span> --to-- </span>
                      <Input
                        style={{ width: "35px" }}
                        type="tel"
                        onChange={(event) => {
                          setInspectionWWWData({
                            ...inspectionWWWData,
                            CutableWidth: event.target.value,
                          });
                        }}
                      ></Input>
                    </TableCell>
                    <TableCell align="center">
                      <span style={{ color: "blue" }}>
                        {inspectionDataBefore.length > 0
                          ? inspectionDataBefore[0].InventoryCode
                          : null}
                      </span>
                      <span> --to-- </span>
                      <Input
                        style={{ width: "90px" }}
                        onChange={(event) => {
                          setInspectionWWWData({
                            ...inspectionWWWData,
                            InventoryCode: event.target.value,
                          });
                        }}
                      ></Input>
                    </TableCell>
                  </TableBody>
                </Table>
                <Button
                  onClick={() => {
                    if (Object.keys(inspectionWWWData).length > 0)
                      updateInspectionWWW();
                  }}
                >
                  Update
                </Button>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
