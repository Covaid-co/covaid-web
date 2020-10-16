import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import LiveFeed from "./LiveFeed";

import InformationSection from "./InformationSection";

import "./InformationHub.css";

/**
 * Changelog/updates page for keeping track of covaid updates
 */
import { toastTime, contact_option, covaid_assoc_id, covaid_assoc_name } from "../constants";

export default function InformationHub(props) {
  const [locationString, setLocationString] = useState("");
  const [assocID, setAssocID] = useState(covaid_assoc_id);
  const [assocName, setAssocName] = useState(covaid_assoc_name); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  useEffect(() => {}, []);

  const handleSubmit = (e) => {
    props.getLatLong(e, locationString).then((res) => {
      if (res === false) {
        // TODO add toast and error
        setAssocID(covaid_assoc_id);
        setAssocName(covaid_assoc_name); 
        //setToastMessage("Invalid Zip Code/City");
        //setShowToast(true);
      } else {
        const lat = res.lat;
        const lng = res.lng;
        props.findAssociationAndReturn(lat, lng).then((res) => {
          //setShowToast(false);
          if (Object.keys(res).length !== 0) {
            setAssocName(res.name);
            setAssocID(res._id);
          } else {
            setAssocID(covaid_assoc_id);
            setAssocName(covaid_assoc_name); 
          }
        });
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
      <Container id="infohub-container">
        <Row>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
          <Col id="infohub-card">
            <h1 id="home-heading">COVID-19 Resources Page</h1>
            <p id="regular-text">
              Below are curated resources sampled from national, state, and
              local goverments and health organizations. These links contain
              COVID-19 best practices, live statistics, and other useful
              resources to help through the pandemic. If you know of any other
              resources that you think would be useful, please let us know at
              covaidco@gmail.com.
            </p>
          </Col>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
        </Row>
        <Row>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
          <Col id="infohub-card">
            <Form onSubmit={handleSubmit}>
              <InputGroup id="set-location" bssize="large">
                <Form.Control
                  placeholder="City/Zipcode"
                  value={locationString}
                  onChange={(e) => setLocationString(e.target.value)}
                  id="location-bar"
                />
                <InputGroup.Append>
                  <Button
                    type="submit"
                    variant="outline-secondary"
                    id="location-change-button"
                  >
                    Set Location
                  </Button>
                  <Toast
                    show={showToast}
                    delay={toastTime}
                    onClose={() => setShowToast(false)}
                    autohide
                    style={{ marginBottom: 80, marginRight: 15 }}
                    id="toastError"
                  >
                    <Toast.Body>{toastMessage}</Toast.Body>
                  </Toast>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </Col>
          <Col xs={1} sm={3} md={3} lg={6}></Col>
        </Row>
        <Row>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
          <Col id="infohub-card">
            <InformationSection
              sectionID={assocID}
              sectionName={"shared by " + assocName}
              mode={"assoc"}
            />
          </Col>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
        </Row>
        <Row>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
          <Col id="infohub-card">
            <InformationSection
              sectionID={0}
              sectionName={"The Basics of Coronavirus"}
            />
          </Col>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
        </Row>

        <Row>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
          <Col id="infohub-card">
            <InformationSection
              sectionID={1}
              sectionName={"Necessities: Food and Jobs"}
            />
          </Col>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
        </Row>

        {/*<Row>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
          <Col id="infohub-card">
            <InformationSection
              sectionID={2}
              sectionName={"Entertaining and Caring for Yourself"}
            />
          </Col>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
        </Row>*/}
        
        <Row>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
          <Col id="infohub-card">
            <InformationSection
              sectionID={2}
              sectionName={"Other resources"}
            />
          </Col>
          <Col xs={1} sm={1} md={1} lg={2}></Col>
        </Row>
      </Container>
      <Footer key="2" />
    </div>
  );
}
