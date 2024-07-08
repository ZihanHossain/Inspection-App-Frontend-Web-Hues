import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, Button, TextField } from "@mui/material";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="containerStyles">
      You do not have access to this page.
      <Button onClick={() => navigate(-3)}>Go Back</Button>
    </div>
  );
};

export default AccessDenied;
