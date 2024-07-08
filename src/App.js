import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import AddGSM from "./components/AddGSM";
import LoginScreen from "./components/Login";
import Configuration from "./components/Configuration";
import AddUser from "./components/AddUser";
import UserPermission from "./components/UserPermission";
import Reports from "./components/Reports";
import AddShade from "./components/AddShade";
import AddNoOfHighDefects from "./components/AddNoOfHighDefects";
import PassFailStatus from "./components/PassFailStatus";
import AddMachines from "./components/AddMachines";
import EditInspection from "./components/EditInspection";
import BatchStatus from "./components/BatchStatus";
import AccessDenied from "./components/AccessDenied";
import EditGsmAndShade from "./components/EditGsmAndShade";
// import Reprocess from "./components/Reprocess";
import ExcessSplit from "./components/ExcessSplit";
import ModuleSelect from "./components/ModuleSelect";
import AddDefects from "./components/AddDefects";
import HomeGreige from "./components/HomeGreige";
import BatchStatusGreige from "./components/BatchStatusGreige";
import EditGreigeInspection from "./components/EditGreigeInspection";
import EditGreigeGsmAndShade from "./components/EditGreigeGsmAndShade";
import AddGreigeGSM from "./components/AddGreigeGSM";
// import PassFailGreigeStatus from "./components/PassFailGreigeStatus";
import "./App.css";

const App = () => {
  localStorage.setItem("server-ip", "10.12.61.195:3005");
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<ModuleSelect />} />
        <Route path="/home_greige" element={<HomeGreige />} />
        <Route path="/final_inspection" element={<Home />} />
        <Route path="/add_gsm" element={<AddGSM />} />
        <Route path="/add_greige_gsm" element={<AddGreigeGSM />} />
        <Route path="/add_shade" element={<AddShade />} />
        <Route path="/add_high_defects" element={<AddNoOfHighDefects />} />
        <Route path="/pass_fail_status" element={<PassFailStatus />} />
        {/* <Route
          path="/pass_fail_greige_status"
          element={<PassFailGreigeStatus />}
        /> */}
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/add_user" element={<AddUser />} />
        <Route path="/add_machines" element={<AddMachines />} />
        <Route path="/add_defects" element={<AddDefects />} />
        <Route path="/batch_status" element={<BatchStatus />} />
        <Route path="/batch_status_greige" element={<BatchStatusGreige />} />
        <Route path="/user_permission" element={<UserPermission />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/edit_inspection" element={<EditInspection />} />
        <Route
          path="/edit_greige_inspection"
          element={<EditGreigeInspection />}
        />
        <Route path="/edit_gsmandshade" element={<EditGsmAndShade />} />
        <Route
          path="/edit_greige_gsmandshade"
          element={<EditGreigeGsmAndShade />}
        />
        <Route path="/excess_split" element={<ExcessSplit />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        {/* <Route path="/reprocess" element={<Reprocess />} /> */}
      </Routes>
    </div>
  );
};

export default App;
