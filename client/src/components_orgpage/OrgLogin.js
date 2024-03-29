import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from "prop-types";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Cookie from "js-cookie";
import orgImg from "../assets/orgNew.png";
import requestsImg from "../assets/requests.png";
import topMatches from "../assets/topmatches.png";
import mapsImg from "../assets/mapscreen.png";

import pitt from "../assets/pitt.png";
import bmore from "../assets/bmore.png";
import char from "../assets/char.png";
import del from "../assets/delaware.png";
import ccom from "../assets/ccom.png";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import GetStarted from "./GetStarted";
import BeaconModal from "./BeaconModal";
import ResetPassword from "../components_modals/ResetPassword";

/**
 * Landing Page for non-logged in organizations
 */

export default function OrgLogin(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [show_toast, setShowToast] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    emailOrg: "",
    email: "",
    passOrg: "",
  });

  function validateForm() {
    return fields.emailOrg.length > 0 && fields.passOrg.length > 0;
  }

  useEffect(() => {
    if (props.orgReset) {
      setShowModal(true);
      setModalType("forgot");
    } else if (props.showBeaconModal) {
      setShowModal(true);
      setModalType("submit beacon"); // TODO: Fix double pop-up for modal 
    }
  }, [props.orgReset]);

  const handleSubmitForgot = async (e) => {
    e.preventDefault();
    let form = { email: fields.email };
    fetch("/api/association/emailpasswordresetlink", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          alert("Check your email for password link!");
        } else {
          alert("Error sending link!");
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const handleAdminSubmitForgot = async (e) => {
    e.preventDefault();
    let form = { email: fields.email };
    fetch("/api/association-admin/emailpasswordresetlink", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          alert("Check your email for password link!");
        } else {
          alert("Error sending link!");
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const tryLogin = async () => {
    try {
      let form = {
        association: {
          email: fields.emailOrg,
          password: fields.passOrg,
        },
      };
      const response = await fetch("/api/association/login/", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const responseJSON = await response.json();
      if (!responseJSON.errors) {
        Cookie.set("org_token", responseJSON.user.token);
        props.setShowLogin(false);
        props.login(false);
        return;
      } else {
        form = {
          admin: {
            email: fields.emailOrg,
            password: fields.passOrg,
          },
        };
        const adminResponse = await fetch("/api/association-admin/login/", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const adminResponseJSON = await adminResponse.json();
        if (!adminResponseJSON.errors) {
          Cookie.set("admin_token", adminResponseJSON.admin.token);
          Cookie.set("org_token", adminResponseJSON.admin.orgToken);
          props.setShowLogin(false);
          props.login(true);
          return;
        } else {
          alert("Login is incorrect. Please try again.");
        }
      }
    } catch (e) {
      alert("Login is incorrect. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await tryLogin();
  };

  const getCurrentModal = () => {
    var modal = <></>;
    if (modalType === "get started") {
      modal = (
        <GetStarted
          showModal={showModal}
          hideModal={() => setShowModal(false)}
        />
      );
    } else if (modalType === "submit beacon") {
      modal = (
        <BeaconModal
          showModal={showModal}
          hideModal={() => setShowModal(false)}
          registered={false}
        />
      );
    } else if (modalType === "forgot admin") {
      modal = (
        <ResetPassword
          showModal={showModal}
          hideModal={() => setShowModal(false)}
          handleSubmitForgot={handleAdminSubmitForgot}
          fields={fields}
          show_toast={show_toast}
          setShowToast={setShowToast}
          handleFieldChange={handleFieldChange}
        />
      );
    } else if (modalType === "forgot org") {
      modal = (
        <ResetPassword
          showModal={showModal}
          hideModal={() => setShowModal(false)}
          handleSubmitForgot={handleSubmitForgot}
          fields={fields}
          show_toast={show_toast}
          setShowToast={setShowToast}
          handleFieldChange={handleFieldChange}
        />
      );
    }
    return modal;
  };

  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="App">
      <NavBar
        setLanguage={props.setLanguage}
        language={props.language}
        isLoggedIn={false}
        totalVolunteers={0}
        orgPortal={true}
      />
      <Container style={{ maxWidth: 1500 }}>
        <Row>
          <Col md={6} id="login-container">
            <h1 id="home-heading">Covaid for Organizations</h1>
            <p
              id="home-subheading"
              style={{
                fontSize: "20px",
                paddingTop: "10px",
                paddingBottom: "30px",
              }}
            >
              Manage and delegate your volunteers efficiently through our
              all-in-one web platform.
            </p>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12}>
                  <Form.Group
                    controlId="emailOrg"
                    bssize="large"
                    style={{ marginBottom: 5 }}
                  >
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={fields.emailOrg}
                      onChange={handleFieldChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="passOrg" bssize="large">
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      value={fields.passOrg}
                      onChange={handleFieldChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                style={{ margin: "20px 0 10px 0", width: 200 }}
                id="request-button"
                disabled={!validateForm()}
                type="submit"
              >
                Sign In
              </Button>
              <Row>
                <Button
                  variant="link"
                  id="regular-text"
                  onClick={() => handleShowModal("forgot admin")}
                  style={{
                    color: "#2670FF",
                    padding: 0,
                    textDecoration: "underline",
                    marginTop: -2,
                    marginLeft: 14,
                  }}
                >
                  Forgot your admin password?
                </Button>
              </Row>
              <Row>
                <Button
                  variant="link"
                  id="regular-text"
                  onClick={() => handleShowModal("forgot org")}
                  style={{
                    color: "#2670FF",
                    padding: 0,
                    textDecoration: "underline",
                    marginTop: -2,
                    marginLeft: 14,
                  }}
                >
                  Forgot your organization password?
                </Button>
              </Row>
              {/* <p id="regular-text" style={{ marginTop: 5, color: "#2670FF", fontSize: 16 }}> 
                For organization password resets, please contact Covaid tech support
                </p> */}
              <p id="regular-text" style={{ marginTop: 15, color: "#2670FF" }}>
                Manage a mutual aid initiative?
                <Button
                  variant="link"
                  id="regular-text"
                  onClick={() => handleShowModal("get started")}
                  style={{
                    color: "#2670FF",
                    padding: 0,
                    textDecoration: "underline",
                    marginTop: -2,
                    marginLeft: 5,
                  }}
                >
                  Get Started
                </Button>
              </p>
              <h1 id="home-heading">Beacons</h1>
              <p id="regular-text" style={{ marginTop: 15, color: "#2670FF" }}>
                In need of volunteers? Covaid has a vast network of volunteers across various regions, and we can help you get connected!
                <Button
                  variant="link"
                  id="regular-text"
                  onClick={() => handleShowModal("submit beacon")}
                  style={{
                    color: "#2670FF",
                    padding: 0,
                    textDecoration: "underline",
                    marginTop: -2,
                    marginLeft: 5,
                  }}
                >
                  Submit a Beacon
                </Button>
              </p>
            </Form>
          </Col>
          <Col md={6} style={{ marginTop: 50 }}>
            <img id="org-img" alt="" src={orgImg}></img>
          </Col>
        </Row>
        <Row id="orgpage-separator">
          <Col xs={12}>
            <p id="requestCall" style={{ marginTop: 30, marginBottom: 0 }}>
              &nbsp;
            </p>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: 80,
            marginBottom: 100,
            paddingLeft: "10%",
            paddingRight: "10%",
          }}
        >
          <Col xs={12} id="org-feature-container">
            <h1 id="home-sub-heading">Our Current Partners</h1>
          </Col>
          <Col md={4} id="partner">
            <div
              className="inner-partner"
              style={{
                // backgroundImage: `url(${pitt})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                window.open("https://www.pittsburghmutualaid.com/");
              }}
            >
              <h1 id="partner-heading">Pittsburgh Mutual Aid</h1>
            </div>
          </Col>
          <Col md={4} id="partner">
            <div
              className="inner-partner"
              style={{
                // backgroundImage: `url(${bmore})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                window.open("https://www.facebook.com/bmoremutualaid/");
              }}
            >
              <h1 id="partner-heading">Baltimore Mutual Aid</h1>
            </div>
          </Col>
          <Col md={4} id="partner">
            <div
              className="inner-partner"
              style={{
                // backgroundImage: `url(${char})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                window.open("https://www.covid-gca.org/");
              }}
            >
              <h1 id="partner-heading">Greater Charlotte Area Mutual Aid</h1>
            </div>
          </Col>
          <Col md={4} id="partner">
            <div
              className="inner-partner"
              style={{
                // backgroundImage: `url(${del})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                window.open("https://www.facebook.com/groups/200572921276575/");
              }}
            >
              <h1 id="partner-heading">Delaware Mutual Aid</h1>
            </div>
          </Col>
          <Col md={4} id="partner">
            <div
              className="inner-partner"
              style={{
                // backgroundImage: `url(${ccom})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                window.open("https://ccomcovid.wixsite.com/covid");
              }}
            >
              <h1 id="partner-heading">CCOM COVID-19 Task Force</h1>
            </div>
          </Col>
          <Col md={4} id="partner">
            <div className="inner-partner">
              <h1 id="partner-heading">Indy Neighbor Response Team</h1>
            </div>
          </Col>
          {/* <Col md={4} id="partner">
                    <div className="inner-partner">
                        <h1 id="partner-heading">Team HBV</h1>
                    </div>
                </Col>
                <Col md={4} id="partner">
                    <div className="inner-partner">
                        <h1 id="partner-heading">Sunshine Pinellas Mutual Aid</h1>
                    </div>
                </Col>
                <Col md={4} id="partner">
                    <div className="inner-partner">
                        <h1 id="partner-heading">Evanston Mutual Aid</h1>
                    </div>
                </Col> */}
        </Row>
        <Row style={{ marginTop: 15 }}>
          <Col md={6} id="requests-feature-mobile">
            <h1 id="home-sub-heading">Track Requests</h1>
            <p
              id="home-subheading"
              style={{ fontSize: 16, paddingRight: 0, marginBottom: 0 }}
            >
              Optimize your workflow with the Covaid request tracker, an
              automated system for managing resource requests coming to your
              organization.
            </p>
          </Col>
          <Col
            md={6}
            id="requests-feature-container"
            style={{ textAlign: "center" }}
          >
            <img id="request-img" alt="" src={requestsImg}></img>
          </Col>
          <Col md={6} id="feature-container">
            <h1 id="home-sub-heading">Track Requests</h1>
            <p id="home-subheading" style={{ fontSize: 20 }}>
              Optimize your workflow with the Covaid Request Tracker, an
              automated system for managing resource requests coming to your
              organization.
            </p>
          </Col>
        </Row>
        <Row style={{ marginTop: 45 }}>
          <Col md={6} id="location-feature-container">
            <h1 id="home-sub-heading">Location Tracker</h1>
            <p
              id="home-subheading"
              style={{ fontSize: 20, paddingRight: 0, marginBottom: 0 }}
            >
              Delegate requests by location and better understand your volunteer
              base. The map integration also allows organization leaders to view
              the general location of in-progress and completed requests.
            </p>
          </Col>
          <Col md={6} id="map-feature-container">
            <img id="request-img" alt="" src={mapsImg}></img>
          </Col>
        </Row>
        <Row style={{ marginTop: 45 }}>
          <Col md={6} id="requests-feature-mobile">
            <h1 id="home-sub-heading">Match Volunteers</h1>
            <p
              id="home-subheading"
              style={{ fontSize: 20, paddingRight: 0, marginBottom: 0 }}
            >
              Easily match and notify volunteers in your organization to
              requests based on the recommended volunteers we offer.
            </p>
          </Col>
          <Col
            md={6}
            id="requests-feature-container"
            style={{ textAlign: "center" }}
          >
            <img id="request-img" alt="" src={topMatches}></img>
          </Col>
          <Col md={6} id="feature-container">
            <h1 id="home-sub-heading" style={{ marginTop: 140 }}>
              Match Volunteers
            </h1>
            <p id="home-subheading" style={{ fontSize: 20 }}>
              Easily match and notify volunteers in your organization to
              requests based on the recommended volunteers we offer.
            </p>
          </Col>
        </Row>
        <Row style={{ marginTop: 80, marginBottom: 100 }}>
          <Col xs={12} id="org-feature-container">
            <h1 id="home-sub-heading">Take your next step</h1>
            <p
              id="home-subheading"
              style={{
                fontSize: 20,
                paddingRight: 0,
                marginBottom: 0,
                letterSpacing: "-.01rem",
              }}
            >
              We’re excited to work with you and help grow your efforts!
            </p>
            <Button
              style={{ marginTop: 30, width: 250 }}
              id="request-button"
              onClick={() => handleShowModal("get started")}
            >
              Get Started
            </Button>
          </Col>
        </Row>
      </Container>
      {getCurrentModal()}
      <Footer key="2" handleShowModal={handleShowModal} />
    </div>
  );
}

OrgLogin.propTypes = {
  orgReset: PropTypes.bool,
  setShowLogin: PropTypes.func,
  login: PropTypes.func,
  language: PropTypes.string,
  setLanguage: PropTypes.func,
};