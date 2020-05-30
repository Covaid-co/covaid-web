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

  const setCurrModal = (name) => {
    setShowModal(true);
    setModalName(name);
  };

  const linkObject = (url, name) => {
    return (
      <>
        <a
          id="regular-text"
          style={{ marginBottom: 0 }}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </a>
        <br />
      </>
    );
  };

  return (
    <footer className="footer">
      <Container>
        <Row style={{ textAlign: "left", paddingBottom: 30 }}>
          <Col xs={2} style={{ padding: 20, paddingRight: 0 }}>
            <Navbar style={{ paddingLeft: 0, paddingBottom: 0 }}>
              <Navbar.Brand
                id="navbar-brand"
                style={{
                  paddingLeft: 0,
                  color: "#7B7B7B",
                  marginLeft: 0,
                  marginTop: 20,
                }}
              >
                covaid
              </Navbar.Brand>
            </Navbar>
          </Col>
          <Col xs="10" style={{ textAlign: "right", marginTop: 50 }}>
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
              onClick={() => setCurrModal("feedback")}
            >
              Send feedback
            </Button>
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
