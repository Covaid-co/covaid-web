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

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
    if (window.innerWidth > 767) {
      setToggled(false);
    }
  });

  useEffect(() => {
    if (totalVolunteers === 0) {
      fetch("/api/users/totalUsers")
        .then((res) => res.json())
        .then((res) => {
          setTotalVolunteers(res.count);
        });
    }
  }, [props.pageLoaded]);

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

  const translateButton = () => {
    return (
      <Button
        variant="outline-light"
        id="login-button"
        onClick={() => {
          if (props.language === "es") {
            props.setLanguage("en");
          } else {
            props.setLanguage("es");
          }
        }}
      >
        <i
          className="fa fa-globe"
          aria-hidden="true"
          style={{ marginRight: 7 }}
        ></i>
        {props.language === "en" ? "English" : "Español"}
      </Button>
    );
  };

  const rightNav = () => {
    if (!props.isLoggedIn) {
      if (props.simplified) {
        if (width > 767) {
          return <div style={{ marginRight: "8%" }}>{translateButton()}</div>;
        } else {
          return translateButton();
        }
      } else if (props.orgAdmin || props.orgPortal) {
        return <></>;
      } else {
        if (width > 767) {
          return (
            <Form
              inline
              style={{
                display: "block",
                marginRight: "8%",
                marginBottom: 3,
                marginTop: 10,
              }}
            >
              {/* <Button
                variant="outline-light"
                id="login-button"
                onClick={() => window.open('https://medium.com/@covaidco', '_self')}
              >
                Blog
              </Button> */}
              {translateButton()}
              <Button
                variant="outline-light"
                id="login-button"
                onClick={() => setCurrModal("signin")}
              >
                {translatedStrings[props.language].Signin}
              </Button>
              <Button
                variant="outline-light"
                id="register-button"
                onClick={() => window.open(currURL + "/volunteer", "_self")}
              >
                {translatedStrings[props.language].VolunteerRegistration}
              </Button>
            </Form>
          );
        } else {
          return (
            <Form inline id="getStarted" style={{ display: "block" }}>
              {translateButton()}
              <Button
                id="large-button-empty"
                onClick={() => setCurrModal("signin")}
                style={{ marginTop: 0, marginBottom: 5 }}
              >
                Volunteer Login
              </Button>
              <Button
                id="large-button"
                onClick={() => window.open(currURL + "/volunteer", "_self")}
              >
                Volunteer Signup
              </Button>
            </Form>
          );
        }
      }
    } else {
      if (toggled) {
        return (
          <Form inline id="getStarted" style={{ display: "block" }}>
            {translateButton()}
            <Button
              variant="outline-danger"
              id="logoutButton"
              onClick={logout}
              style={{ width: "100%" }}
            >
              {translatedStrings[props.language].Logout}
            </Button>
          </Form>
        );
      } else {
        return (
          <Form
            inline
            id="getStarted"
            style={{ display: "block", marginRight: "5%", marginBottom: 3 }}
          >
            {props.orgPortal ? <></> : translateButton()}
            {width > 767 ? (
              <span id="hello-name">
                {" "}
                {translatedStrings[props.language].Hello} {props.first_name}
              </span>
            ) : (
              <></>
            )}
            <Button variant="outline-danger" id="logoutButton" onClick={logout}>
              {translatedStrings[props.language].Logout}
            </Button>
          </Form>
        );
      }
    }
  };

  const getCurrentModal = () => {
    var res = <></>;
    if (modalName === "signin") {
      res = (
        <NewLogin showModal={showModal} hideModal={() => setShowModal(false)} />
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
    return res;
  };

  const setCurrModal = (name) => {
    setShowModal(true);
    setModalName(name);
  };

  const volunteerBadge = (view) => {
    if (view === "mobile") {
      return (
        <Badge id="volunteer-mobile" onClick={() => setCurrModal("map")}>
          {translatedStrings[props.language].VolunteerMap}
        </Badge>
      );
    } else {
      return (
        <Badge id="volunteerBadge" onClick={() => setCurrModal("map")}>
          {translatedStrings[props.language].VolunteerMap}
        </Badge>
      );
    }
  };

  return (
    <>
      {props.isLoggedIn && !props.orgPortal ? (
        <Navbar expand="md" id="banner">
          <span style={{ cursor: "pointer", fontWeight: 600 }}>
            Exclusive for Volunteers: Join the free Markk app and get gift cards
            from Postmates, Amazon, Target and more.
          </span>
          <span
            id="view-banner"
            style={{ cursor: "pointer", fontWeight: 600 }}
            onClick={() => window.open("http://www.getmarkk.com/volunteer")}
          >
            Read More →
          </span>
          <span id="close-banner">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              shapeRendering="geometricPrecision"
              style={{ color: "currentcolor" }}
            >
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </span>
        </Navbar>
      ) : (
        <></>
      )}
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
                <p id={toggled ? "navLinkToggled" : "navLink"}>
                  {translatedStrings[props.language].AboutUs}
                </p>
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
                <p id={toggled ? "navLinkToggled" : "navLink"}>
                  {translatedStrings[props.language].AboutUs}
                </p>
              </Nav.Link>
              <Nav.Link
                className={toggled ? "navBorderToggled" : "navbar-element"}
                href={currURL + "/organizationPortal"}
              >
                <p id={toggled ? "navLinkToggled" : "navLink"}>
                  {translatedStrings[props.language].Organizations}
                </p>
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
                <p id={toggled ? "navLinkToggled" : "navLink"}>
                  {translatedStrings[props.language].Donate}
                </p>
              </Nav.Link>
              <Nav.Link
                className={toggled ? "navBorderToggled" : "navbar-element"}
                onClick={() => setCurrModal("map")}
              >
                <p id={toggled ? "navLinkToggled" : "navLink"}>
                  {translatedStrings[props.language].VolunteerMap}
                </p>
              </Nav.Link>
            </Nav>
          )}
          {rightNav()}
        </Navbar.Collapse>
      </Navbar>
      {getCurrentModal()}
    </>
  );
}

CovaidNavbar.propTypes = {
  setLanguage: PropTypes.func,
  language: PropTypes.string,
  orgPortal: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  pageLoaded: PropTypes.bool,
  orgAdmin: PropTypes.bool,
  simplified: PropTypes.bool,
  first_name: PropTypes.string,
  setAdmin: PropTypes.func,
};
