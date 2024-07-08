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
import SearchableDropdown from "./SearchableDropdown";
import "../Css/AddGSM.css";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import HomeIcon from "@mui/icons-material/Home";

export default function EditGsmAndShade() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [inspectionDataBefore, setInspectionDataBefore] = React.useState([]); //this is for initial data, which will not been changed afrer the edit by user.
  const [inspectionData, setInspectionData] = React.useState([]); //this is the updated data after the user edits inspection details. See the data structure and edit block to understand why two var is declared.
  const [inspectionWWWData, setInspectionWWWData] = React.useState([]); //this is for Actual Width, Actual Weight and Cutable Width edited data is also stored in this as its data stucture is simple.
  const [batch, setBatch] = useState();
  const [gsmShadeDataBefore, setGsmShadeDataBefore] = useState({});
  const [gsmShadeData, setGsmShadeData] = useState({});

  const getGsmData = async () => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem("server-ip")}/inspaction/get_gsm_data`,
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
        setGsmShadeDataBefore(json);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateGsm = async () => {
    if (batch == "Select batch...") {
      setMsg("Batch Number");
    } else {
      try {
        const url = `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/update_gsm`;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: searchParams.get("batch"),
            roll: searchParams.get("roll"),
            USERID: localStorage.getItem("token"),
            gsmShadeData: gsmShadeData,
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
    document.title = "Edit GSM and Shade";
    getGsmData();
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
      <div>
        <div className="table-section-edit-gsm-shade">
          <div className="inspection-table-section">
            <div style={{ width: "700px" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 450 }} aria-label="simple table">
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#D2EBFE" }}>
                      <TableCell align="center">Roll Number</TableCell>
                      <TableCell align="center">GSM</TableCell>
                      <TableCell align="center">Shade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gsmShadeDataBefore.length > 0 &&
                      gsmShadeDataBefore.map((row) => (
                        <TableRow
                          key={row.roll_number}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            align="center"
                            style={{ backgroundColor: "#D2EBFE " }}
                          >
                            {row.roll_number}
                          </TableCell>
                          <TableCell align="center">
                            <span style={{ color: "blue" }}>{row.GSM}</span>
                            <span> --to-- </span>
                            <Input
                              style={{ width: "35px" }}
                              type="tel"
                              onChange={(event) => {
                                setGsmShadeData({
                                  ...gsmShadeData,
                                  GSM: event.target.value,
                                });
                              }}
                            ></Input>
                          </TableCell>
                          <TableCell align="center">
                            <span style={{ color: "blue" }}>{row.shade}</span>
                            <span> --to-- </span>
                            <Input
                              style={{ width: "35px" }}
                              onChange={(event) => {
                                setGsmShadeData({
                                  ...gsmShadeData,
                                  shade: event.target.value,
                                });
                              }}
                            ></Input>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <Button
                  onClick={() => {
                    if (Object.keys(gsmShadeData).length > 0) updateGsm();
                  }}
                >
                  Update
                </Button>
              </TableContainer>
            </div>
            {/* <div style={{ marginLeft: "2%" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 150 }} aria-label="simple table">
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#D2EBFE" }}>
                      <TableCell align="center">Actual Weight</TableCell>
                      <TableCell align="center">Actual Width</TableCell>
                      <TableCell align="center">Cutable width</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableCell>
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
                    <TableCell>
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
                    <TableCell>
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
