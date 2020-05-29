import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import HowItWorks from "../components_modals/HowItWorks";
import Feedback from "../components_modals/Feedback";
import { currURL } from "../constants";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");

  const getCurrentModal = () => {
    var modal = <></>;
    if (modalName === "faq") {
      modal = (
        <HowItWorks
          showModal={showModal}
          hideModal={() => setShowModal(false)}
        />
      );
    } else if (modalName === "feedback") {
      modal = (
        <Feedback showModal={showModal} hideModal={() => setShowModal(false)} />
      );
    }
    return modal;
  };

  return (
    <footer className="footer">
      <Container style={{maxWidth: 2500}}>
        <Row style={{ textAlign: "left", paddingBottom: 30 }}>
          <Col xs={2} style={{ padding: 20, paddingRight: 0 }} id="footer-brand">
            <Navbar style={{ paddingLeft: 0, paddingBottom: 0 }}>
              <Navbar.Brand
                id="navbar-brand"
                style={{ paddingLeft: 0, color: "#7B7B7B", marginLeft: 0, marginTop: 20 }}
              >
                covaid
              </Navbar.Brand>
            </Navbar>
          </Col>
          <Col xl={10} lg={10} md={12} style={{textAlign: 'left', marginTop: 62, paddingLeft: 0}}>
            <Button
              variant="link"
              id="footer-link"
              onClick={() => window.open(currURL + "/faq", "_self")}
            >
              FAQ
            </Button>
            <Button
              variant="link"
              id="footer-link"
              onClick={() => (window.location.href = currURL + "/updates")}
            >
              Updates
            </Button>
            <Button
              variant="link"
              id="footer-link"
              onClick={() => (window.location.href = currURL + "/donate")}
            >
              Donate
            </Button>
            <i
              id="social-icon"
              className="fa fa-2x fa-github"
              onClick={() => (window.location.href = "https://github.com/Covaid-co")}
              aria-hidden="true"
            ></i>
            <i
              id="social-icon"
              className="fa fa-2x fa-instagram"
              onClick={() => (window.location.href = "https://www.instagram.com/covaidmutualaid/")}
              aria-hidden="true"
            ></i>
            <i
              id="social-icon"
              className="fa fa-2x fa-facebook-official"
              onClick={() => (window.location.href = "https://www.facebook.com/covaidco")}
              aria-hidden="true"
            ></i>
            {/* <Button
              variant="link"
              id="footer-link"
              onClick={() => setCurrModal("feedback")}
            >
              Send feedback
            </Button> */}
            {/* <a
              id="footer-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Covaid-co/covaid-web"
            >
              Github
            </a>
            <a
              id="footer-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/covaidco"
            >
              Facebook
            </a>
            <a
              id="footer-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/covaidmutualaid/"
            >
              Instagram
            </a> */}
          </Col>
        </Row>
      </Container>
      {getCurrentModal()}
    </footer>
  );
}
