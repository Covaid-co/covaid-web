import React from "react";
import PropTypes from "prop-types";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Jeff from "../assets/jeff.png";
import Debanik from "../assets/Debanik.png";
import Marissa from "../assets/marissa.jpeg";
import Elle from "../assets/elle.jpg";
import Trisha from "../assets/trisha.jpg";
import Shresta from "../assets/shresta.jpg";
import Matt from "../assets/matt.jpeg";
import Neely from "../assets/neely.jpg";
import Ellie from "../assets/ellie.jpeg";
import Eliza from "../assets/eliza.jpeg";
import Daniella from "../assets/danielle.jpg";
import Yoav from "../assets/yoav.jpg";
import Sofia from "../assets/sofia.jpg";
import Angela from "../assets/angela.jpg";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

/**
 * About us/contributors page
 */

export default function AboutUs(props) {
  document.title = "Covaid | About";
  const peoples = {
    "Jeffrey Li": {
      link: "https://www.instagram.com/lijeffrey39/",
      image: Jeff,
    },
    "Debanik Purkayastha": {
      link: "https://www.instagram.com/debanik1997/",
      image: Debanik,
    },
    "Marissa Turkin": {
      link: "https://www.instagram.com/marissaturkin/",
      image: Marissa,
    },
    "Elle Kolkin": {
      link: "https://www.linkedin.com/mwlite/in/ellekolkin",
      image: Elle,
    },
    "Trisha Ballakur": {
      link: "https://github.com/trishaBallakur",
      image: Trisha,
    },
    "Shresta Bangaru": {
      link: "https://www.linkedin.com/in/shresta-bangaru-411134190/",
      image: Shresta,
    },
    "Matthew McDermut": {
      link: "https://www.instagram.com/matthewmcd2/",
      image: Matt,
    },
    "Neely Lee": {
      link: "www.linkedin.com/in/neelylee",
      image: Neely,
    },
    "Ellie Sapiro": {
      link: "https://www.linkedin.com/in/ellie-sapiro/",
      image: Ellie,
    },
    "Eliza Kleban": {
      link: "https://www.linkedin.com/in/eliza-kleban-429a421a3/",
      image: Eliza,
    },
    "Danielle Serota": {
      link: "https://www.instagram.com/danielle___eve/",
      image: Daniella,
    },
    "Yoav Kadan": {
      link: "",
      image: Yoav,
    },
    "Sofia Kling": {
      link: "",
      image: Sofia,
    },
    "Angela Luo": {
      link: "https://www.linkedin.com/in/al490/",
      image: Angela,
    },
  };

  const names = Object.keys(peoples);
  names.sort();

  return (
    <div className="App">
      <NavBar
        setLanguage={props.setLanguage}
        language={props.language}
        pageLoaded={true}
        isLoggedIn={props.isLoggedIn}
        first_name={
          Object.keys(props.currentUser).length !== 0
            ? props.currentUser.first_name
            : ""
        }
      />
      <Container style={{ maxWidth: 2500 }}>
        <Row>
          <Col md={1} id="login-container"></Col>
          <Col md={10} id="login-container" style={{ textAlign: "center" }}>
            <h1 id="home-heading" style={{ marginBottom: 40, fontSize: 60 }}>
              The People Behind<br></br>Covaid
            </h1>
            <p id="regular-text" style={{ marginBottom: 40, fontSize: 20 }}>
              We're a group of college students/recent grads who want to play
              our part in the fight against COVID-19.
            </p>
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
                    <img
                      id="profile"
                      alt="Avatar"
                      src={peoples[name]["image"]}
                    ></img>
                    <br />
                    <a
                      id="profile-name"
                      href={peoples[name]["link"]}
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
          <Col md={1} id="login-container"></Col>
        </Row>
      </Container>
      <Footer key="2" />
    </div>
  );
}

AboutUs.propTypes = {
  setLanguage: PropTypes.func,
  language: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  currentUser: PropTypes.object,
};
