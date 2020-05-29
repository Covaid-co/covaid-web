import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import LocationMap from './LocationMap';
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import { toastTime, currURL } from "../constants";
import RequestPage1 from "./RequestPage1";
import RequestPage2 from "./RequestPage2";
import RequestConfirmation from './RequestConfirmation';
import { translations } from "../translations/translations";
import LocalizedStrings from "react-localization";
import "./request.css";

/**
 * Request Support Main Page
 */

let translatedStrings = new LocalizedStrings({ translations });

export default function NewRequestPage(props) {
  const [locationString, setLocationString] = useState("");
  const [showInvalid, setShowInvalid] = useState(false);
  const [first_page, setFirstPage] = useState({});
  const [second_page, setSecondPage] = useState({});
  const [step_num, setStepNum] = useState(0);
  const [toast_message, setToastMessage] = useState('');
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (props.googleApiKey !== "") {
      props.setLocationState(props.googleApiKey); 
    }

    if (props.zipcode !== "") {
      setLocationString(props.zipcode);
    }
  }, [props.googleApiKey, props.zipcode]);

  const handleSubmit = (e) => {
    props.onLocationSubmit(e, locationString).then((res) => {
      if (res === false) {
        setShowInvalid(true);
        setToastMessage('Invalid Zip Code/City');
      }
    });
  };

  const confirmLocation = (step) => {
    if (props.zipcode === '' || locationString === '') {
      setShowInvalid(true);
      setToastMessage('Please enter a location');
    } else {
      handleSubmit({preventDefault: ()=>{}, stopPropagation: ()=>{}});
      setStepNum(step);
    }
  }

  const organizationText = () => {
    if (props.association === null || Object.keys(props.association).length === 0) {
      return <>
        <p id="subtitle-small" style={{marginTop: 0}}>
          Covaid is not working with any mutual aid programs in your area.
        </p>
        <p id="info" style={{marginTop: 20}}>
          However the Covaid team will still try and match you to any available registered volunteers!
        </p>
      </>
    } else {
      return <>
        <p id="subtitle-small">
          Your area's organization:
        </p>
        <p id="subtitle" style={{marginTop: 10}}>
          {props.association.name}
        </p>
        <p id="info">
          Any volunteers matched to you will be handled by {props.association.name}.
        </p>
      </>
    }
  }

  const submitRequest = () => {
    var assoc_id =
    props.association &&
    props.association._id &&
    props.association._id.length > 0
      ? props.association._id
      : "5e88cf8a6ea53ef574d1b80c";

    let form = {
      request: {
        personal_info: {
          requester_name: first_page.name,
          requester_phone: first_page.phone,
          requester_email: first_page.email,
          languages: first_page.languages,
        },
        request_info: {
          resource_request: second_page.resources,
          details: second_page.details,
          payment: second_page.payment,
          time: second_page.time,
          date: second_page.date,
        },
        location_info: {
          type: "Point",
          coordinates: [
            props.longitude,
            props.latitude,
          ],
        },
        status: {},
        association: assoc_id
      },
    };

    fetch("/api/request/create_request", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Request successfully created");
          setStepNum(5);
        } else {
          console.log("Request not successful");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const stepText = () => {
    if (step_num === 0) {
      return <>
        <p id="title">
          Step 1 —
        </p>
        <p id="subtitle">
          Set your location
        </p>
        <p id="info">
          We ask for your location so that can match you with organization volunteers in the area.
        </p>
        <Form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
          <InputGroup id="set-location" bssize="large">
            <Form.Control
              placeholder="City/Zipcode"
              value={locationString}
              onChange={(e) => setLocationString(e.target.value)}
            />
            {/* <InputGroup.Append>
              <Button variant="outline-secondary" id="location-change-button" onClick={handleSubmit}>Set Location</Button>
            </InputGroup.Append> */}
          </InputGroup>
        </Form>
        <Button
          id="large-button"
          style={{ marginTop: 15 }}
          onClick={() => {confirmLocation(1)}}
        >
          Next
        </Button>
        </>
    } else if (step_num === 1) {
      return <>
        {/* <Button id="back-button" onClick={() => setStepNum(0)}>←</Button> */}
        {organizationText()}
        <Form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
          <InputGroup id="set-location" bssize="large">
            <Form.Control
              placeholder="City/Zipcode"
              value={locationString}
              onChange={(e) => setLocationString(e.target.value)}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" id="location-change-button" onClick={handleSubmit}>Change Location</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        <Button
          id="large-button"
          style={{ marginTop: 15 }}
          onClick={() => {confirmLocation(2)}}
        >
          Next
        </Button>
      </>
    } else if (step_num === 2) {
      return <>
        <Button id="back-button" onClick={() => setStepNum(1)}>←</Button>
        <p id="title">
          Step 2 —
        </p>
        <p id="subtitle">
          Create a request
        </p>
        <p id="info">
          Given your request, we will try and match you with a volunteer in your area.
        </p>
        <p id="info">
          For those who would rather call in a request, please call <font style={{color: '#2670FF'}}>(401) 526-8243</font>
        </p>
      </>
    } else if (step_num === 3) {
      return <>
        <Button id="back-button" onClick={() => setStepNum(2)}>←</Button>
        <p id="title">
          Step 2.5 —
        </p>
        <p id="subtitle">
          Create a request
        </p>
        <p id="info">
          Given your request, we will try and match you with a volunteer in your area.
        </p>
        <p id="info">
          For those who would rather call in a request, please call <font style={{color: '#2670FF'}}>(401) 526-8243</font>
        </p>
      </>
    } else if (step_num === 4) {
      return <>
        <Button id="back-button" onClick={() => setStepNum(3)}>←</Button>
        <p id="title">
          Step 3 - 
        </p>
        <p id="subtitle">
          Confirm request information
        </p>
        <p id="info">
          This is your last step! Please make sure your request information is accurate.
        </p>
      </>
    } else if (step_num === 5) {
      return <>
        <p id="title">
          Your Done!
        </p>
        <p id="info">
          Our team will get back to you as soon as we can. Thank you for trusting Covaid with your needs.
        </p>
        <Button
          id="large-button"
          style={{ marginTop: 20 }}
          onClick={() => window.open(currURL, "_self")}
        >
          Return to Main Page
        </Button>
      </>
    }
  }

  const mapRequest = () => {
    if (step_num < 2) {
      return <LocationMap locationInfo={{longitude: props.longitude, latitude: props.latitude}}/>
    } else if (step_num === 2) {
      return (
        <Row style={{marginTop: 20}}>
          <Col sm={0} md={0} lg={2}></Col>
          <Col sm={12} md={12} lg={8}>
            <RequestPage1
              setFirstPage={setFirstPage}
              first_page={first_page}
              setStepNum={setStepNum}
              currentAssoc={props.association}
              translations={translatedStrings}
              language={language}
            />
          </Col>
        </Row>
      )
    } else if (step_num === 3) {
      return (
        <Row style={{marginTop: 20}}>
          <Col sm={0} md={0} lg={2}></Col>
          <Col sm={12} md={12} lg={8}>
            <RequestPage2
              currentAssoc={props.association}
              second_page={second_page}
              setStepNum={setStepNum}
              setSecondPage={setSecondPage}
              translations={translatedStrings}
              language={language}
            />
          </Col>
        </Row>
      )
    } else if (step_num === 4) {
      return (
        <RequestConfirmation
          first_page={first_page}
          setFirstPage={setFirstPage}
          second_page={second_page}
          setSecondPage={setSecondPage}
          currentAssoc={props.association}
          translations={translatedStrings}
          language={language}
          submitRequest={submitRequest}
        />
      )
    }
    return <></>
  }

  return [
    <div className="App" key="1">
      <NavBar isLoggedIn={false} totalVolunteers={0} orgPortal={true} />
      <Container style={{ maxWidth: 1500 }}>
        <Row>
          <Col lg={6} md={6} sm={12} id="left-container">
            <Row style={{marginTop: 70}}>
              <Col sm={0} md={1} lg={2}></Col>
              <Col xs={8}>
                {stepText()}
                <Toast
                  show={showInvalid}
                  delay={toastTime}
                  onClose={() => setShowInvalid(false)}
                  autohide
                  id="toastError"
                  style={{ marginBottom: -50, marginRight: 0 }}
                >
                  <Toast.Body>{toast_message}</Toast.Body>
                </Toast>
              </Col>
              <Col xs={2}></Col>
            </Row>
          </Col>
          <Col lg={6} md={6} sm={0} style={{marginTop: 50, paddingLeft: 40}}>
            {mapRequest()}
          </Col>
        </Row>
      </Container>
    </div>,
    <Footer key="2" />,
  ];
}

NewRequestPage.propTypes = {
  onLocationSubmit: PropTypes.func,
  setLocationState: PropTypes.func,
  googleApiKey: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  association: PropTypes.object,
  zipcode: PropTypes.string,
};