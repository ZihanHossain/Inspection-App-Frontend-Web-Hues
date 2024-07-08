import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchableDropdown from "./SearchableDropdown";
import HeaderBar from "./HeaderBar";
// import '../Css/UserPermission.css';

const UserPermission = () => {
  const [users, setUsers] = useState([]);
  const [eId, setEId] = useState();
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      navigate("/");
    } else {
      if (!localStorage.getItem("permissions").includes("user_permission")) {
        return navigate("/access-denied");
      }
    }
    getUsers();
    getPermissions();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem("server-ip")}/inspaction/get_users`,
        {
          method: "GET",
        }
      );
      const json = await response.json();
      const arr = [];
      json.forEach((element) => {
        arr.push(element);
      });
      setUsers(arr);
    } catch (error) {
      console.error(error);
    }
  };

  const getPermissions = async () => {
    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/get_all_permissions`,
        {
          method: "GET",
        }
      );
      const json = await response.json();
      const arr = [];
      json.forEach((element) => {
        arr.push(element);
      });
      console.log(arr);
      setPermissions(arr);
    } catch (error) {
      console.error(error);
    }
  };

  const getSelectedPermissions = async (id) => {
    const response = await fetch(
      `http://${localStorage.getItem(
        "server-ip"
      )}/inspaction/get_selected_permissions`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Id: id,
        }),
      }
    );
    const json = await response.json();
    setSelectedPermissions(json);
  };

  const handleEId = (val) => {
    setEId(val);
    getSelectedPermissions(val);
  };

  const savePermissions = async () => {
    console.log(selectedPermissions);
    const response = await fetch(
      `http://${localStorage.getItem("server-ip")}/inspaction/save_permissions`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eId,
          selectedPermissions,
        }),
      }
    );
    const json = await response.text();
    if (json == "successful") alert("Successfully Updated");
    else alert("Failed!!!");
  };

  const handleChange = (id) => {
    if (selectedPermissions.includes(id)) {
      setSelectedPermissions(selectedPermissions.filter((x) => x !== id));
    } else {
      setSelectedPermissions([...selectedPermissions, id]);
    }
  };

  return (
    <div className="card-container">
      <HeaderBar title="User Permission" module="" />
      <div style={{ width: "50%" }}>
        <div style={{ width: "40%" }}>
          <SearchableDropdown
            options={users}
            label="eId"
            id="Id"
            selectedVal={eId}
            handleChange={(val) => {
              handleEId(val);
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            marginTop: "2%",
            backgroundColor: "#eeeeee",
            borderRadius: "2%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <FormGroup>
              Finish Fabric Module
              {permissions.map((element) =>
                element.module === "finish_fabric" ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={element.permission_name}
                        checked={selectedPermissions.includes(element.id)}
                        onChange={() => handleChange(element.id)}
                      />
                    }
                    label={element.permission_name}
                  />
                ) : null
              )}
            </FormGroup>
            <FormGroup>
              Greige Fabric Module
              {permissions.map((element) =>
                element.module === "greige_fabric" ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={element.permission_name}
                        checked={selectedPermissions.includes(element.id)}
                        onChange={() => handleChange(element.id)}
                      />
                    }
                    label={element.permission_name}
                  />
                ) : null
              )}
            </FormGroup>
          </div>

          <Button
            variant="contained"
            startIcon={<SaveTwoToneIcon />}
            onClick={() => {
              savePermissions();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserPermission;
