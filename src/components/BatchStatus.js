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
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import "../Css/BatchStatus.css";
import SearchableDropdown from "./SearchableDropdown";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import CircleIcon from "@mui/icons-material/Circle";
import HeaderBar from "./HeaderBar";
import NavPanel from "./NavPanel";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("body");

const BatchStatus = () => {
  const [bNumber, setBNumber] = useState("");
  const [batches, setBatches] = useState([]);
  const [status, setStatus] = useState([]);
  const [reprocessBatchInfo, setReprocessBatchInfo] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [searchPressed, setSearchPressed] = useState(false);

  const navigate = useNavigate();

  const handleClose = (uri, roll, roll_id) => {
    const propsData = {
      batch: bNumber,
      roll: roll,
      roll_id: roll_id,
    };

    const queryParameters = new URLSearchParams(propsData).toString();
    const excessSplitUrl = `${uri}?${queryParameters}`;

    // Open the second page in a new tab
    window.open(excessSplitUrl, "_blank");
  };

  useEffect(() => {
    document.title = "Batch Status";
    if (localStorage.getItem("token") == null) navigate("/");
  }, []);

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
    } catch (error) {
      console.error(error);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

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
            bNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const json = await response.json();
      if (json.length > 0) {
        setStatus(json);
        setSearchPressed(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function openModal() {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/make_reprocessBatchDetails`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batch: bNumber,
          }),
        }
      );

      const responseBody = await response.text(); // Read the response body once

      if (responseBody === "incomplete") {
        alert(
          "Reprocess of this batch is not inspected. To mark it as reprocess again you need to complete the previous reprocess batch inspection."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const json = JSON.parse(responseBody); // Convert the response text to JSON
      setReprocessBatchInfo(json);
    } catch (error) {
      console.error(error);
    }
    setIsOpen(true);
  }

  async function handleConfirm() {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/save_reprocesBatch`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reprocessBatchInfo: reprocessBatchInfo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      } else {
        ("");
        closeModal();
      }

      const json = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="card-container">
      <HeaderBar title="Batch Status" module="fabric" />
      <div className="bottom-section">
        <NavPanel />
        <div className="bottom-right-section">
          <div style={{ width: "80%" }}>
            <div className="batch-number-status">
              <div className="batch-number-dropdown-passfail">
                <div className="dropdown-legend">Batch Number</div>
                <div className="dropdown-passfail">
                  <SearchableDropdown
                    options={batches}
                    label="WorkOrderId"
                    id="id"
                    selectedVal={bNumber}
                    onSearch={getBatchs}
                    handleChange={(val) => {
                      setBNumber(val);
                    }}
                  />
                </div>
              </div>
              <div className="search-roll-button">
                <Button variant="contained" onClick={() => getBatchStatus()}>
                  Search
                </Button>
              </div>
              {localStorage
                .getItem("permissions")
                .includes("batch_reprocess") ? (
                isNaN(status) ? (
                  bNumber != "" && status[0].reprocess == 0 && searchPressed ? (
                    <div className="search-roll-button">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => openModal()}
                      >
                        Reprocess
                      </Button>
                    </div>
                  ) : (
                    <div></div>
                  )
                ) : (
                  <div></div>
                )
              ) : (
                <div></div>
              )}
            </div>
            <div>
              <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Reprocess"
              >
                <h2>Confirm Reprocess Batch</h2>
                {reprocessBatchInfo.length < 1 ? (
                  <div>Nothing to show</div>
                ) : (
                  <div>
                    <div style={{ display: "flex" }}>
                      <div style={{ paddingRight: "15px" }}>
                        <div
                          style={{
                            backgroundColor: "#e387ff",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                        >
                          Reprocess Batch No: {reprocessBatchInfo[0]}
                        </div>
                        <div style={{ marginTop: "5px" }}>
                          Customer: {reprocessBatchInfo[2][0].customer}
                        </div>
                        <div style={{ marginTop: "5px" }}>
                          Shade: {reprocessBatchInfo[2][0].shade}
                        </div>
                        <div style={{ marginTop: "5px" }}>
                          Finish GSM: {reprocessBatchInfo[2][0].FinishGSM}
                        </div>
                        <div style={{ marginTop: "5px" }}>
                          Supplier: {reprocessBatchInfo[2][0].supplier}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            backgroundColor: "#d20000",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                        >
                          Reprocess Count:{" "}
                          <span style={{ color: "white" }}>
                            {reprocessBatchInfo[1] - 1}
                          </span>
                        </div>
                        {/* <div
                    style={{
                      marginTop: "5px",
                      padding: "2px",
                      backgroundColor: "#ffffcc",
                    }}
                  >
                    Rolls:
                    <TableContainer sx={{ maxHeight: 150 }}>
                      <Table>
                        <TableBody>
                          {reprocessBatchInfo[2].map((item) => (
                            <TableRow>
                              <TableCell>{item.roll_number}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div> */}
                      </div>
                    </div>
                    <Button
                      style={{
                        backgroundColor: "#e387ff",
                        border: 0,
                        borderRadius: "5px",
                        padding: "5px",
                        letterSpacing: "2px",
                      }}
                      onClick={() => handleConfirm()}
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </Modal>
            </div>

            <div className="table-section-add-machines">
              <div
                className="info-table-status"
                style={{ height: "80%", width: "100%", overflow: "auto" }}
              >
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 550 }} aria-label="simple table">
                    <TableHead>
                      <TableRow style={{ backgroundColor: "#D2EBFE" }}>
                        <TableCell align="center">Roll Number</TableCell>
                        <TableCell align="center">Inspection Status</TableCell>
                        <TableCell align="center">GSM Status</TableCell>
                        <TableCell align="center">Shade Status</TableCell>
                        <TableCell align="center">
                          High Defects Status
                        </TableCell>
                        <TableCell align="center">Pass Fail Status</TableCell>
                        <TableCell align="center">Edit Inspection</TableCell>
                        <TableCell align="center">Edit Sahde or GSM</TableCell>
                        {localStorage
                          .getItem("permissions")
                          .includes("split_roll_for_excess_qty") ? (
                          <TableCell align="center">Excess/Split</TableCell>
                        ) : (
                          <div></div>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {status.map((row) => (
                        <TableRow
                          key={row.Id}
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
                          <TableCell
                            align="center"
                            style={{
                              backgroundColor:
                                row.InspectionStatus === "Done"
                                  ? "#34A119"
                                  : "red",
                              color: "white",
                            }}
                          >
                            {row.InspectionStatus}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              backgroundColor:
                                row.GsmStatus === "Done" ? "#34A119" : "red",
                              color: "white",
                            }}
                          >
                            {row.GsmStatus}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              backgroundColor:
                                row.ShadeStatus === "Done" ? "#34A119" : "red",
                              color: "white",
                            }}
                          >
                            {row.ShadeStatus}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              backgroundColor:
                                row.NoOfHighDefectsStatus === "Done"
                                  ? "#34A119"
                                  : "red",
                              color: "white",
                            }}
                          >
                            {row.NoOfHighDefectsStatus}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              backgroundColor:
                                row.PassFailStatus === "Done"
                                  ? "#34A119"
                                  : "red",
                              color: "white",
                            }}
                          >
                            {row.PassFailStatus}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              style={{ fontSize: "10px" }}
                              onClick={() => {
                                handleClose(
                                  "/edit_inspection",
                                  row.roll_number,
                                  row.roll_id
                                );
                              }}
                            >
                              <FindReplaceIcon color="action" />
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              style={{ fontSize: "10px" }}
                              onClick={() => {
                                handleClose(
                                  "/edit_gsmandshade",
                                  row.roll_number,
                                  row.roll_id
                                );
                              }}
                            >
                              <CircleIcon color="action" />
                            </Button>
                          </TableCell>
                          {localStorage
                            .getItem("permissions")
                            .includes("split_roll_for_excess_qty") ? (
                            <TableCell align="center">
                              <Button
                                disabled={
                                  row.InspectionStatus === "Done" &&
                                  row.GsmStatus === "Done" &&
                                  row.ShadeStatus === "Done"
                                    ? false
                                    : true
                                }
                                style={{ fontSize: "10px" }}
                                onClick={() => {
                                  handleClose(
                                    "/excess_split",
                                    row.roll_number,
                                    row.roll_id
                                  );
                                }}
                              >
                                <CallSplitIcon />
                              </Button>
                              {/* <Link
                          to={"/excess_split"}
                          target="_blank"
                          state={{
                            batch: bNumber,
                            roll: row.roll_number,
                            roll_id: row.roll_id,
                          }}
                        >
                          Press
                        </Link> */}
                            </TableCell>
                          ) : (
                            <div></div>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchStatus;
