import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBar from "../components/NavBar";
import Button from "react-bootstrap/Button";
import { currURL } from "../constants";
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
  const [first_page, setFirstPage] = useState({});
  const [second_page, setSecondPage] = useState({});
  const [step_num, setStepNum] = useState(0);

  useEffect(() => {
    if (props.googleApiKey !== "") {
      props.setLocationState(props.googleApiKey);
    }

    if (props.zipcode !== "") {
      setLocationString(props.zipcode);
    }
    document.title = "Request Support";
  }, [props.googleApiKey, props.zipcode]);

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
          languages: first_page.languages,
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
          setStepNum(3);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const stepText = () => {
    var topHeader = (
      <DefaultHeader
        translations={translatedStrings}
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
          <p id="subtitle">{translatedStrings[props.language].CreateRequest}</p>
          <p id="regular-text">
            {translatedStrings[props.language].intro1}
            <a
              href={
                props.association
                  ? props.association.homepage
                  : "https://covaid.co"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              {props.association ? props.association.name : "Covaid"}
            </a>
            {translatedStrings[props.language].intro2}
          </p>
          <p id="regular-text">{translatedStrings[props.language].motto}</p>
        </>
      );
    } else if (step_num === 1) {
      return (
        <>
          {langSelection(() => setStepNum(0), true)}
          <div id="separator"></div>
          <p id="title">{translatedStrings[props.language].Step} 2 —</p>
          <p id="subtitle">{translatedStrings[props.language].CreateRequest}</p>
          <p id="regular-text">
            {translatedStrings[props.language].AllVolunteer}
          </p>
          {topHeader}
        </>
      );
    } else if (step_num === 2) {
      return (
        <>
          {langSelection(() => setStepNum(1), true)}
          <div id="separator"></div>
          <p id="subtitle" style={{ marginTop: 20 }}>
            {translatedStrings[props.language].ConfirmRequest}
          </p>
          <p id="info">{translatedStrings[props.language].LastStep}</p>
        </>
      );
    } else if (step_num === 3) {
      return (
        <>
          <p id="title">You're Done!</p>
          { props.org != "pitt" && (
              <p id="info">
                {translatedStrings[props.language].SubmitRequestMsg}
              </p>
            )
          }
          { props.org === "pitt" && (
              <p id="info">
                {translatedStrings[props.language].PghMessage1}
                <a href="https://www.pittsburghmutualaid.com/resources">{translatedStrings[props.language].PghMessage2}</a>
                {translatedStrings[props.language].PghMessage3}
              </p>
            )
          }
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
    if (step_num === 0) {
      return (
        <>
          <p id="border-top">&nbsp;</p>
          <NewRequestPage2
            locationString={locationString}
            setLocationString={setLocationString}
            onLocationSubmit={props.onLocationSubmit}
            currentAssoc={props.association}
            second_page={second_page}
            setStepNum={setStepNum}
            setSecondPage={setSecondPage}
            translations={translatedStrings}
            language={props.language}
          />
        </>
      );
    } else if (step_num === 1) {
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
    } else if (step_num === 2) {
      return (
        <>
          <p id="border-top">&nbsp;</p>
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

  return (
    <div className="App" key="1">
      <NavBar
        setLanguage={props.setLanguage}
        language={props.language}
        isLoggedIn={false}
        simplified={true}
        request_page={true}
      />
      <div id="outer">
        <Container
          id={step_num === 1 ? "request-container-step2" : "request-container"}
        >
          <Row>
            <Col lg={6} md={6} sm={12} id="left-container">
              <div id="step-container">{stepText()}</div>
            </Col>
            <Col lg={6} md={6} sm={12} id="right-container">
              <div id={step_num === 1 ? "step2-container" : "step-container"}>
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
