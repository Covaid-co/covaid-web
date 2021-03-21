import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { generateURL } from "../Helpers";
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
  const [resources, setResources] = useState([]);

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
  async function getResources() {
    var assoc_id = associationExists()
      ? props.association._id
      : "5e88cf8a6ea53ef574d1b80c";
    let params = { isPublic: true, associationID: assoc_id };

    var url = generateURL("/api/infohub/?", params);

    const response = await fetch(url);

    const jsonData = await response.json();

    setResources(jsonData.slice(0, 5));
  }

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
          getResources();
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
        <div id="separator">
          <p id="title">You're Done!</p>
          {props.org != "pitt" && (
            <p id="info">
              {translatedStrings[props.language].SubmitRequestMsg}
            </p>
          )}
          {props.org === "pitt" && (
            <p id="info">
              {translatedStrings[props.language].PghMessage1}
              <a href="https://www.pittsburghmutualaid.com/resources">
                {translatedStrings[props.language].PghMessage2}
              </a>
              {translatedStrings[props.language].PghMessage3}
            </p>
          )}
          <Button
            id="large-button"
            style={{ marginTop: 20 }}
            onClick={() => window.open(currURL, "_self")}
          >
            Return to Main Page
          </Button>
          </div>
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
    return (
      <>
      <div id="resourcesContainer2">
        <p id="title">Looking for immediate help?</p> 
        <p id="info">While you wait for us to get back to you, here are some resources near your zipcode for immediate help.</p>     
        <div id="resourcesContainer" style={{ width: '600px' }}>  
          <Container id="list-container" maxWidth="sm" style={{ maxHeight: '300px', width: '500px', justifyContent: "center" }}>
            {resources.map((resource, i) => {
              return (
                <a
                  href={resource.url}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <Container id="link-container" maxWidth="sm" style={{ maxHeight: '90px', minWidth: '100%', 
                      borderLeftColor: '#FFFFFF', borderRightColor: '#FFFFFF', borderRadius: '0px', borderBottomColor: '#FFFFFF' }}>
                    <p id="title2">{resource.name}</p>
                    {(() => {
                      if (resource.name.length < 21) {
                        return (
                          <div id="link-description-box1" style={{ height: '60px' }}>
                            <p id="info2">{resource.description}</p>
                          </div>
                        );
                      } else {
                        return (
                          <div id="link-description-box2" style={{ height: '60px'}}>
                            <p id="info2">{resource.description}</p>
                          </div>
                        );
                      }
                    })()}
                  </Container>
                </a>
              );
            })}
          </Container>
        </div>
        <div style={{ paddingTop: '300px' }}>
          <a href="/resources-page"> 
          <Button
              id="large-button"
            >
              View More Resources
          </Button></a>
        </div>
      </div>        
      </>
    );
  };

  if(props.org == "pitt") {
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
          <>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
      Pittsburgh Mutual Aid will be pausing all new requests so that we can figure out how to do our work more sustainably and intentionally. We will continue to work with people we’re already supporting and in communication with. Read below for more information.
      </h5>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
      Pittsburgh Mutual Aid was formed in March 2020 in response to crises of capitalism that already existed but were amplified by COVID-19. Over the course of the past year, we’ve built community and shared resources to support our neighbors through twice-weekly food distributions, financial disbursements, errands, rides, and more. This work has been both messy and beautiful, and we never anticipated it to grow at the rate or in the ways that it did. We want to honor this growth while remaining true to our values and deepening our commitment to this work.
      </h5>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
      With this in mind, Pittsburgh Mutual Aid has collectively decided to pause on taking requests from new people so that we can figure out how to continue with our work more intentionally, thoughtfully, and sustainably. During this time, we will continue our twice-weekly food distro, supporting folks we’re currently in community with, and working through a backlog of existing requests and cash disbursements. We will continue to put out signal boosts for existing requests on social media.
      </h5>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
      We are not able to provide direct support to new folks during this pause, but in preparation for pausing the intake of new requests, PMA has created a comprehensive document of resources that could be useful in finding other organizations and resources that are doing work to support the Pittsburgh community. The resource list will be posted on our website. 
      </h5>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
      In addition to working with other groups in Pgh, we encourage anyone who desires to start their own mutual aid projects to tap in to their community! We also encourage people to continue engaging in mutual aid together on our Facebook group page. PMA is working on creating resources that can help outline some of the logistics and look forward to connecting with you in new ways. 
      </h5>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
      We understand ourselves to be part of a broader constellation of care that will continue to support folks in this city.
      </h5>


      </>
          </Row>
        </Container>
      </div>
    </div>
    )
  }

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
