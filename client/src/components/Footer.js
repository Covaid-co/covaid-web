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
                style={{ paddingLeft: 0, color: "#7B7B7B", marginLeft: 0 }}
              >
                covaid
              </Navbar.Brand>
            </Navbar>
            <Button
              variant="link"
              id="regular-text"
              style={{ color: "#2670FF", padding: 0 }}
              onClick={() => setCurrModal("faq")}
            >
              FAQ
            </Button>
            <br />
            <Button
              variant="link"
              id="regular-text"
              style={{ color: "#2670FF", padding: 0, marginTop: -8 }}
              onClick={() => (window.location.href = currURL + "/updates")}
            >
              Updates
            </Button>
            <br />
            <Button
              variant="link"
              id="regular-text"
              style={{ color: "#2670FF", padding: 0, marginTop: -8 }}
              onClick={() => setCurrModal("feedback")}
            >
              Send feedback
            </Button>
          </Col>
          <Col
            xs={2}
            style={{
              padding: 20,
              paddingLeft: 0,
              paddingTop: 80,
              paddingRight: 0,
            }}
          >
            <a
              id="regular-text"
              style={{ color: "#2670FF" }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Covaid-co/covaid-web"
            >
              Github
            </a>
            <br />
            <a
              id="regular-text"
              style={{ color: "#2670FF" }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/covaidco"
            >
              Facebook
            </a>
            <br />
            <a
              id="regular-text"
              style={{ color: "#2670FF" }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/covaidmutualaid/"
            >
              Instagram
            </a>
            <br />
          </Col>
          <Col xs={4} style={{ padding: 20, paddingLeft: 100, paddingTop: 37 }}>
            <p
              id="regular-text"
              style={{ color: "#7B7B7B", fontWeight: "bold" }}
            >
              Current Partners
            </p>
            {linkObject(
              "https://www.facebook.com/bmoremutualaid/",
              "Baltimore Mutual Aid"
            )}
            {linkObject(
              "https://www.pittsburghmutualaid.com/",
              "Pittsburgh Mutual Aid"
            )}
            {linkObject(
              "https://www.covid-gca.org/",
              "Greater Charlotte Area Mutual Aid"
            )}
          </Col>
          <Col xs={4} style={{ padding: 20, paddingLeft: 20, paddingTop: 78 }}>
            {linkObject(
              "https://www.facebook.com/groups/200572921276575/",
              "Delaware Mutual Aid"
            )}
            {linkObject(
              "https://ccomcovid.wixsite.com/covid",
              "CCOM COVID-19 Task Force"
            )}
            <p id="regular-text" style={{ marginBottom: 0 }}>
              Indy COVID-19 Neighbor Response Team
            </p>
          </Col>
        </Row>
      </Container>
      {getCurrentModal()}
    </footer>
  );
}
