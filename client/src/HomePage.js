import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LocalizedStrings from "react-localization";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Feedback from "./components_modals/Feedback";
import NewLogin from "./components_modals/NewLogin";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import home from "./assets/home.png";
import "./HomePage.css";
import { translations } from "./translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

/**
 * Main Homepage Component for covaid
 */

export default function HomePage(props) {
  const [showModal, setShowModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [modalType, setModalType] = useState("");
  const [pageLoaded, setPageLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (props.login === true) {
      showModalType("signin");
    }

    setPageLoaded(true);
    document.title = "Covaid";
  }, [props.login]);

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
    if (modalType === "feedback") {
      modal = (
        <Feedback showModal={showModal} hideModal={() => setShowModal(false)} />
      );
    } else if (modalType === "signin") {
      modal = <NewLogin showModal={showModal} hideModal={handleHideModal} />;
    }
    return modal;
  };

  return (
    <div style={{ overflowX: "hidden", height: "100%" }}>
      <div className="App" style={{ height: "100%" }}>
        <NavBar
          setLanguage={props.setLanguage}
          language={props.language}
          pageLoaded={pageLoaded}
          isLoggedIn={props.isLoggedIn}
          {...props}
          first_name={
            Object.keys(props.currentUser).length !== 0
              ? props.currentUser.first_name
              : ""
          }
          setToggle={setToggle}
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
                <h1 id="home-heading" style={{ marginTop: 25 }}>
                  {translatedStrings[props.language].HomePage_Title}
                </h1>
                <p id="home-subheading">
                  {translatedStrings[props.language].HomePage_Subtitle}
                </p>
                <Button
                  onClick={() => history.push("/request")}
                  id="request-button"
                >
                  <font style={{ float: "left" }}>
                    {translatedStrings[props.language].INeedHelp}
                  </font>
                  <font style={{ float: "right" }}>→</font>
                </Button>{" "}
                <br />
                <Button
                  id="resources-button"
                  onClick={() => history.push("/information-hub")}
                >
                  COVID-19 Information Hub
                </Button>
              </Col>
              <Col md={6} style={{ marginTop: 0, textAlign: "center" }}>
                <img id="org-img" alt="" src={home}></img>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
        {getCurrentModal()}
      </div>
      <Footer
        id="desktop-footer"
        style={toggle ? { marginTop: 500 } : {}}
      />
    </div>
  );
}

HomePage.propTypes = {
  setLanguage: PropTypes.func,
  language: PropTypes.string,
  googleAPI: PropTypes.string,
  refreshLocation: PropTypes.func,
  onLocationSubmit: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  currentUser: PropTypes.object,
};
