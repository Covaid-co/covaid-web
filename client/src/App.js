import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import Geocode from "react-geocode";
import fetch_a from "./util/fetch_auth";
import Cookie from "js-cookie";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currentAssoc, setCurrentAssoc] = useState(null);
  const [locality, setLocality] = useState("");
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [resources, setResources] = useState(defaultResources);
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [language, setLanguage] = useState("en");
  const languageObj = { setLanguage: setLanguage, language: language };
  const stateRef = useRef("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    fetch("/api/apikey/google").then((response) => {
      if (response.ok) {
        response.json().then((key) => {
          setGoogleApiKey(key["google"]);
          Geocode.setApiKey(key["google"]);
        });
      }
    });
    if (Object.keys(currentUser).length === 0 && Cookie.get("token")) {
      fetchUser();
    }
  }, []);

  // Get current user based on token
  const fetchUser = () => {
    fetch_a("token", "/api/users/current")
      .then((response) => response.json())
      .then((user) => {
        setCurrentUser(user);
        setLoggedIn(true);
      });
  };

  const setLocationVariables = (neighborObj) => {
    setLocality(neighborObj["locality"]);
    setNeighborhoods(neighborObj["neighborhoods"]);
    setState(neighborObj["state"]);
    setZipcode(neighborObj["zipCode"]);
  };

  // Find locality/neighborhood by lat long
  const findLocality = (lat, long, stateObj, googleApiKey) => {
    if (!("neighborhoods" in stateObj)) {
      setNeighborhood(lat, long, googleApiKey).then((neighborObj) => {
        setLocationVariables(neighborObj);
      });
    } else {
      setLocationVariables(stateObj);
    }
  };

  // Find association by lat long
  const findAssociation = (lat, long) => {
    findAssociations(lat, long).then((associations) => {
      if (associations.length > 0) {
        setResources(associations[0].resources);
        setCurrentAssoc(associations[0]);
      } else {
        setCurrentAssoc({});
      }
    });
  };

  // Find association by id
  const setAssocByOrg = (id) => {
    let params = { associationID: id };
    var url = generateURL("/api/association/get_assoc/?", params);
    fetch(url).then((response) => {
      if (response.ok) {
        console.log(response);
        response
          .json()
          .then((association) => {
            console.log("hi");
            setResources(association.resources);
            setCurrentAssoc(association);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };

  // Find location attributes when page loads
  const setLocationState = (key) => {
    getMyLocation().then((stateObj) => {
      setIsLoaded(true);
      const lat = parseFloat(stateObj["latitude"]);
      const long = parseFloat(stateObj["longitude"]);
      setLatitude(lat);
      setLongitude(long);
      findLocality(lat, long, stateObj, key);
      if (stateRef.current === "") {
        findAssociation(lat, long);
      }
    });
  };

  // Find location attributes based on string
  const onLocationSubmit = (e, locationString) => {
    e.preventDefault();
    e.stopPropagation();
    return Geocode.fromAddress(locationString).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        clearCookies();
        setLatLongCookie(lat, lng);
        setIsLoaded(true);

        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lng));

        setNeighborhood(lat, lng, googleApiKey).then((neighborObj) => {
          setLocationVariables(neighborObj);

          // Only update org if it is not in a org specific page
          if (stateRef.current === "") {
            findAssociation(lat, lng);
          }
        });
        return true;
      },
      () => {
        return false;
      }
    );
  };

  // Refresh location (to current location)
  const refreshLocation = () => {
    clearCookies();
    setIsLoaded(false);
    setLocationState(googleApiKey);
  };

  const setOrg = (org) => {
    if (org === "pitt") {
      setAssocByOrg("5e843ab29ad8d24834c8edbf");
    } else if (org === "ccom") {
      setAssocByOrg("5eac6be7bd9e0369f78a0f28");
    } else if (org === "charlotte") {
      setAssocByOrg("5e909963a4141a039a6fc1e5");
    } else if (org === "austin") {
      setAssocByOrg("5edabb06b60b9b11e5c1be38");
    } else if (org === "berkshire") {
      setAssocByOrg("5edbf9e3211f520d08ee977f");
    } else if (org === "evanston") {
      setAssocByOrg("5ec59c04bcb4d4389861d588");
    } else if (org === "pwc") {
      setAssocByOrg("5ee3eb1077cfd83429f85fe2");
    } else if (org === 'hbvla') {
      setAssocByOrg("5eb70551e676422cdfd0e882");
    }
  };

  const registerPage = (props, org) => {
    if (stateRef.current === "" && org !== "") {
      stateRef.current = org;
      setOrg(org);
    }
    return (
      <RegisterPage
        {...props}
        {...languageObj}
        org={org}
        isLoaded={isLoaded}
        setLocationState={setLocationState}
        googleApiKey={googleApiKey}
        onLocationSubmit={onLocationSubmit}
        refreshLocation={refreshLocation}
        latitude={latitude}
        longitude={longitude}
        association={currentAssoc}
        neighborhoods={neighborhoods}
        locality={locality}
        state={state}
        zipcode={zipcode}
      />
    );
  };

  const requestPage = (props, org) => {
    if (stateRef.current === "" && org !== "") {
      stateRef.current = org;
      setOrg(org);
    }
    return (
      <NewRequestPage
        {...props}
        {...languageObj}
        org={org}
        onLocationSubmit={onLocationSubmit}
        setLocationState={setLocationState}
        googleApiKey={googleApiKey}
        latitude={latitude}
        longitude={longitude}
        association={currentAssoc}
        neighborhoods={neighborhoods}
        locality={locality}
        state={state}
        zipcode={zipcode}
        resources={resources}
      />
    );
  };

  const homePageComp = (props, login) => {
    return (
      <HomePage
        {...props}
        language={language}
        setLanguage={setLanguage}
        refreshLocation={refreshLocation}
        onLocationSubmit={onLocationSubmit}
        login={login}
        isLoggedIn={loggedIn}
        currentUser={currentUser}
      />
    );
  };

  return (
    <ToastProvider>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <link
        href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap"
        rel="stylesheet"
      ></link>
      <Router>
        <Switch>
          <Route
            exact
            path="/organizationPortal"
            component={(props) => (
              <OrganizationPortal {...props} {...languageObj} />
            )}
          />
          <Route
            exact
            path="/volunteerPortal"
            component={(props) => (
              <VolunteerPortal {...props} {...languageObj} />
            )}
          />
          <Route exact path="/verify" component={Verify} />
          <Route
            exact
            path="/pgh-request"
            render={(props) => requestPage(props, "pitt")}
          />
          <Route
            exact
            path="/ccom-request"
            render={(props) => requestPage(props, "ccom")}
          />
          <Route
            exact
            path="/charlotte-request"
            render={(props) => requestPage(props, "charlotte")}
          />
          <Route
            exact
            path="/austin-request"
            render={(props) => requestPage(props, "austin")}
          />
          <Route
            exact
            path="/berkshire-request"
            render={(props) => requestPage(props, "berkshire")}
          />
          <Route
            exact
            path="/evanston-request"
            render={(props) => requestPage(props, "evanston")}
          />
          <Route
            exact
            path="/pwc-request"
            render={(props) => requestPage(props, "pwc")}
          />
          <Route
            exact
            path="/hbvla-request"
            render={(props) => requestPage(props, "hbvla")}
          />
          <Route
            exact
            path="/request"
            render={(props) => requestPage(props, "")}
          />
          <Route
            exact
            path="/pgh-volunteer"
            render={(props) => registerPage(props, "pitt")}
          />
          <Route
            exact
            path="/ccom-volunteer"
            render={(props) => registerPage(props, "ccom")}
          />
          <Route
            exact
            path="/charlotte-volunteer"
            render={(props) => registerPage(props, "charlotte")}
          />
          <Route
            exact
            path="/austin-volunteer"
            render={(props) => registerPage(props, "austin")}
          />
          <Route
            exact
            path="/berkshire-volunteer"
            render={(props) => registerPage(props, "berkshire")}
          />
          <Route
            exact
            path="/evanston-volunteer"
            render={(props) => registerPage(props, "evanston")}
          />
          <Route
            exact
            path="/pwc-volunteer"
            render={(props) => registerPage(props, "pwc")}
          />
          <Route
            exact
            path="/hbvla-volunteer"
            render={(props) => registerPage(props, "hbvla")}
          />
          <Route
            exact
            path="/volunteer"
            render={(props) => registerPage(props, "")}
          />
          <Route exact path="/resetPassword" component={ResetPassword} />
          <Route
            exact
            path="/resetAssociationPassword"
            component={ResetAssociationPassword}
          />
          <Route exact path="/orgAdmin" component={OrgAdminRegister} />
          <Route
            exact
            path="/about"
            component={(props) => (
              <AboutUs
                {...props}
                {...languageObj}
                isLoggedIn={loggedIn}
                currentUser={currentUser}
              />
            )}
          />
          <Route
            exact
            path="/faq"
            component={(props) => (
              <FAQ
                {...props}
                {...languageObj}
                isLoggedIn={loggedIn}
                currentUser={currentUser}
              />
            )}
          />
          <Route
            exact
            path="/donate"
            component={(props) => (
              <Donate
                {...props}
                {...languageObj}
                isLoggedIn={loggedIn}
                currentUser={currentUser}
              />
            )}
          />
          <Route exact path="/orgPasswordReset" component={OrgReset} />
          <Route
            exact
            path="/updates"
            component={(props) => <ChangeLog {...props} {...languageObj} />}
          />
          <Route exact path="/submit-updates" component={SubmitChangeLog} />
          <Route exact path="/information-hub" component={InformationHub} />
          <Route
            exact
            path="/volunteer-signin"
            component={(props) => homePageComp(props, true)}
          />
          {/* <Route path="/:lang" component={homePageComp} /> */}
          <Route path="/" component={homePageComp} />
          <Route path="*" component={homePageComp} />
        </Switch>
      </Router>
    </ToastProvider>
  );
}

export default App;
