import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import Geocode from "react-geocode";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./Home.css";
import "./changelog/ChangeLog.css";
import "./styling/NewHomePage.css";

import { defaultResources } from "./constants";
import { generateURL, clearCookies } from "./Helpers";
import {
  findAssociations,
  getMyLocation,
  setNeighborhood,
  setLatLongCookie,
} from "./location_tools/LocationHelpers";

import Verify from "./components_homepage/Verify";
import NewRequestPage from "./request_help/NewRequestPage";
import ResetPassword from "./ResetPassword";
import ResetAssociationPassword from "./ResetAssociationPassword";
import OrganizationPortal from "./OrganizationPortal";
import VolunteerPortal from "./VolunteerPortal";
import OrgAdminRegister from "./components_orgpage/OrgAdminRegister";
import OrgReset from "./components_orgpage/OrgReset";
import AboutUs from "./components_homepage/AboutUs";
import FAQ from "./components_homepage/FAQ";
import Donate from "./components_homepage/Donate";
import RegisterPage from "./volunteer_registration/RegisterPage";
import ChangeLog from "./changelog/ChangeLog";
import SubmitChangeLog from "./changelog/SubmitChangeLog";
import InformationHub from "./information-hub/InformationHub";
import HomePage from "./HomePage";

function App() {
  return (
    <ToastProvider>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <link href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap" rel="stylesheet"></link>
        <Router>
            <Switch>
                <Route exact path="/organizationPortal" component={OrganizationPortal}/>
                <Route path="/" component={OrganizationPortal}/>
                <Route path="*" component={OrganizationPortal}/>
            </Switch>
        </Router>
        </ToastProvider>
  );
}

export default App;
