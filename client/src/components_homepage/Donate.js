import React from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

/**
 * About us/contributors page
 */

export default function Donate(props) {
  return (
    <div className="App">
      <NavBar
        setLanguage={props.setLanguage}
        language={props.language}
        isLoggedIn={props.isLoggedIn}
        first_name={Object.keys(props.currentUser).length !== 0 ? props.currentUser.first_name : ""}
      />
      <Container style={{ maxWidth: 2500, marginBottom: 100 }}>
        <Row>
          <Col md={6} id="login-container" style={{ paddingRight: 60 }}>
            <h1 id="home-heading">Donate</h1>
            <p id="regular-text">
              Though some people simply need help shopping for groceries or
              running an errand, others also need help paying for basic
              necessities such as food, toilet paper, and other simple home
              goods. Accordingly, we intend to use donated funds to defray the
              cost of such essential items for those who are most in need.
            </p>
            <p id="regular-text">
              We are constantly impressed by the kindness and generosity shown
              by people around the nation and are grateful for donations of any
              amount. All unused funds will be donated to food banks and other
              organizations that directly benefit local communities. Thank you
              for your support!
            </p>
          </Col>
          <Col
            md={6}
            id="login-container"
            style={{ marginTop: 100, paddingRight: 100 }}
          >
            <embed
              height="250px"
              width="100%"
              src="https://www.gofundme.com/mvc.php?route=widgets/mediawidget&fund=25wj3-covaid&coinfo=1"
              type="text/html"
            ></embed>
          </Col>
        </Row>
      </Container>
      <Footer key="2" />
    </div>
  );
}

Donate.propTypes = {
  setLanguage: PropTypes.func,
  language: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  currentUser: PropTypes.object
};
