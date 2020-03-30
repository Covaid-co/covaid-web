import React, { useState } from "react";
import NewYourOffer from './NewYourOffer'
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
const queryString = require('query-string');

export default function VolunteerPortal(props) {
    return (
        <div>
            <Jumbotron style={
                {alignItems: "center",
                display: "flex",
                justifyContent: "center",
                margin: "auto"
            }
            } fluid>
              <Container>
          <h1 id="jumboHeading">Welcome back, {props.state.first_name}!</h1>
                <p id="jumboText">This is your volunteer portal, a place for you to manage your offers and requests</p>		
              </Container>
            </Jumbotron>
            <br />
            <Tabs defaultActiveKey="offers" id="uncontrolled-tab-example" className="justify-content-center">
              <Tab eventKey="offers" title="My Offer" id='bootstrap-overide'>
                <NewYourOffer state={props.state}/> 
              </Tab>
            </Tabs>
        </div>
    );
}
