import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

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
  const history = useHistory();
  const [mode, setMode] = useState("");
  const [toggled, setToggled] = useState(false);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const [modalName, setModalName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [display_banner, setDisplayBanner] = useState(true);
  const [tab, setTab] = useState(0);
  const [dropToggle, setDropToggle] = useState(false);

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
    if (window.innerWidth > 767) {
      setToggled(false);
    }
  });

  useEffect(() => {
    if (props.mode === "volunteer") {
      setMode("volunteer");
      if (window.location.href.includes("#offer")) {
        setTab(1);
      } else if (window.location.href.includes("#requests")) {
        setTab(0);
      }
      return;
    }
    if (totalVolunteers === 0) {
      fetch("/api/users/totalUsers")
        .then((res) => res.json())
        .then((res) => {
          setTotalVolunteers(res.count);
        });
    }
  }, [props.pageLoaded, props.mode]);

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
    return width > 767 ? (
      <Dropdown
        key={"down"}
        id={`dropdown-button-drop-down`}
        drop={"down"}
        variant="secondary"
        style={{ display: "inline" }}
        className="mobileDrop"
        title={` Drop ${"down"} `}
      >
        <Dropdown.Toggle size="sm" variant="secondary" id="languageButton">
          <i
            className="fa fa-globe"
            aria-hidden="true"
            style={{ marginRight: 7, paddingTop: 5 }}
          ></i>
          {props.language === "en" ? "English" : "Español"}
        </Dropdown.Toggle>
        <Dropdown.Menu alignRight={true}>
          <Dropdown.Item onSelect={() => props.setLanguage("en")}>
            {"English"}
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => props.setLanguage("es")}>
            {"Español"}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    ) : (
      <></>
    );
    // <>
    // <Button
    //   variant="outline-light"
    //   id="login-button"
    //   onClick={() => {
    //     if (props.language === "es") {
    //       props.setLanguage("en");
    //     } else {
    //       props.setLanguage("es");
    //     }
    //   }}
    // >
    //   <i
    //     className="fa fa-globe"
    //     aria-hidden="true"
    //     style={{ marginRight: 7 }}
    //   ></i>
    //   {props.language === "en" ? "Español" : "English"}
    // </Button>
    // <select name="cars" id="cars">
    //   <option value="volvo">Volvo</option>
    //   <option value="saab">Saab</option>
    //   <option value="opel">Opel</option>
    //   <option value="audi">Audi</option>
    // </select>
    // </>
  };
  const Markk = () => {
    return (
      <Navbar
        expand="md"
        id="banner"
        style={{ height: width > 767 ? "auto" : 40 }}
      >
        <span style={{ cursor: "pointer", fontWeight: 600 }}>
          {width > 932
            ? "Exclusive for Volunteers: Join the free Markk app and get gift cards from Postmates, Amazon, Target and more."
            : "Join the Markk app and get free gift cards"}
        </span>
        <span
          id="view-banner"
          style={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => window.open("http://www.getmarkk.com/volunteer")}
        >
          Read More →
        </span>
        <span id="close-banner" onClick={() => setDisplayBanner(false)}>
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
    );
  };
  const BLM = () => {
    return (
      <Navbar
        expand="md"
        id="blmbanner"
        onClick={() => window.open("https://blacklivesmatters.carrd.co/")}
      >
        <span style={{ cursor: "pointer", fontWeight: 600 }}>
          {width > 767
            ? "We stand with the Black Lives Matter Movement"
            : "We stand with the BLM Movement"}
        </span>
        <span id="view-banner" style={{ cursor: "pointer", fontWeight: 600 }}>
          Resources →
        </span>
      </Navbar>
    );
  };

  const rightNav = (mode) => {
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
            style={{
              display: "block",
              marginRight: "5%",
              marginBottom: 3,
              marginTop: 10,
            }}
          >
            {props.orgPortal || mode === "volunteer" ? (
              <></>
            ) : (
              translateButton()
            )}
            {/* {width > 767 && !props.orgPortal ? ( */}
            <Dropdown
              key="volunteer-dropdown"
              style={{
                display: "inline",
                marginLeft: 8,
                paddingTop: -4,
              }}
              // className="mobileDrop"
              // title={` Drop ${"down"} `}
            >
              <Dropdown.Toggle
                size="md"
                id="languageButton"
                style={{ paddingTop: 0, paddingBottom: 4 }}
              >
                <span id="hello-name" style={{ marginRight: 0 }}>
                  {" "}
                  {translatedStrings[props.language].Hello} {props.first_name}
                  <svg
                    className="dropdown-svg"
                    width="17"
                    height="9"
                    viewBox="0 0 17 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L8.35849 7.5L16 1"
                      stroke="#2670FF"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight={true} style={{ marginTop: 10 }}>
                <Dropdown.Item
                  active={false}
                  style={{ transition: "0.1s" }}
                  onClick={() => {
                    if (props.setView) {
                      setTab(0);
                      props.setView("request-dashboard");
                      window.location.href = "#requests";
                    } else {
                      window.open(
                        currURL + "/volunteerPortal#requests",
                        "_self"
                      );
                    }
                  }}
                >
                  {"Requests"}
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ transition: "0.1s" }}
                  active={false}
                  onClick={() => {
                    if (props.setView) {
                      setTab(1);
                      props.setView("your-offer");
                      window.location.href = "#offer";
                    } else {
                      window.open(currURL + "/volunteerPortal#offer", "_self");
                      setTab(1);
                    }
                  }}
                >
                  {"Your Offer"}
                </Dropdown.Item>
                <Dropdown.Item
                  style={{ transition: "0.1s" }}
                  className="logout-dropdown-item"
                  active={false}
                  onClick={logout}
                >
                  {"Log out"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* ) : (
              <>
                <Button
                  variant="outline-danger"
                  id="logoutButton"
                  onClick={logout}
                >
                  {translatedStrings[props.language].Logout}
                </Button>
              </>
            )} */}
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

  const selectedTab = (currTab) => {
    if (tab === currTab) {
      return "nav-tab-name-active";
    } else {
      return "nav-tab-name-inactive";
    }
  };

  return (
    <>
      {props.isLoggedIn &&
        !props.orgPortal &&
        display_banner &&
        // ? Markk() :
        BLM()}
      {mode === "volunteer" ? (
        <Navbar
          collapseOnSelect
          onToggle={(e) => {
            if (props.setToggle) {
              props.setToggle(e);
            }
          }}
          variant="light"
          expand="md"
          id="custom-navbar"
        >
          <Navbar.Brand
            onClick={() => history.push("/")}
            id="navbar-brand"
            style={width < 767 ? { marginTop: 12 } : {}}
          >
            covaid
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <p
                id={selectedTab(0)}
                onClick={() => {
                  setTab(0);
                  props.setView("request-dashboard");
                  window.location.href = "#requests";
                }}
              >
                Request Dashboard
              </p>
              <p
                id={selectedTab(1)}
                onClick={() => {
                  setTab(1);
                  props.setView("your-offer");
                  window.location.href = "#offer";
                }}
              >
                Your Offer
              </p>
            </Nav>
            {rightNav(mode)}
          </Navbar.Collapse>
        </Navbar>
      ) : (
        <Navbar
          collapseOnSelect
          onToggle={(e) => {
            setToggled(e);
            if (props.setToggle) {
              props.setToggle(e);
            }
          }}
          variant="light"
          expand="md"
          id="custom-navbar"
        >
          <Navbar.Brand
            onClick={() => history.push("/")}
            id="navbar-brand"
            style={width < 767 ? { marginTop: 12 } : {}}
          >
            covaid
          </Navbar.Brand>
          <Form inline className="volunteer-badge-mobile">
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
                  onClick={() => history.push("/about")}
                >
                  <p id={toggled ? "navLinkToggled" : "navLink"}>
                    {translatedStrings[props.language].AboutUs}
                  </p>
                </Nav.Link>
                <Nav.Link
                  className={toggled ? "navBorderToggled" : "navbar-element"}
                  onClick={() => history.push("/faq")}
                >
                  <p id={toggled ? "navLinkToggled" : "navLink"}>FAQ</p>
                </Nav.Link>
              </Nav>
            ) : (
              <Nav className="mr-auto">
                <Nav.Link
                  className={toggled ? "navBorderToggled" : "navbar-element"}
                  onClick={() => history.push("/about")}
                >
                  <p id={toggled ? "navLinkToggled" : "navLink"}>
                    {translatedStrings[props.language].AboutUs}
                  </p>
                </Nav.Link>
                <Nav.Link
                  className={toggled ? "navBorderToggled" : "navbar-element"}
                  onClick={() => history.push("/organizationPortal")}
                >
                  <p id={toggled ? "navLinkToggled" : "navLink"}>
                    {translatedStrings[props.language].Organizations}
                  </p>
                </Nav.Link>
                <Nav.Link
                  className={toggled ? "navBorderToggled" : "navbar-element"}
                  onClick={() => history.push("/faq")}
                >
                  <p id={toggled ? "navLinkToggled" : "navLink"}>FAQ</p>
                </Nav.Link>
                <Nav.Link
                  className={toggled ? "navBorderToggled" : "navbar-element"}
                  onClick={() => history.push("/donate")}
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
      )}

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
