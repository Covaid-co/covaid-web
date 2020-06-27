import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import LiveFeed from "./LiveFeed";

import InformationSection from "./InformationSection";

/**
 * Changelog/updates page for keeping track of covaid updates
 */

export default function InformationHub(props) {
  const [locationString, setLocationString] = useState('');
  const [assocID, setAssocID] = useState('');
  const [assocName, setAssocName] = useState('');
  useEffect(() => {}, []);

  const handleSubmit = (e) => {
    props.getLatLong(e, locationString).then((res) => {
      if (res === false) {
        // TODO add toast and error
        // setToastMessage("Invalid Zip Code/City");
        // setShowToast(true);
      } else {
        const lat = res.lat;
        const lng = res.lng;
        props.findAssociationAndReturn(lat, lng).then((res) => {
          if (Object.keys(res).length !== 0) {
            setAssocName(res.name);
            setAssocID(res._id);
          }
        })
      }
    });
  };

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
      <div id="bgImageLong"></div>
      <Container
        style={{
          maxWidth: 2500,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Row>
          <Col md={2}></Col>
          <Col id="login-container">
            <h1 id="home-heading">COVID-19 Information Hub</h1>
            <p id="regular-text">
              Below are curated resources sampled from national, state, and
              local goverments and health organizations. These links contain
              COVID-19 best practices, live statistics, and other useful
              resources to help through the pandemic. If you know of any other
              resources that you think would be useful, please let us know at
              covaidco@gmail.com.
            </p>
          </Col>
          <Col md={2}></Col>
        </Row>
        <Row>
          <Col md={2}></Col>
          <Col id="login-container">
            <Form onSubmit={handleSubmit}>
              <InputGroup id="set-location" bssize="large">
                <Form.Control
                  placeholder="City/Zipcode"
                  value={locationString}
                  onChange={(e) => setLocationString(e.target.value)}
                />
                <InputGroup.Append>
                  <Button
                    type="submit"
                    variant="outline-secondary"
                    id="location-change-button"
                  >
                    Set Location
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </Col>
          <Col md={6}></Col>
        </Row>
        <Row>
          <Col md={2}></Col>
          <Col id="login-container">
            <InformationSection
              sectionID={assocID}
              sectionName={"Shared by " + assocName}
              mode={'assoc'}
            />
          </Col>
          <Col md={2}></Col>
        </Row>
        <Row>
          <Col md={2}></Col>
          <Col id="login-container">
            <InformationSection
              sectionID={0}
              sectionName={"The Basics of Coronavirus"}
            />
          </Col>
          <Col md={2}></Col>
        </Row>

        <Row>
          <Col md={2}></Col>
          <Col id="login-container">
            <InformationSection
              sectionID={1}
              sectionName={"Necessities: Food and Jobs"}
            />
          </Col>
          <Col md={2}></Col>
        </Row>

        <Row>
          <Col md={2}></Col>
          <Col id="login-container">
            <InformationSection
              sectionID={2}
              sectionName={"Entertaining and Caring for Yourself"}
            />
          </Col>
          <Col md={2}></Col>
        </Row>

        <Row>
          <Col md={2}></Col>
          <Col id="login-container">
            <InformationSection
              sectionID={3}
              sectionName={"Support and Engage in Your Community"}
            />
          </Col>
          <Col md={2}></Col>
        </Row>
      </Container>
      <Footer key="2" />
    </div>
  );
}
