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
import NewRequestPage1 from "./NewRequestPage1";
import NewRequestPage2 from "./NewRequestPage2";
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
          requester_name: second_page.name,
          requester_phone: second_page.phone,
          requester_email: second_page.email,
          languages: second_page.languages,
          contact_option: second_page.contact_option,
        },
        request_info: {
          behalf: second_page.behalf,
          resource_request: first_page.resources,
          details: first_page.details,
          payment: first_page.payment,
          time: first_page.time,
          date: first_page.date,
          high_priority: first_page.high_priority,
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

    const langSelection = (clickFn, extraMargin) => {
      return (
        <div id={extraMargin ? "small-margin" : ""}>
          <Button
            id="back-button"
            onClick={clickFn}
            style={{ display: "inline" }}
          >
            ←
          </Button>
          <Button
            id={
              props.language === "en"
                ? "volunteer-not-selected"
                : "volunteer-selected"
            }
            onClick={() => props.setLanguage("es")}
          >
            Spanish
          </Button>
          <Button
            id={
              props.language === "en"
                ? "volunteer-selected"
                : "volunteer-not-selected"
            }
            onClick={() => props.setLanguage("en")}
          >
            English
          </Button>
        </div>
      );
    };

    if (step_num === 0) {
      return (
        <>
          {langSelection(() => history.push("/"), true)}
          <div id="separator"></div>
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
          {langSelection(() => setStepNum(0), false)}
          {associationExists() ? <></> : <div id="separator"></div>}
          <p id="title">{translatedStrings[props.language].Step} 2 —</p>
          <p id="subtitle">{translatedStrings[props.language].CreateRequest}</p>
          {topHeader}
        </>
      );
    } else if (step_num === 3) {
      return (
        <>
          {langSelection(() => setStepNum(2), false)}
          {associationExists() ? <></> : <div id="separator"></div>}
          <p id="title">{translatedStrings[props.language].Step} 3 —</p>
          <p id="subtitle">{translatedStrings[props.language].CreateRequest}</p>
          {topHeader}
        </>
      );
    } else if (step_num === 4) {
      return (
        <>
          {langSelection(() => setStepNum(3), true)}
          <div id="separator"></div>
          <p id="subtitle" style={{ marginTop: 50 }}>
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
        <>
          <p id="border-top">&nbsp;</p>
          <NewRequestPage1
            setFirstPage={setFirstPage}
            first_page={first_page}
            setStepNum={setStepNum}
            currentAssoc={props.association}
            translations={translatedStrings}
            language={props.language}
          />
        </>
      );
    } else if (step_num === 3) {
      return (
        <>
          <p id="border-top">&nbsp;</p>
          <NewRequestPage2
            currentAssoc={props.association}
            second_page={second_page}
            setStepNum={setStepNum}
            setSecondPage={setSecondPage}
            translations={translatedStrings}
            language={props.language}
          />
        </>
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
        style={{ marginBottom: 90, marginRight: 15 }}
      >
        <Toast.Body>{toast_message}</Toast.Body>
      </Toast>
    );
  };

  return (
    <div className="App" key="1">
      <NavBar
        setLanguage={props.setLanguage}
        language={props.language}
        isLoggedIn={false}
        orgPortal={true}
        simplified={true}
        request_page={true}
      />
      <div id="outer">
        <Container
          id={step_num === 2 ? "request-container-step2" : "request-container"}
        >
          <Row>
            <Col lg={6} md={6} sm={12} id="left-container">
              <div id="step-container">
                {stepText()}
                {toastObj()}
              </div>
            </Col>
            <Col lg={6} md={6} sm={12} id="right-container">
              <div id={step_num === 2 ? "step2-container" : "step-container"}>
                {mapRequest()}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
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
