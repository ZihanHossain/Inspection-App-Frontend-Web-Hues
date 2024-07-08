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
import "../Css/ExcessSplit.css";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import HomeIcon from "@mui/icons-material/Home";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import AddIcon from "@mui/icons-material/Add";
import SwapVertTwoToneIcon from "@mui/icons-material/SwapVertTwoTone";

export default function ExcessSplit() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  //this is for initial data, which will not been changed after the edit by user.
  const [inspectionDataBefore, setInspectionDataBefore] = React.useState([]);
  //this is the updated data after the user edits inspection details. See the data structure and edit block to understand why two variables are declared.
  const [inspectionData, setInspectionData] = React.useState([]);
  //
  const [actualRollWeight, setActualRollWeight] = React.useState();
  //
  const [actualRollWeightSplit, setActualRollWeightSplit] = React.useState(0);
  //
  const [excessRollNumber, setExcessRollNumber] = React.useState("");
  //this is for initial data, which will not been changed after the edit by user (for split roll).
  const [inspectionDataBeforeSplit, setInspectionDataBeforeSplit] =
    React.useState([]);
  //this is the updated data after the user edits inspection details. See the data structure and edit block to understand why two variables are declared (for split roll).
  const [inspectionDataSplit, setInspectionDataSplit] = React.useState([]);

  const [onePointCount, setOnePointCount] = React.useState({
    initial: 0,
    actual: 0,
    split: 0,
  });
  const [twoPointCount, setTwoPointCount] = React.useState({
    initial: 0,
    actual: 0,
    split: 0,
  });
  const [threePointCount, setThreePointCount] = React.useState({
    initial: 0,
    actual: 0,
    split: 0,
  });
  const [fourPointCount, setFourPointCount] = React.useState({
    initial: 0,
    actual: 0,
    split: 0,
  });

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
        let data = [];
        let oneCount = 0;
        let twoCount = 0;
        let threeCount = 0;
        let fourCount = 0;
        let inspectionDataTemp = {};

        setInspectionDataBefore(json);

        json.map((item) => {
          let defect_info = {
            OnePoint: item.OnePoint,
            TwoPoint: item.TwoPoint,
            ThreePoint: item.ThreePoint,
            FourPoint: item.FourPoint,
          };
          inspectionDataTemp[item.DefectCode] = defect_info;
        });
        setInspectionData(inspectionDataTemp);

        json.map((item) => {
          if (item.OnePoint > 0) {
            oneCount += item.OnePoint;
          }
          if (item.TwoPoint > 0) {
            twoCount += item.TwoPoint;
          }
          if (item.ThreePoint > 0) {
            threeCount += item.ThreePoint;
          }
          if (item.FourPoint > 0) {
            fourCount += item.FourPoint;
          }
          data.push({
            ...item,
            OnePoint: 0,
            TwoPoint: 0,
            ThreePoint: 0,
            FourPoint: 0,
          });
        });
        setInspectionDataBeforeSplit(data);

        setOnePointCount({
          ...onePointCount,
          initial: oneCount,
        });
        setTwoPointCount({
          ...twoPointCount,
          initial: twoCount,
        });
        setThreePointCount({
          ...threePointCount,
          initial: threeCount,
        });
        setFourPointCount({
          ...fourPointCount,
          initial: fourCount,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (
      onePointCount.actual + onePointCount.split != onePointCount.initial ||
      twoPointCount.actual + twoPointCount.split != twoPointCount.initial ||
      threePointCount.actual + threePointCount.split !=
        threePointCount.initial ||
      fourPointCount.actual + fourPointCount.split != fourPointCount.initial
    ) {
      alert("Initial Points and Updated Points does not match.");
    } else if (actualRollWeightSplit < 0.1 || isNaN(actualRollWeightSplit)) {
      alert("Actual Weight for excess roll can not be less than 0.1.");
    } else if (excessRollNumber.length < 1) {
      alert("Excess Roll Number needs to be filled.");
    } else {
      let excessRoll = {};
      if (inspectionDataSplit.length < 1) {
        excessRoll = {
          "E-1": { OnePoint: 0, TwoPoint: 0, ThreePoint: 0, FourPoint: 0 },
        };
      } else {
        excessRoll = inspectionDataSplit;
      }
      console.log(inspectionData);
      try {
        const url = `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/split_roll`;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: searchParams.get("batch"),
            roll: searchParams.get("roll"),
            split_roll: excessRollNumber,
            roll_id: searchParams.get("roll_id"),
            ActualRollWeight: actualRollWeight,
            ActualRollWeightSplit: actualRollWeightSplit,
            USERID: localStorage.getItem("token"),
            inspectionData: inspectionData,
            inspectionDataSplit: excessRoll,
          }),
        };

        const response = await fetch(url, options);
        const json = await response.text();
        console.log(json);
        if (json == "done") {
          window.location.reload();
        }
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }
  };

  const handleCalculatePoints = () => {
    let onePointActual = 0;
    let twoPointActual = 0;
    let threePointActual = 0;
    let fourPointActual = 0;
    let onePointSplit = 0;
    let twoPointSplit = 0;
    let threePointSplit = 0;
    let fourPointSplit = 0;
    let count = 0;
    Object.entries(inspectionData).map((entry) => {
      let key = entry[0];
      let value = entry[1];
      value.OnePoint == null
        ? onePointActual
        : (onePointActual += value.OnePoint);
      value.TwoPoint == null
        ? twoPointActual
        : (twoPointActual += value.TwoPoint);
      value.ThreePoint == null
        ? threePointActual
        : (threePointActual += value.ThreePoint);
      value.FourPoint == null
        ? fourPointActual
        : (fourPointActual += value.FourPoint);
      count += 1;
    });
    Object.entries(inspectionDataSplit).map((entry) => {
      let value = entry[1];
      console.log(value);
      value.OnePoint == null
        ? onePointSplit
        : (onePointSplit += value.OnePoint);
      value.TwoPoint == null
        ? twoPointSplit
        : (twoPointSplit += value.TwoPoint);
      value.ThreePoint == null
        ? threePointSplit
        : (threePointSplit += value.ThreePoint);
      value.FourPoint == null
        ? fourPointSplit
        : (fourPointSplit += value.FourPoint);
    });
    setOnePointCount({
      ...onePointCount,
      actual: onePointActual,
      split: onePointSplit,
    });
    setTwoPointCount({
      ...twoPointCount,
      actual: twoPointActual,
      split: twoPointSplit,
    });
    setThreePointCount({
      ...threePointCount,
      actual: threePointActual,
      split: threePointSplit,
    });
    setFourPointCount({
      ...fourPointCount,
      actual: fourPointActual,
      split: fourPointSplit,
    });
  };

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Excess Split";
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
    <div className="card-container" style={{ justifyContent: "start" }}>
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
        <div className="head-title">Excess/Split</div>
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
      <div className="table-section-edit-inspection">
        {/* Existing roll configaration */}
        <div className="inspection-table-section">
          <div style={{ width: "100%", marginRight: "2%" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 450 }} aria-label="simple table">
                <TableHead>
                  <TableRow style={{ backgroundColor: "#D2EBFE" }}>
                    <TableCell align="center">Defects</TableCell>
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
                            } else {
                              if (event.target.value > row.OnePoint - 1) {
                                alert(
                                  "Value can not be grater than the original value."
                                );
                                setInspectionData({
                                  ...inspectionData,
                                  [row.DefectCode]: {
                                    ...inspectionData[row.DefectCode],
                                    OnePoint: row.OnePoint,
                                  },
                                });
                                setInspectionDataSplit(() => {
                                  // create copy of state object
                                  const copy = { ...inspectionDataSplit };

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
                                        : parseInt(event.target.value),
                                  },
                                });
                                setInspectionDataSplit({
                                  ...inspectionDataSplit,
                                  [row.DefectCode]: {
                                    ...inspectionDataSplit[row.DefectCode],
                                    OnePoint:
                                      event.target.value < 0
                                        ? null
                                        : row.OnePoint -
                                          parseInt(event.target.value),
                                  },
                                });
                              }
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
                            if (
                              event.target.value.length < 1 ||
                              event.target.value > row.TwoPoint - 1
                            ) {
                              setInspectionData({
                                ...inspectionData,
                                [row.DefectCode]: {
                                  ...inspectionData[row.DefectCode],
                                  TwoPoint: row.TwoPoint,
                                },
                              });
                              setInspectionDataSplit(() => {
                                // create copy of state object
                                const copy = { ...inspectionDataSplit };

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
                              setInspectionDataSplit({
                                ...inspectionDataSplit,
                                [row.DefectCode]: {
                                  ...inspectionDataSplit[row.DefectCode],
                                  TwoPoint:
                                    event.target.value < 0
                                      ? null
                                      : row.TwoPoint -
                                        parseInt(event.target.value),
                                },
                              });
                            }
                          }}
                        ></Input>
                      </TableCell>
                      <TableCell align="center">
                        <span style={{ color: "blue" }}>{row.ThreePoint}</span>
                        <span> --to-- </span>
                        <Input
                          style={{ width: "35px" }}
                          type="tel"
                          onChange={(event) => {
                            if (
                              event.target.value.length < 1 ||
                              event.target.value > row.ThreePoint - 1
                            ) {
                              setInspectionData({
                                ...inspectionData,
                                [row.DefectCode]: {
                                  ...inspectionData[row.DefectCode],
                                  ThreePoint: row.ThreePoint,
                                },
                              });
                              setInspectionDataSplit(() => {
                                // create copy of state object
                                const copy = { ...inspectionDataSplit };

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
                              setInspectionDataSplit({
                                ...inspectionDataSplit,
                                [row.DefectCode]: {
                                  ...inspectionDataSplit[row.DefectCode],
                                  ThreePoint:
                                    event.target.value < 0
                                      ? null
                                      : row.ThreePoint -
                                        parseInt(event.target.value),
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
                          fullWidth="true"
                          onChange={(event) => {
                            if (
                              event.target.value.length < 1 ||
                              event.target.value > row.FourPoint - 1
                            ) {
                              setInspectionData({
                                ...inspectionData,
                                [row.DefectCode]: {
                                  ...inspectionData[row.DefectCode],
                                  FourPoint: row.FourPoint,
                                },
                              });
                              setInspectionDataSplit(() => {
                                // create copy of state object
                                const copy = { ...inspectionDataSplit };

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
                              setInspectionDataSplit({
                                ...inspectionDataSplit,
                                [row.DefectCode]: {
                                  ...inspectionDataSplit[row.DefectCode],
                                  FourPoint:
                                    event.target.value < 0
                                      ? null
                                      : row.FourPoint -
                                        parseInt(event.target.value),
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
            </TableContainer>
          </div>
        </div>
        {/* Split roll configaration */}
        {/* <div className="inspection-table-section">
          <div style={{ width: "650px", marginRight: "2%" }}>
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
                  {inspectionDataBeforeSplit.map((row) => (
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
                              setInspectionDataSplit(() => {
                                // create copy of state object
                                const copy = { ...inspectionDataSplit };

                                // remove salary key from object
                                delete copy[row.DefectCode];

                                return copy;
                              });
                            } else {
                              setInspectionDataSplit({
                                ...inspectionDataSplit,
                                [row.DefectCode]: {
                                  ...inspectionDataSplit[row.DefectCode],
                                  OnePoint:
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
                        <span style={{ color: "blue" }}>{row.TwoPoint}</span>
                        <span> --to-- </span>
                        <Input
                          style={{ width: "35px" }}
                          type="tel"
                          onChange={(event) => {
                            if (event.target.value.length < 1) {
                              setInspectionDataSplit(() => {
                                // create copy of state object
                                const copy = { ...inspectionDataSplit };

                                // remove salary key from object
                                delete copy[row.DefectCode];

                                return copy;
                              });
                            } else {
                              setInspectionDataSplit({
                                ...inspectionDataSplit,
                                [row.DefectCode]: {
                                  ...inspectionDataSplit[row.DefectCode],
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
                        <span style={{ color: "blue" }}>{row.ThreePoint}</span>
                        <span> --to-- </span>
                        <Input
                          style={{ width: "35px" }}
                          type="tel"
                          onChange={(event) => {
                            if (event.target.value.length < 1) {
                              setInspectionDataSplit(() => {
                                // create copy of state object
                                const copy = { ...inspectionDataSplit };

                                // remove salary key from object
                                delete copy[row.DefectCode];

                                return copy;
                              });
                            } else {
                              setInspectionDataSplit({
                                ...inspectionDataSplit,
                                [row.DefectCode]: {
                                  ...inspectionDataSplit[row.DefectCode],
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
                              setInspectionDataSplit(() => {
                                // create copy of state object
                                const copy = { ...inspectionDataSplit };

                                // remove salary key from object
                                delete copy[row.DefectCode];

                                return copy;
                              });
                            } else {
                              setInspectionDataSplit({
                                ...inspectionDataSplit,
                                [row.DefectCode]: {
                                  ...inspectionDataSplit[row.DefectCode],
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
            </TableContainer>
          </div>
        </div> */}
        <div className="inspection-table-section">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 150 }} aria-label="simple table">
              <TableHead>
                <TableRow style={{ backgroundColor: "#D2EBFE" }}>
                  <TableCell align="center">Actual Weight (Actual)</TableCell>
                  <TableCell align="center">Actual Weight (Split)</TableCell>
                  <TableCell align="center">Actual Roll Number</TableCell>
                  <TableCell align="center">Excess Roll Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
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
                        setActualRollWeight(parseFloat(event.target.value));
                        setActualRollWeightSplit(
                          (
                            inspectionDataBefore[0].ActualRollWeight -
                            parseFloat(event.target.value)
                          ).toFixed(2)
                        );
                      }}
                    ></Input>
                  </TableCell>
                  <TableCell align="center">
                    <span style={{ color: "blue" }}>
                      {actualRollWeightSplit}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {searchParams.get("roll")}
                  </TableCell>
                  <TableCell align="center">
                    <span>Excess Roll Number: </span>
                    <Input
                      style={{ width: "100px" }}
                      type="tel"
                      onChange={(event) => {
                        setExcessRollNumber(event.target.value);
                      }}
                    ></Input>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleCalculatePoints()}
                    >
                      Calculate Input
                    </Button>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <Button variant="contained" onClick={() => handleSave()}>
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div className="point-calculation-table">
        <div className="section1">
          <span className="section-title">
            <div>Actual</div>
          </span>
          <span>
            <ArrowRightAltIcon />
          </span>
          <span className="section-data">
            <div className="section-data-part">
              OnePoint: <span className="data">{onePointCount.actual}</span>
            </div>
            <div className="section-data-part">
              TwoPoint: <span className="data">{twoPointCount.actual}</span>
            </div>
            <div className="section-data-part">
              ThreePoint: <span className="data">{threePointCount.actual}</span>
            </div>
            <div className="section-data-part">
              FourPoint: <span className="data">{fourPointCount.actual}</span>
            </div>
          </span>
        </div>
        <div style={{ display: "flex" }}>
          <AddIcon style={{ marginLeft: "10.5%" }} />
          <AddIcon style={{ marginLeft: "21.5%" }} />
          <AddIcon style={{ marginLeft: "21.7%" }} />
          <AddIcon style={{ marginLeft: "21.5%" }} />
        </div>
        <div className="section1">
          <span className="section-title">
            <div>Split</div>
          </span>
          <span>
            <ArrowRightAltIcon />
          </span>
          <span className="section-data">
            <div className="section-data-part">
              OnePoint: <span className="data">{onePointCount.split}</span>
            </div>
            <div className="section-data-part">
              TwoPoint: <span className="data">{twoPointCount.split}</span>
            </div>
            <div className="section-data-part">
              ThreePoint: <span className="data">{threePointCount.split}</span>
            </div>
            <div className="section-data-part">
              FourPoint: <span className="data">{fourPointCount.split}</span>
            </div>
          </span>
        </div>
        <div style={{ border: "1px solid black" }}></div>
        <div className="section1">
          <span className="section-title">
            <div>Updated</div>
          </span>
          <span>
            <ArrowRightAltIcon />
          </span>
          <span className="section-data">
            <div className="section-data-part">
              OnePoint:{" "}
              <span className="data">
                {onePointCount.split + onePointCount.actual}
              </span>
            </div>
            <div className="section-data-part">
              TwoPoint:{" "}
              <span className="data">
                {twoPointCount.split + twoPointCount.actual}
              </span>
            </div>
            <div className="section-data-part">
              ThreePoint:{" "}
              <span className="data">
                {threePointCount.split + threePointCount.actual}
              </span>
            </div>
            <div className="section-data-part">
              FourPoint:{" "}
              <span className="data">
                {fourPointCount.split + fourPointCount.actual}
              </span>
            </div>
          </span>
        </div>
        <div style={{ display: "flex" }}>
          <SwapVertTwoToneIcon style={{ marginLeft: "10.5%" }} />
          <SwapVertTwoToneIcon style={{ marginLeft: "21.5%" }} />
          <SwapVertTwoToneIcon style={{ marginLeft: "21.7%" }} />
          <SwapVertTwoToneIcon style={{ marginLeft: "21.5%" }} />
        </div>
        <div className="section1">
          <span className="section-title">
            <div>Initial</div>
          </span>
          <span>
            <ArrowRightAltIcon />
          </span>
          <span className="section-data">
            <div className="section-data-part">
              OnePoint: {onePointCount.initial}
            </div>
            <div className="section-data-part">
              TwoPoint: {twoPointCount.initial}
            </div>
            <div className="section-data-part">
              ThreePoint: {threePointCount.initial}
            </div>
            <div className="section-data-part">
              FourPoint: {fourPointCount.initial}
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}
