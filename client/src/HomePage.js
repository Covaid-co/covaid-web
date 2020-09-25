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
import home from "./assets/covidsms_homepg.png";
import CovidSMS_Logo from "./assets/covidsms_logo.png";
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
    <div className="App">
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
      <Container id="jumboContainer">
        <Row id="landing">
          <Col md={5} id="jumbo-text">
            <h1 id="home-heading">
              {translatedStrings[props.language].HomePage_Title}
            </h1>
            <p id="home-subheading">
              {translatedStrings[props.language].HomePage_Subtitle}
            </p>
            <Button
              onClick={() => history.push("/request")}
              id="request-button"
            >
              {translatedStrings[props.language].INeedHelp} <span>→</span>
            </Button>
            <Button
              onClick={() => history.push("/volunteer")}
              style={{ display: props.isLoggedIn ? "none" : "block" }}
              id="volunteer-button"
            >
              Become a Volunteer
            </Button>
            <Button
              id="resources-button"
              onClick={() => history.push("/information-hub")}
            >
              COVID-19 Information Hub
            </Button>
          </Col>
          <Col md={7} /*style={{ textAlign: "center" }}*/>
            <div>
              <img id = "org-img" alt = "" src={home} align="left" style={{padding:25}}></img>
            </div>
            <div>
              <p id = "home-heading" style={{ marginTop: 75, marginRight: 0, fontSize: 35}} align="left">
                 Now Supporting
              </p>
              <div>
                <img id = "org-img" alt="" src={CovidSMS_Logo} style={{marginLeft:-25, marginTop:-15, padding:0, width: 250}}></img>
              </div>
              <p id = "covidsms-info" style={{marginTop:50}} align ="left"> 
                Text <b>START</b> to <b>888.414.5539</b> for testing sites, 
                food resources, employment services, and local COVID-19 statistics!</p>
            </div>
          </Col>
          <span id="scroll-down-icon">↓</span>
        </Row>
        <Row id="row-steps">
          <p id="home-heading-1" style={{ width: "100%", textAlign: "center" }}>
            Welcome to Covaid
          </p>
          <p id="regular-text-home">
            Covaid is a mutual aid tool that provides an intuitive request form
            to allow community members to easily create requests for support.
            These requests are then processed and matched to nearby volunteers
            who have signed up to support their community. With this tool, we
            hope to foster solidarity and remind one another to care for our
            neighbors during these unprecendented times.
          </p>
        </Row>
        <Row id="row-steps">
          <Col md={6} style={{ marginTop: 20, textAlign: "center" }}>
            <p id="home-heading-1">How to request support</p>
            <div id="instruction-container">
              <div id="steps-number-container">
                <div id="step-number">1</div>
                <div id="step-number">2</div>
                <div id="step-number">3</div>
              </div>
              <div id="steps-container">
                <div id="step-text">
                  <p id="title-steps" style={{ paddingTop: 10 }}>
                    Create a request
                  </p>
                  <p id="regular-text">
                    Click the 'I need support' button and fill out our request
                    form in a matter of minutes
                  </p>
                </div>
                <div id="step-text">
                  <p id="title-steps">Match with a volunteer</p>
                  <p id="regular-text">
                    Our matching team will find a volunteer that best matches
                    your needs
                  </p>
                </div>
                <div id="step-text">
                  <p id="title-steps">Connect with your volunteer</p>
                  <p id="regular-text">
                    A volunteer will reach out to you to learn more about how
                    they can support you
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6} style={{ marginTop: 20, textAlign: "center" }}>
            <p id="home-heading-1">How to volunteer</p>
            <div id="instruction-container">
              <div id="steps-number-container">
                <div id="step-number">1</div>
                <div id="step-number">2</div>
                <div id="step-number">3</div>
              </div>
              <div id="steps-container">
                <div id="step-text">
                  <p id="title-steps" style={{ paddingTop: 10 }}>
                    Register to volunteer
                  </p>
                  <p id="regular-text">
                    Click the 'Become a volunteer' button above and create your
                    volunteer account
                  </p>
                </div>
                <div id="step-text">
                  <p id="title-steps">Customize your profile</p>
                  <p id="regular-text">
                    Update your virtual offer at any time through your volunteer
                    portal
                  </p>
                </div>
                <div id="step-text">
                  <p id="title-steps">Respond to requests</p>
                  <p id="regular-text">
                    Connect with requesters and manage request status in your
                    request dashboard
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {getCurrentModal()}
      <Footer style={{ marginTop: 50 }} />
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
