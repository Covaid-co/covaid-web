import React, { useState, useEffect } from "react";
import LocalizedStrings from "react-localization";
import fetch_a from "./util/fetch_auth";
import PropTypes from "prop-types";
import Cookie from "js-cookie";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Feedback from "./components_modals/Feedback";
import NewLogin from "./components_modals/NewLogin";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HelpfulLinks from "./components_modals/HelpfulLinks";
import { currURL } from "./constants";
import { volunteerButton } from "./HomePageHelpers";
import home from "./assets/home.png";
import "./HomePage.css";
import { translations } from "./translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

/**
 * Main Homepage Component for covaid
 */

export default function HomePage(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const [pageLoaded, setPageLoaded] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (props.login === true) {
      showModalType("signin");
    }

    if (Object.keys(currentUser).length === 0 && Cookie.get("token")) {
      fetchUser();
    }

    if (props.switchToLanguage === "English") {
      setLanguage("en");
    } else {
      setLanguage("es");
    }
    setPageLoaded(true);
  }, [
    props.latitude,
    props.longitude,
    props.currentAssoc,
    currentUser,
    props.login,
  ]);

  const showModalType = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  // Find current modal component based on current modal type
  const getCurrentModal = () => {
    var modal = <></>;
    if (modalType === "resources") {
      modal = (
        <HelpfulLinks
          showModal={showModal}
          hideModal={handleHideModal}
          currentAssoc={props.currentAssoc}
        />
      );
    } else if (modalType === "feedback") {
      modal = (
        <Feedback showModal={showModal} hideModal={() => setShowModal(false)} />
      );
    } else if (modalType === "signin") {
      modal = <NewLogin showModal={showModal} hideModal={handleHideModal} />;
    }
    return modal;
  };

  // Get current user based on token
  const fetchUser = () => {
    fetch_a("token", "/api/users/current")
      .then((response) => response.json())
      .then((user) => {
        setCurrentUser(user);
        setLoggedIn(true);
      });
  };

  return [
    <div key="1" className="App" style={{ height: "100%" }}>
      <NavBar
        setSwithToLanguage={props.setSwithToLanguage}
        switchToLanguage={props.switchToLanguage}
        pageLoaded={pageLoaded}
        isLoggedIn={loggedIn}
        first_name={currentUser.first_name}
        handleShowModal={showModalType}
      />
      <Jumbotron fluid id="jumbo">
        <div id="feedback">
          <div
            id="feedback-tab"
            onClick={() => {
              showModalType("feedback");
            }}
          >
            Feedback
          </div>
        </div>
        <Container id="jumboContainer">
          <Row>
            <Col md={6} id="jumbo-text">
              <h1 id="home-heading">
                {translatedStrings[language].HomePage_Title}
              </h1>
              <p id="home-subheading">
                {translatedStrings[language].HomePage_Subtitle}
              </p>
              <Button
                onClick={() => window.open(currURL + "/request", "_self")}
                id="request-button"
              >
                I need help →
              </Button>{" "}
              {volunteerButton(loggedIn, language)}
              <br />
              <Button
                id="resources-button"
                onClick={() => window.open(currURL + "/volunteer", "_self")}
              >
                Become a volunteer
              </Button>
            </Col>
            <Col md={6} style={{ marginTop: 0 }}>
              <img id="org-img" alt="" src={home}></img>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      {getCurrentModal()}
    </div>,
    <Footer key="2" home={true} />,
  ];
}

HomePage.propTypes = {
  //    translatedStrings : PropTypes.node,
  setSwithToLanguage: PropTypes.func,
  switchToLanguage: PropTypes.string,
  googleAPI: PropTypes.string,
  refreshLocation: PropTypes.func,
  onLocationSubmit: PropTypes.func,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  neighborhoods: PropTypes.arrayOf(PropTypes.string),
  locality: PropTypes.string,
  zipcode: PropTypes.string,
  currentAssoc: PropTypes.object,
  isLoaded: PropTypes.bool,
  resources: PropTypes.arrayOf(PropTypes.string),
};
