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
    <div className="App">
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
              {translatedStrings[props.language].HomePage_Title}
            </h1>
            <p id="home-subheading">
              {translatedStrings[props.language].HomePage_Subtitle}
            </p>
            <Button
              onClick={() => history.push("/request")}
              id="request-button"
            >
                {translatedStrings[props.language].INeedHelp} → 
            </Button>
            <br />
            <Button
              onClick={() => history.push("/volunteer")}
              id="volunteer-button"
            >
              Become a volunteer
            </Button>
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
        <Row id="row-steps">
          <p id="home-heading-1" style={{width: '100%', textAlign: 'center'}}>What is Covaid?</p>
          <p id="regular-text-home">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod 
            scelerisque commodo. Nullam molestie auctor purus, non imperdiet ex aliquet non. 
            In hac habitasse platea dictumst. Class aptent taciti sociosqu ad litora 
            torquent per conubia nostra, per inceptos himenaeos. Donec tincidunt 
            vitae massa in dignissim.
          </p>
        </Row>
        <Row id="row-steps">
          <Col md={6} style={{ marginTop: 20, textAlign: "center" }}>
            <p id="home-heading-1">How to request help</p>
            <div id="instruction-container">
              <div id="steps-number-container">
                <div id="step-number">
                  1
                </div>
                <div id="step-number">
                  2
                </div>
                <div id="step-number">
                  3
                </div>
              </div>
              <div id="steps-container">
                <div id="step-text">
                  <p id="title-steps" style={{paddingTop: 10}}>Create a request</p>
                  <p id="regular-text">Your request details will be used to find volunteers who can help</p>
                </div>
                <div id="step-text">
                  <p id="title-steps">Match with a volunteer</p>
                  <p id="regular-text">Our matching team will find a volunteer that best matches your needs</p>
                </div>
                <div id="step-text">
                  <p id="title-steps">Connect with your volunteer</p>
                  <p id="regular-text">A volunteer will reach out to you to learn more about how they can support you</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6} style={{ marginTop: 20, textAlign: "center" }}>
            <p id="home-heading-1">How to volunteer</p>
            <div id="instruction-container">
              <div id="steps-number-container">
                <div id="step-number">
                  1
                </div>
                <div id="step-number">
                  2
                </div>
                <div id="step-number">
                  3
                </div>
              </div>
              <div id="steps-container">
                <div id="step-text">
                  <p id="title-steps" style={{paddingTop: 10}}>Register to volunteer</p>
                  <p id="regular-text">You may now receive requests of support near you</p>
                </div>
                <div id="step-text">
                  <p id="title-steps">Match with ones in need</p>
                  <p id="regular-text">Our matching team will pair you with people you can best help</p>
                </div>
                <div id="step-text">
                  <p id="title-steps">Connect with your requester</p>
                  <p id="regular-text">Learn about how you can offer resources to help someone</p>
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
