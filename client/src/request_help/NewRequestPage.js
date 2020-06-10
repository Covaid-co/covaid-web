import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBar from "../components/NavBar";
import LocationMap from "./LocationMap";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import { toastTime, currURL } from "../constants";
import RequestPage1 from "./RequestPage1";
import RequestPage2 from "./RequestPage2";
import RequestConfirmation from "./RequestConfirmation";
import OrgHeader from "../association_request_headers/OrgHeader";
import DefaultHeader from "../association_request_headers/DefaultHeader";
import { translations } from "../translations/translations";
import LocalizedStrings from "react-localization";
import "./request.css";

/**
 * Request Support Main Page
 */

let translatedStrings = new LocalizedStrings({ translations });

export default function NewRequestPage(props) {
  const history = useHistory();
  const [locationString, setLocationString] = useState("");
  const [showInvalid, setShowInvalid] = useState(false);
  const [first_page, setFirstPage] = useState({});
  const [second_page, setSecondPage] = useState({});
  const [step_num, setStepNum] = useState(0);
  const [toast_message, setToastMessage] = useState("");

  useEffect(() => {
    if (props.googleApiKey !== "") {
      props.setLocationState(props.googleApiKey);
    }

    if (props.zipcode !== "") {
      setLocationString(props.zipcode);
    }
    document.title = "Request Support";
  }, [props.googleApiKey, props.zipcode]);

  const handleSubmit = (e) => {
    props.onLocationSubmit(e, locationString).then((res) => {
      if (res === false) {
        setShowInvalid(true);
        setToastMessage("Invalid Zip Code/City");
      }
    });
  };

  const confirmLocation = (step) => {
    if (locationString === "") {
      setShowInvalid(true);
      setToastMessage("Please enter a location");
    } else {
      handleSubmit({ preventDefault: () => {}, stopPropagation: () => {} });
      setStepNum(step);
    }
  };

  const organizationText = () => {
    if (
      props.association === null ||
      Object.keys(props.association).length === 0
    ) {
      return (
        <>
          <p id="subtitle-small">
            Covaid is not working with any mutual aid programs in your area.
          </p>
          <p id="info" style={{ marginTop: 20 }}>
            However the Covaid team will still try and match you to any
            available registered volunteers!
          </p>
        </>
      );
    } else {
      return (
        <>
          <p id="subtitle-small">Your area's organization:</p>
          <p id="subtitle" style={{ marginTop: 10 }}>
            {props.association.name}
          </p>
          <p id="info">
            Any volunteers matched to you will be handled by{" "}
            {props.association.name}.
          </p>
        </>
      );
    }
  };

  const associationExists = () => {
    return (
      props.association &&
      props.association._id &&
      props.association._id.length > 0
    );
  };

  const submitRequest = () => {
    var assoc_id = associationExists()
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
          behalf: first_page.behalf,
          resource_request: second_page.resources,
          details: second_page.details,
          payment: second_page.payment,
          time: second_page.time,
          date: second_page.date,
        },
        location_info: {
          type: "Point",
          coordinates: [props.longitude, props.latitude],
        },
        status: {},
        association: assoc_id,
      },
    };

    fetch("/api/request/create_request", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          setStepNum(5);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const associationLink = () => {
    return associationExists() ? props.association.homepage : "";
  };

  const associationName = () => {
    return associationExists() ? props.association.name : "we";
  };

  const stepText = () => {
    var topHeader = (
      <DefaultHeader
        translatedStrings={translatedStrings}
        language={props.language}
      />
    );
    if (props.association && Object.keys(props.association).length > 0) {
      topHeader = (
        <OrgHeader
          assoc={props.association}
          translations={translatedStrings}
          language={props.language}
        />
      );
    }

    if (step_num === 0) {
      return (
        <>
          <Button id="back-button" onClick={() => history.push("/")}>
            ←
          </Button>
          <p id="title">{translatedStrings[props.language].Step} 1 —</p>
          <p id="subtitle">{translatedStrings[props.language].SetLocation}</p>
          <p id="info">
            {translatedStrings[props.language].Step1Text1}{" "}
            {associationExists() ? (
              <a href={associationLink()}>{associationName()}</a>
            ) : (
              associationName()
            )}{" "}
            {translatedStrings[props.language].Step1Text2}
          </p>
          <Form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            <InputGroup id="set-location" bssize="large">
              <Form.Control
                placeholder="City/Zipcode"
                value={locationString}
                onChange={(e) => setLocationString(e.target.value)}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-secondary"
                  id="location-change-button"
                  onClick={handleSubmit}
                >
                  {translatedStrings[props.language].SetLocationShort}
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Button
            id="large-button"
            style={{ marginTop: 15, marginBottom: 30 }}
            onClick={() => confirmLocation(2)}
          >
            {translatedStrings[props.language].Next}
          </Button>
        </>
      );
    } else if (step_num === 1) {
      return (
        <>
          {organizationText()}
          <Form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            <InputGroup id="set-location" bssize="large">
              <Form.Control
                placeholder="City/Zipcode"
                value={locationString}
                onChange={(e) => setLocationString(e.target.value)}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-secondary"
                  id="location-change-button"
                  onClick={handleSubmit}
                >
                  {translatedStrings[props.language].ChangeLocation}
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Button
            id="large-button"
            style={{ marginTop: 15, marginBottom: 30 }}
            onClick={() => {
              confirmLocation(2);
            }}
          >
            {translatedStrings[props.language].Next}
          </Button>
        </>
      );
    } else if (step_num === 2) {
      return (
        <>
          <Button id="back-button" onClick={() => setStepNum(0)}>
            ←
          </Button>
          <p id="title">{translatedStrings[props.language].Step} 2 —</p>
          <p id="subtitle">{translatedStrings[props.language].CreateRequest}</p>
          {topHeader}
        </>
      );
    } else if (step_num === 3) {
      return (
        <>
          <Button id="back-button" onClick={() => setStepNum(2)}>
            ←
          </Button>
          <p id="title">{translatedStrings[props.language].Step} 2.5 —</p>
          <p id="subtitle">{translatedStrings[props.language].CreateRequest}</p>
          {topHeader}
        </>
      );
    } else if (step_num === 4) {
      return (
        <>
          <Button id="back-button" onClick={() => setStepNum(3)}>
            ←
          </Button>
          <p id="title">{translatedStrings[props.language].Step} 3 -</p>
          <p id="subtitle">
            {translatedStrings[props.language].ConfirmRequest}
          </p>
          <p id="info">{translatedStrings[props.language].LastStep}</p>
        </>
      );
    } else if (step_num === 5) {
      return (
        <>
          <p id="title">You're Done!</p>
          <p id="info">
            Our team will get back to you as soon as we can. Thank you for
            trusting Covaid with your needs.
          </p>
          <Button
            id="large-button"
            style={{ marginTop: 20 }}
            onClick={() => window.open(currURL, "_self")}
          >
            Return to Main Page
          </Button>
        </>
      );
    }
  };

  const mapRequest = () => {
    if (step_num < 2) {
      return (
        <LocationMap
          locationInfo={{
            longitude: props.longitude,
            latitude: props.latitude,
          }}
        />
      );
    } else if (step_num === 2) {
      return (
        <Row id={associationExists() ? "text-row" : ""}>
          <Col sm={1} md={0} lg={2}></Col>
          <Col sm={10} md={12} lg={8}>
            <p id="border-top">&nbsp;</p>
            <RequestPage1
              setFirstPage={setFirstPage}
              first_page={first_page}
              setStepNum={setStepNum}
              currentAssoc={props.association}
              translations={translatedStrings}
              language={props.language}
            />
          </Col>
        </Row>
      );
    } else if (step_num === 3) {
      return (
        <Row>
          <Col sm={0} md={0} lg={2}></Col>
          <Col sm={12} md={12} lg={8}>
            <p id="border-top">&nbsp;</p>
            <RequestPage2
              currentAssoc={props.association}
              second_page={second_page}
              setStepNum={setStepNum}
              setSecondPage={setSecondPage}
              translations={translatedStrings}
              language={props.language}
            />
          </Col>
        </Row>
      );
    } else if (step_num === 4) {
      return (
        <>
          <p
            id="border-top"
            style={associationExists() ? { marginTop: 70 } : { marginTop: 0 }}
          >
            &nbsp;
          </p>
          <RequestConfirmation
            first_page={first_page}
            setFirstPage={setFirstPage}
            second_page={second_page}
            setSecondPage={setSecondPage}
            currentAssoc={props.association}
            translations={translatedStrings}
            language={props.language}
            submitRequest={submitRequest}
          />
        </>
      );
    }
    return <></>;
  };

  const toastObj = () => {
    return (
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
    );
  };

  return [
    <div className="App" key="1">
      <NavBar
        setLanguage={props.setLanguage}
        language={props.language}
        isLoggedIn={false}
        orgPortal={true}
        simplified={true}
      />
      <Container
        style={{ maxWidth: 2500, marginBottom: 50 }}
        id="request-container"
      >
        <Row>
          <Col lg={6} md={6} sm={12} id="left-container">
            {associationExists() ? (
              <Row
                id="text-row"
                style={step_num === 2 || step_num === 3 ? { marginTop: 0 } : {}}
              >
                <Col xl={1} lg={1} md={0} sm={0}></Col>
                <Col xl={10} lg={10} md={12} sm={12}>
                  {stepText()}
                  {toastObj()}
                </Col>
              </Row>
            ) : (
              <Row id="text-row">
                <Col sm={1} md={1} lg={2}></Col>
                <Col xl={8} lg={8} md={10} sm={10}>
                  {stepText()}
                  {toastObj()}
                </Col>
              </Row>
            )}
          </Col>
          <Col lg={6} md={6} sm={0} id="right-container">
            {mapRequest()}
          </Col>
        </Row>
      </Container>
    </div>,
    // <Footer key="2" />,
  ];
}

NewRequestPage.propTypes = {
  language: PropTypes.string,
  setLanguage: PropTypes.func,
  onLocationSubmit: PropTypes.func,
  setLocationState: PropTypes.func,
  googleApiKey: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  association: PropTypes.object,
  zipcode: PropTypes.string,
};
