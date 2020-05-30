import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import PropTypes from "prop-types";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import NewLogin from "../components_modals/NewLogin";
import MapModal from "../components_modals/MapModal";
import Donate from "../components_modals/Donate";
import { currURL } from "../constants";
/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

/**
 * Navbar used in every frontend component
 */

export default function CovaidNavbar(props) {
  const [toggled, setToggled] = useState(false);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const [modalName, setModalName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("en");

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
    if (window.innerWidth > 767) {
      setToggled(false);
    }
  });

  useEffect(() => {
    if (props.pageLoaded) {
      fetch("/api/users/totalUsers")
        .then((res) => res.json())
        .then((res) => {
          setTotalVolunteers(res.count);
        });
    }
    if (props.switchToLanguage === "Español") {
      setLanguage("es");
    } else {
      setLanguage("en");
    }
  }, [props.pageLoaded, props.switchToLanguage]);

  const logout = () => {
    if (props.orgPortal) {
      Cookie.remove("org_token");
      if (Cookie.get("admin_token")) {
        Cookie.remove("admin_token");
        props.setAdmin({});
      }
      window.open(currURL + "/organizationPortal", "_self");
    } else {
      Cookie.remove("token");
      window.open(currURL, "_self");
    }
  };

  var rightNav;
  if (props.isLoggedIn) {
    if (toggled) {
      rightNav = (
        <Form inline id="getStarted" style={{ display: "block" }}>
          <Button
            variant="outline-light"
            id="login-button"
            onClick={() => {
              if (props.switchToLanguage === "Español") {
                props.setSwithToLanguage("English");
              } else {
                props.setSwithToLanguage("Español");
              }
            }}
          >
            <span role="img" aria-label="sheep">
              🌐{" "}
            </span>{" "}
            {props.switchToLanguage}
          </Button>
          <Button
            variant="outline-danger"
            id="logoutButton"
            onClick={logout}
            style={{ width: "100%" }}
          >
            {translatedStrings[language].Logout}
          </Button>
        </Form>
      );
    } else {
      rightNav = (
        <Form
          inline
          id="getStarted"
          style={{ display: "block", marginRight: "5%", marginBottom: 3 }}
        >
          <Button
            variant="outline-light"
            id="login-button"
            onClick={() => {
              if (props.switchToLanguage === "Español") {
                props.setSwithToLanguage("English");
              } else {
                props.setSwithToLanguage("Español");
              }
            }}
          >
            <span role="img" aria-label="sheep">
              🌐{" "}
            </span>{" "}
            {props.switchToLanguage}
          </Button>
          {width > 767 ? (
            <span id="hello-name">
              {" "}
              {translatedStrings[language].Hello} {props.first_name}
            </span>
          ) : (
            <></>
          )}
          <Button variant="outline-danger" id="logoutButton" onClick={logout}>
            {translatedStrings[language].Logout}
          </Button>
        </Form>
      );
    }
  } else {
    if (props.orgAdmin || props.orgPortal) {
      rightNav = (
        <Form inline id="getStarted" style={{ display: "block" }}>
          <Button
            variant="outline-light"
            id="login-button"
            onClick={() => {
              if (props.switchToLanguage === "Español") {
                props.setSwithToLanguage("English");
              } else {
                props.setSwithToLanguage("Español");
              }
            }}
          >
            <span role="img" aria-label="sheep">
              🌐{" "}
            </span>{" "}
            {props.switchToLanguage}
          </Button>
        </Form>
      );
    } else {
      if (width > 767) {
        rightNav = (
          <Form
            inline
            style={{ display: "block", marginRight: "5%", marginBottom: 3 }}
          >
            {/* <Button
              variant="outline-light"
              id="login-button"
              onClick={() => {
                if (props.switchToLanguage === "Español") {
                  props.setSwithToLanguage("English");
                } else {
                  props.setSwithToLanguage("Español");
                }
              }}
            >
              <span role="img" aria-label="sheep">
                🌐{" "}
              </span>{" "}
              {props.switchToLanguage}
            </Button> */}

            <Button
              variant="outline-light"
              id="login-button"
              onClick={() => setCurrModal("signin")}
            >
              Log In
            </Button>
            <Button
              variant="outline-light"
              id="register-button"
              onClick={() => window.open(currURL + "/volunteer", "_self")}
            >
              Volunteer Signup
            </Button>
          </Form>
        );
      } else {
        rightNav = (
          <Form inline id="getStarted" style={{ display: "block" }}>
            <Button
              variant="outline-light"
              onClick={() => {
                if (props.switchToLanguage === "Español") {
                  props.setSwithToLanguage("English");
                } else {
                  props.setSwithToLanguage("Español");
                }
              }}
            >
              <span role="img" aria-label="sheep">
                🌐{" "}
              </span>{" "}
              {props.switchToLanguage}
            </Button>
            <Button
              id="large-button-empty"
              onClick={() => props.handleShowModal("signin")}
              style={{ marginTop: 0, marginBottom: 5 }}
            >
              {translatedStrings[language].VolunteerLogin}
            </Button>
            <Button
              id="large-button"
              onClick={() => window.open(currURL + "/volunteer", "_self")}
            >
              {translatedStrings[language].VolunteerRegistration}
            </Button>
          </Form>
        );
      }
    }
  }

  const getCurrentModal = () => {
    var res = <></>;
    if (modalName === "signin") {
      res = (
        <NewLogin showModal={showModal} hideModal={() => setShowModal(false)} />
      );
    } else if (modalName === "donate") {
      res = (
        <Donate showModal={showModal} hideModal={() => setShowModal(false)} />
      );
    } else if (modalName === "map") {
      res = (
        <MapModal
          showModal={showModal}
          hideModal={() => setShowModal(false)}
          totalVolunteers={totalVolunteers}
          mobile={width < 767}
        />
      );
    }
  };

  const setCurrModal = (name) => {
    setShowModal(true);
    setModalName(name);
  };

  const volunteerBadge = (view) => {
    if (totalVolunteers === 0) {
      return <></>;
    } else {
      const numVolunteers = props.orgPortal
        ? props.totalVolunteers
        : totalVolunteers;
      if (props.orgPortal && props.isLoggedIn) {
        if (view === "mobile") {
          return (
            <Badge id="volunteer-mobile">
              {numVolunteers} {translatedStrings[language].Volunteer}
            </Badge>
          );
        } else {
          return (
            <Badge id="volunteerBadge">
              {numVolunteers} {translatedStrings[language].Volunteer}
            </Badge>
          );
        }
      } else {
        if (view === "mobile") {
          return (
            <Badge id="volunteer-mobile" onClick={() => setCurrModal("map")}>
              {translatedStrings[language].VolunteerMap}
            </Badge>
          );
        } else {
          return (
            <Badge id="volunteerBadge" onClick={() => setCurrModal("map")}>
              {translatedStrings[language].VolunteerMap}
            </Badge>
          );
        }
      }
    }
  };

  return (
    <>
      {/* <Navbar
        expand="md"
        id="banner"
      >
        <span style={{cursor: 'pointer', fontWeight: 600}}>Check out our first blog post!</span>
        <span id="view-banner" style={{cursor: 'pointer', fontWeight: 600}}>
          View →
        </span>
        <span id="close-banner">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" shapeRendering="geometricPrecision" style={{color: 'currentcolor'}}><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
        </span>
      </Navbar> */}
      <Navbar
        collapseOnSelect
        onToggle={(e) => setToggled(e)}
        variant="light"
        expand="md"
        id="custom-navbar"
      >
        <Navbar.Brand
          href={currURL}
          id="navbar-brand"
          style={width < 767 ? { marginTop: 12 } : {}}
        >
          covaid
        </Navbar.Brand>
        <Form inline className="volunteer-badge-mobile">
          {volunteerBadge("mobile")}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            id={toggled ? "toggledNav1" : "nav1"}
          />
        </Form>
        <Navbar.Collapse id="basic-navbar-nav">
          {props.simplified ? (
            <Nav className="mr-auto">
              <Nav.Link
                className={toggled ? "navBorderToggled" : "navbar-element"}
                href={currURL + "/about"}
              >
                <p id={toggled ? "navLinkToggled" : "navLink"}>About us</p>
              </Nav.Link>
              <Nav.Link
                className={toggled ? "navBorderToggled" : "navbar-element"}
                href={currURL + "/faq"}
              >
                <p id={toggled ? "navLinkToggled" : "navLink"}>FAQ</p>
              </Nav.Link>
            </Nav>
          ) : (
            <Nav className="mr-auto">
              <Nav.Link
                className={toggled ? "navBorderToggled" : "navbar-element"}
                href={currURL + "/about"}
              >
                <p id={toggled ? "navLinkToggled" : "navLink"}>About us</p>
              </Nav.Link>
              <Nav.Link
                className={toggled ? "navBorderToggled" : "navbar-element"}
                href={currURL + "/organizationPortal"}
              >
                <p id={toggled ? "navLinkToggled" : "navLink"}>Organizations</p>
              </Nav.Link>
              <Nav.Link
                className={toggled ? "navBorderToggled" : "navbar-element"}
                href={currURL + "/faq"}
              >
                <p id={toggled ? "navLinkToggled" : "navLink"}>FAQ</p>
              </Nav.Link>
              <Nav.Link
                className={toggled ? "navBorderToggled" : "navbar-element"}
                href={currURL + "/donate"}
              >
                <p id={toggled ? "navLinkToggled" : "navLink"}>Donate</p>
              </Nav.Link>
              <Nav.Link
                className={toggled ? "navBorderToggled" : "navbar-element"}
                onClick={() => setCurrModal("map")}
              >
                <p id={toggled ? "navLinkToggled" : "navLink"}>Volunteer Map</p>
              </Nav.Link>
            </Nav>
          )}
          {rightNav}
        </Navbar.Collapse>
      </Navbar>
      {getCurrentModal()}
    </>
  );
}

CovaidNavbar.propTypes = {
  switchToLanguage: PropTypes.string,
  orgPortal: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  pageLoaded: PropTypes.bool,
  orgAdmin: PropTypes.bool,
  first_name: PropTypes.string,
  totalVolunteers: PropTypes.number,
  setAdmin: PropTypes.func,
};
