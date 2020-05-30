import React from "react";
import PropTypes from "prop-types";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Jeff from "../assets/jeff.png";
import Debanik from "../assets/Debanik.png";
import Marissa from "../assets/marissa.jpeg";
import Elle from "../assets/elle.png";
import Trisha from "../assets/trisha.jpg";
import Shresta from "../assets/shresta.jpg";
import Matt from "../assets/matt.jpeg";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

/**
 * About us/contributors page
 */

export default function AboutUs(props) {
  const names = [
    "Jeffrey Li",
    "Debanik Purkayastha",
    "Marissa Turkin",
    "Elle Kolkin",
    "Trisha Ballakur",
    "Shresta Bangaru",
    "Matthew McDermut",
  ];
  const links = [
    "https://www.instagram.com/lijeffrey39/",
    "https://www.instagram.com/debanik1997/",
    "https://www.instagram.com/marissaturkin/",
    "https://www.linkedin.com/mwlite/in/ellekolkin",
    "https://www.linkedin.com/in/trisha-ballakur-070138187/",
    "https://www.linkedin.com/in/shresta-bangaru-411134190/",
    "https://www.instagram.com/matthewmcd2/",
  ];
  const images = [Jeff, Debanik, Marissa, Elle, Trisha, Shresta, Matt];

  return (
    <div className="App">
      <NavBar
        setLanguage={props.setLanguage}
        language={props.language}
        pageLoaded={true}
        isLoggedIn={false}
      />
      <Container style={{ maxWidth: 2500 }}>
        <Row>
          <Col md={6} id="login-container" style={{ paddingRight: 75 }}>
            <h1 id="home-heading">The People Behind Covaid</h1>
            <p id="regular-text">
              Hi! We're a group of college student/recent grads who want to play
              our part in the fight against COVID-19.
            </p>
            <p id="regular-text">
              Inspired by acts of mutual aid in our community, we created
              <strong>
                <font id="home" style={{ fontSize: 18 }}>
                  {" "}
                  covaid
                </font>
              </strong>
              , a tool to assist elderly and immunocompromised groups in this
              time of distress. We are neighbors that are truly concerned about
              our community as well as those affected around the United States.
              With this tool, we hope to give those most affected and vulnerable
              the help they need.
            </p>
            {/* <p id="regular-text">
              <strong>Any questions?</strong> Just email us at covaidco@gmail.com
            </p> */}
          </Col>
          <Col md={6} style={{ marginTop: 30 }}>
            <Row>
              {names.map((name, i) => {
                return (
                  <Col
                    key={i}
                    lg={4}
                    md={6}
                    sm={4}
                    xs={6}
                    style={{ textAlign: "center" }}
                  >
                    <img id="profile" alt="Avatar" src={images[i]}></img>
                    <br />
                    <a
                      id="profile-name"
                      href={links[i]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {name}
                    </a>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer key="2" />
    </div>
  );
}

AboutUs.propTypes = {
  setLanguage: PropTypes.func,
  language: PropTypes.string,
};
