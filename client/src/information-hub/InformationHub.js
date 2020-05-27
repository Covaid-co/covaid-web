import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import LiveFeed from "./LiveFeed";

/**
 * Changelog/updates page for keeping track of covaid updates
 */

export default function InformationHub() {

  useEffect(() => {
   
  }, []);

  return (
    <div className="App">
    <NavBar isLoggedIn={false} pageLoaded={true}/>
    <div id="bgImage"></div>
    <Container style={{ maxWidth: 2500 }}>
      <Row>
        <Col md={2}>
        </Col>
        <Col id="login-container">
          <h1 id="home-heading">COVID-19 Information Hub</h1>
          <p id="regular-text">
            Below are curated resources sampled from national, state, and local goverments and health organizations. These links contain COVID-19 best practices, live statistics, and other useful resources to help through the pandemic. If you know of any other resources that you think would be useful, please let us know at covaidco@gmail.com.
          </p>
        </Col>
        <Col md={2}>
        </Col>
      </Row>
      <Row>
        <Col md={2}>
        </Col>
        <Col id="login-container">
            <LiveFeed />
        </Col>
        <Col md={2}>
        </Col>
      </Row>
      
      {/* 

        You'll want to make a component called InformationSection that takes in 2 props
        -> sectionID (will be used inside component to fetch all resources related to that sectionID)
          -> to see code examples of this look at the useEffect method inside YourOFfer.js (lines 57 - 66)
          -> Basically that will make an API call to your API
          -> Have a state variable (look at usage of useState) -> const [resources, setResources] = useState([]);
          -> After the fetch, setResources(<response from backend>)
        -> sectionName (will be used to render the name of the section)
        
        You can then make 4 of them down below

      <Row>
        <Col md={2}>
        </Col>
        <Col id="login-container">
            <InformationSection sectionID={1} sectionName={"The Basics of Coronavirus"} />
        </Col>
        <Col md={2}>
        </Col>
      </Row> 
      */}


    </Container>
    <Footer key="2"/>
  </div>
  );
}
