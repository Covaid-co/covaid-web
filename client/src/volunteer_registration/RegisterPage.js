import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import NewLocationSetting from "../location_tools/NewLocationSetting";
import GetLocation from "../location_tools/GetLocation";
import NewLogin from "../components_modals/NewLogin";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import RegisterPage1 from "./RegisterPage1";
import RegisterPage2 from "./RegisterPage2";
import RegisterPage3 from "./RegisterPage3";
import OrgHeader from "../association_volunteer_header/OrgHeader";
import DefaultHeader from "../association_volunteer_header/DefaultHeader";
import CurrentLocation from "../location_tools/CurrentLocation";

/**
 * Volunteer Registration Main Page
 */

export default function RegisterPage(props) {
  const [showModal, setShowModal] = useState(false);
  const [firstPage, setFirstPage] = useState({});
  const [modalType, setModalType] = useState("");
  const [secondPage, setSecondPage] = useState({});
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    setShowModal(false);
    if (props.googleApiKey !== "") {
      props.setLocationState(props.googleApiKey); 
    }
  }, [props.googleApiKey]);

  const showModalType = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const volunteerFormInfo = () => {
    var topHeader = <DefaultHeader />;
    if (
      props.association &&
      Object.keys(props.association).length > 0
    ) {
      topHeader = <OrgHeader assoc={props.association} />;
    }
    return (
      <>
        {topHeader}
        <CurrentLocation
          locality={props.locality}
          zipcode={props.zipcode}
          showModal={() => showModalType("location")}
        />
      </>
    );
  };

  const handleSubmit = (thirdPage) => {
    let form = {
      user: {
        first_name: firstPage.first_name,
        last_name: firstPage.last_name,
        email: firstPage.email,
        password: firstPage.password,
        pronouns: firstPage.pronouns,
        availability: true,
        location: {
          type: "Point",
          coordinates: [
            props.longitude,
            props.latitude,
          ],
        },
        offer: {
          details: secondPage.details,
          tasks: secondPage.tasks,
          neighborhoods: firstPage.neighborhoods,
          state: props.stateString,
          car: secondPage.car,
          timesAvailable: secondPage.timesAvailable,
          canHelp: thirdPage.canHelp,
          helpDetails: thirdPage.helpDetails,
        },
        association: props.association._id
          ? props.association._id
          : "",
        association_name: props.association.name
          ? props.association.name
          : "",
        languages: ["English"],
        phone: firstPage.phone,
      },
    };

    // console.log(form);
    // return
    fetch("/api/users/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then(() => {
            setJustRegistered(true);
          });
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const displayRegisterPage = () => {
    if (Object.keys(firstPage).length === 0) {
      return (
        <RegisterPage1
          setFirstPage={setFirstPage}
          neighborhoods={props.neighborhoods}
        />
      );
    } else if (Object.keys(secondPage).length === 0) {
      return (
        <RegisterPage2
          setSecondPage={setSecondPage}
          currentAssoc={props.association}
        />
      );
    } else {
      return (
        <RegisterPage3
          handleSubmit={handleSubmit}
          currentAssoc={props.association}
        />
      );
    }
  };

  const getCurrentModal = () => {
    var modal = <></>;
    if (modalType === "location") {
      modal = (
        <NewLocationSetting
          locationSubmit={props.onLocationSubmit}
          refreshLocation={props.refreshLocation}
          showModal={showModal}
          hideModal={handleHideModal}
        />
      );
    } else if (modalType === "signin") {
      modal = <NewLogin showModal={showModal} hideModal={handleHideModal} />;
    }
    return modal;
  };

  if (justRegistered) {
    return [
      <div className="App" key="1">
        <NavBar
          isLoggedIn={false}
          totalVolunteers={0}
          handleShowModal={showModalType}
        />
        <Container style={{ maxWidth: 1500 }}>
          <Row>
            <Col lg={3} md={2} sm={0}></Col>
            <Col lg={6} md={8} sm={12}>
              <Container id="newOfferContainer" style={{ marginBottom: 0 }}>
                <h1 id="small-header">
                  Check your email for a verification link!
                </h1>
                <p id="regular-text" style={{ marginBottom: 5 }}>
                  Once verified, you will be able to post an offer to support
                  your community directly from your volunteer portal.
                </p>
              </Container>
            </Col>
            <Col lg={3} md={2} sm={0}></Col>
          </Row>
        </Container>
      </div>,
      <Footer key="2" />,
    ];
  }

  return [
    <div className="App" key="1">
      <NavBar isLoggedIn={false} handleShowModal={showModalType} />
      <Container style={{ maxWidth: 1500 }}>
        <Row>
          <Col lg={3} md={2} sm={0}></Col>
          <Col lg={6} md={8} sm={12}>
            <Container id="newOfferContainer">{volunteerFormInfo()}</Container>
          </Col>
          <Col lg={3} md={2} sm={0}></Col>
        </Row>
        <Row>
          <Col lg={3} md={2} sm={0}></Col>
          <Col lg={6} md={8} sm={12}>
            <Container id="newOfferContainer" style={{ marginBottom: 15 }}>
              {displayRegisterPage()}
            </Container>
          </Col>
          <Col lg={3} md={2} sm={0}></Col>
        </Row>
      </Container>
      <GetLocation
        isLoaded={props.isLoaded}
        onLocationSubmit={props.onLocationSubmit}
      />
      {getCurrentModal()}
    </div>,
    <Footer key="2" />,
  ];
}

RegisterPage.propTypes = {
  association: PropTypes.object,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  locality: PropTypes.string,
  stateString: PropTypes.string,
  zipcode: PropTypes.string,
  neighborhoods: [PropTypes.string]
};
