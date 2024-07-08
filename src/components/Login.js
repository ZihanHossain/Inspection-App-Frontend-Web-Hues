import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, TextField } from "@mui/material";
import "../Css/Login.css";

const LoginScreen = () => {
  const [eId, setEID] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://${localStorage.getItem(
          "server-ip"
        )}/inspaction/validate_login_web`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eId,
            password,
          }),
        }
      );
      const json = await response.json();
      console.log(json);
      if (json < 1) {
        setMsg("Wrong Username or password!");
      } else {
        const response = await fetch(
          `http://${localStorage.getItem(
            "server-ip"
          )}/inspaction/get_permissions`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Id: json[0].Id,
            }),
          }
        );
        const json1 = await response.json();
        localStorage.setItem("permissions", JSON.stringify(json1));
        localStorage.setItem("token", eId);
        localStorage.setItem("name", json[0].user_name);
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="containerStyles">
      <form onSubmit={handleSubmit} className="formStyles">
        <img src="/icon.png" className="login-logo" />
        <label className="title">QMS Login</label>
        <label className="labelStyles">
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="username"
            label="Username"
            name="username"
            value={eId}
            onChange={(event) => setEID(event.target.value)}
            className="inputStyles"
          />
        </label>
        <label className="labelStyles">
          <TextField
            variant="outlined"
            margin="normal"
            required
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="inputStyles"
          />
        </label>
        <button type="submit" className="buttonStyles">
          Login
        </button>
        <div className={msg.length < 1 ? "error-disable" : "error"}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            <strong>{msg}!</strong>
          </Alert>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
