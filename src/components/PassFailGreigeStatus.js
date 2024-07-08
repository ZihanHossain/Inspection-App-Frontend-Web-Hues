import {
  Button,
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
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import ClearIcon from "@mui/icons-material/Clear";
import HomeIcon from "@mui/icons-material/Home";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/PassFailStatus.css";
import SearchableDropdown from "./SearchableDropdown";

const PassFailGreigeStatus = () => {
  const [batches, setBatches] = React.useState([]);
  const [batch, setBatch] = useState();
  const [data, setData] = useState([]);
  const [shrinkage, setShrinkage] = useState(0);
  const [oComment, setOComment] = useState("");
  const [alrtMsg, setAlrtMsg] = useState(
    "Select and search a batch to see the report..."
  );
  const [statusData, setStatusData] = useState({});
  const status = [
    { id: 1, st: "Pass" },
    { id: 2, st: "Fail" },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Pass Fail Status";
    if (localStorage.getItem("token") == null) {
      navigate("/");
    } else {
      if (!localStorage.getItem("permissions").includes("pass_fail_status")) {
        return navigate("/access-denied");
      }
    }
  }, []);

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

  const getBatchStatus = async () => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_batch_status`,
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
        return json;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async () => {
    try {
      const batchStatus = await getBatchStatus();

      const trigger = batchStatus.some((element) => {
        return element.InspectionStatus === "Done";
      });

      if (trigger) {
        try {
          const response = await fetch(
            `http://${localStorage.getItem(
              "server-ip"
            )}/inspaction/get_data_for_passfail`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                batch,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
          }

          const json = await response.json();
          if (json.length > 0) {
            setData(json);
            setShrinkage(json[0].shrinkage);
            setOComment(json[0].OverallComment);

            const updatedStatusData = { ...statusData };
            json.forEach((element) => {
              updatedStatusData[element.roll_number] = {
                grade: element.status,
                Comment: element.Comment,
                DMtr: element.DefectiveMtr,
              };
            });

            setStatusData(updatedStatusData);
            console.log(updatedStatusData);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setAlrtMsg(
          "This batch is not complete. Please complete all the processes first."
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmStatus = async () => {
    if (batch == "Select batch...") {
      setMsg("Batch Number");
    } else {
      try {
        const url = `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/confirm_status`;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bNumber: batch,
            shrinkage,
            oComment,
            statusData,
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

  const shadeNotOk = async (id) => {
    try {
      const url = `http://${localStorage.getItem(
        "server-ip"
      )}/inspaction/shade_not_ok`;
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      };

      const response = await fetch(url, options);
      const json = await response.text();
      if (json == "success") {
        getData();
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleClose = (uri, roll, roll_id) => {
    const propsData = {
      batch: bNumber,
      roll: roll,
      roll_id: roll_id,
    };

    navigate(uri, { state: propsData });
    setAnchorEl(null);
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
        <div className="head-title">Pass Fail Status</div>
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
      <div className="bottom-section-passfail">
        <div className="batch-number-passfail">
          <div className="batch-number-dropdown-passfail">
            <div className="dropdown-legend font-sizeM">Batch Number</div>
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
            <Button variant="contained" onClick={() => getData()}>
              Search
            </Button>
          </div>
        </div>
        {data.length < 1 ? (
          <div className="report-section-passfail">
            <div>{alrtMsg}</div>
          </div>
        ) : (
          <form onSubmit={() => confirmStatus()}>
            <div className="report-section-passfail">
              <div className="report-head-section-passfail">
                <div className="report-head-left-section-pasfail">
                  <div className="data-block-passfail">
                    <div className="data-block-title-passfail font-sizeS">
                      Buyer:{" "}
                    </div>
                    <div className="font-sizeS" style={{ marginLeft: "1%" }}>
                      {data.length < 1 ? "" : data[0].customer}
                    </div>
                  </div>
                  <div className="data-block-passfail">
                    <div className="data-block-title-passfail font-sizeS">
                      Fabrication:{" "}
                    </div>
                    <div className="font-sizeS" style={{ marginLeft: "5px" }}>
                      {data.length < 1 ? "" : data[0].fabricname}
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div
                      className="data-block-passfail"
                      style={{ marginRight: "1%" }}
                    >
                      <div className="data-block-title-passfail font-sizeS">
                        Finish GSM:
                      </div>
                      <div className="font-sizeS" style={{ marginLeft: "5px" }}>
                        {data.length < 1 ? "" : data[0].FinishGSM}
                      </div>
                    </div>
                    <div
                      className="data-block-passfail"
                      style={{ marginRight: "1%" }}
                    >
                      <div className="data-block-title-passfail font-sizeS">
                        Finish Width:
                      </div>
                      <div className="font-sizeS" style={{ marginLeft: "5px" }}>
                        {data.length < 1 ? "" : data[0].FinishWidth}
                      </div>
                    </div>
                    <div className="data-block-passfail">
                      <div className="data-block-title-passfail font-sizeS">
                        WFX Po:{" "}
                      </div>
                      <div className="font-sizeS" style={{ marginLeft: "5px" }}>
                        {data.length < 1 ? "" : data[0].WFX_PO}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="report-head-right-section-pasfail">
                  <div className="data-block-passfail">
                    <div className="data-block-title-passfail font-sizeS">
                      Color:{" "}
                    </div>
                    <div className="font-sizeS" style={{ marginLeft: "5px" }}>
                      {data.length < 1 ? "" : data[0].shade}
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div className="data-block-passfail">
                      <div className="data-block-title-passfail font-sizeS">
                        Batch QTY:{" "}
                      </div>
                      <div className="font-sizeS" style={{ marginLeft: "5px" }}>
                        {data.length < 1 ? "" : data[0].batch_qty}
                      </div>
                    </div>
                    <div
                      className="data-block-passfail"
                      style={{ backgroundColor: "white" }}
                    >
                      <div
                        className="data-block-title-passfail font-sizeS"
                        style={{ paddingTop: "1%", width: "175px" }}
                      >
                        Shrinkage:
                      </div>
                      <div>
                        <Input
                          className="font-sizeS"
                          style={{ marginLeft: "1%" }}
                          type="number"
                          required
                          value={shrinkage}
                          onChange={(event) => {
                            setShrinkage(event.target.value);
                          }}
                        ></Input>
                      </div>
                    </div>
                    <div className="data-block-passfail">
                      <div className="data-block-title-passfail font-sizeS">
                        Effective MTR:
                      </div>
                      <div className="font-sizeS" style={{ marginLeft: "5px" }}>
                        {data.length < 1
                          ? ""
                          : (
                              data[data.length - 1].running_sum_AL -
                              (data[data.length - 1].running_sum_AL *
                                (shrinkage / 100) +
                                data[data.length - 1].running_sum_NHD)
                            ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="report-body-section-passfail"
                style={{ height: "100%", overflow: "auto" }}
              >
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ fontSize: 12 }}>
                          Roll Number
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>
                          Total Defects
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>
                          Total Points
                        </TableCell>
                        <TableCell sx={{ fontSize: 9 }}>
                          Actual Width(inch)
                        </TableCell>
                        <TableCell sx={{ fontSize: 9 }}>Actual GSM</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>Shade</TableCell>
                        <TableCell sx={{ fontSize: 9 }}>
                          Roll Weight (KG)
                        </TableCell>
                        <TableCell sx={{ fontSize: 9 }}>
                          Actual Length (MTR)
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>Point Rate</TableCell>
                        <TableCell sx={{ fontSize: 9 }}>High Defects</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>
                          Effective MTR
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>Grade</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>Comments</TableCell>
                        <TableCell sx={{ fontSize: 9 }}>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row) => (
                        <TableRow key={row.roll_number} className="p">
                          <TableCell align="center">
                            {row.roll_number}
                          </TableCell>
                          <TableCell align="center">
                            {row.TotalDefects}
                          </TableCell>
                          <TableCell align="center">
                            {row.TotalPoints}
                          </TableCell>
                          <TableCell align="center">
                            {row.ActualRollWidth}
                          </TableCell>
                          <TableCell align="center">{row.GSM}</TableCell>
                          <TableCell align="center">{row.roll_shade}</TableCell>
                          <TableCell align="center">
                            {row.ActualRollWeight}
                          </TableCell>
                          <TableCell align="center">
                            {row.ActualLength}
                          </TableCell>
                          <TableCell align="center">{row.PointRate}</TableCell>
                          <TableCell align="center">
                            {row.NoOfHighDefects}
                          </TableCell>
                          <TableCell align="center">
                            {(
                              row.ActualLength -
                              (row.ActualLength * (shrinkage / 100) +
                                row.NoOfHighDefects)
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <div>
                              <SearchableDropdown
                                options={status}
                                label="st"
                                id="id"
                                selectedVal={statusData[row.roll_number].grade}
                                handleChange={(val) => {
                                  setStatusData({
                                    ...statusData,
                                    [row.roll_number]: {
                                      ...statusData[row.roll_number],
                                      grade: val,
                                    },
                                  });
                                }}
                              />
                            </div>
                          </TableCell>
                          {/* <TableCell align="center">
                            <Input
                              type="number"
                              value={statusData[row.roll_number].DMtr}
                              onChange={(event) => {
                                setStatusData({
                                  ...statusData,
                                  [row.roll_number]: {
                                    ...statusData[row.roll_number],
                                    DMtr: event.target.value,
                                  },
                                });
                              }}
                            ></Input>
                          </TableCell> */}
                          <TableCell align="center">
                            <Input
                              placeholder="comment..."
                              value={statusData[row.roll_number].Comment}
                              onChange={(event) => {
                                setStatusData({
                                  ...statusData,
                                  [row.roll_number]: {
                                    ...statusData[row.roll_number],
                                    Comment: event.target.value,
                                  },
                                });
                              }}
                            ></Input>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              style={{ fontSize: "10px" }}
                              startIcon={<ClearIcon style={{ color: "red" }} />}
                              onClick={() => shadeNotOk(row.roll_details_id)}
                            ></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {data.length > 0 ? (
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell align="center">
                            {data[data.length - 1].running_sum_AWI.toFixed(2)}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell align="center">
                            {data[data.length - 1].running_sum_AWE.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            {data[data.length - 1]?.running_sum_AL?.toFixed(2)}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell align="center">
                            {data[data.length - 1].running_sum_NHD}
                          </TableCell>
                          <TableCell align="center" colSpan={5}>
                            <div
                              style={{
                                backgroundColor: "white",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  paddingTop: "1.5%",
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                              >
                                Overall Comment:{" "}
                              </div>
                              <div>
                                <Input
                                  style={{ marginLeft: "4%" }}
                                  placeholder="Comment..."
                                  value={oComment}
                                  onChange={(event) =>
                                    setOComment(event.target.value)
                                  }
                                ></Input>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="save-button">
                <button type="submit" className="buttonStyles">
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PassFailGreigeStatus;
