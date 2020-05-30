import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import fetch_a from "./util/fetch_auth";
import Pusher from "pusher-js";

import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import OrgLogin from "./components_orgpage/OrgLogin";
import Cookie from "js-cookie";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import RequestDetails from "./components_orgpage/RequestDetails";
import VolunteerDetails from "./components_orgpage/VolunteerDetails";
import VolunteersModal from "./components_orgpage/VolunteersModal";
import AdminModal from "./components_orgpage/AdminModal";
import BeaconCreation from "./components_orgpage/BeaconCreation";
import OrgResourcesModal from "./components_orgpage/OrgResourcesModal";
import LiveBeaconView from "./components_orgpage/LiveBeaconView";
import OrganizationRequestBoard from "./components_orgpage/OrganizationRequestBoard";
import OrganizationMap from "./components_orgpage/OrganizationMap";
import {
  fetchBeacons,
  fetchOrgVolunteers,
  getName,
  fetchOrgRequests,
} from "./components_orgpage/OrganizationHelpers";
import "./OrganizationPage.css";

export default function OrganiationPortal(props) {
  const { addToast } = useToasts();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currTabNumber, setCurrTab] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [association, setAssociation] = useState({});
  const [volunteers, setVolunteers] = useState([]);
  const [volunteersModal, setVolunteersModal] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [beaconModal, setBeaconModal] = useState(false);
  const [resourceModal, setResourceModal] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [beacons, setBeacons] = useState([]);
  const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
  const [requestDetailsModal, setRequestDetailsModal] = useState(false);
  const [currVolunteer, setCurrVolunteer] = useState({});
  const [currRequest, setCurrRequest] = useState({
    admin_info: {
      assignee: "1",
    },
    status: {
      current_status: 1,
      volunteers: [],
    },
    personal_info: {
      requester_name: "1",
      requester_email: "1",
      languages: ["English"],
    },
    request_info: {
      resource_request: ["1"],
      payment: 1,
      details: "1",
      time: "1",
      date: "1",
    },
    association: "5e88cf8a6ea53ef574d1b80c",
    location_info: { coordinates: [1, 1] },
  });

  const [admin, setAdmin] = useState({});

  const [beaconView, setBeaconView] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const [inRequest, setInRequest] = useState(false);
  const [inVolunteer, setInVolunteer] = useState(false);
  //console.log(props.switchToLanguage);
  useEffect(() => {
    if (Cookie.get("admin_token") && Cookie.get("org_token")) {
      login(true);
    } else if (Cookie.get("org_token")) {
      login(false);
    } else {
      setShowLogin(true);
    }
  }, []);

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  const pushBeacon = (beacon) => {
    setBeacons(beacons.concat(beacon));
  };

  function fetchCurrentAdmin() {
    fetch_a("admin_token", "/api/association-admin/current")
      .then((response) => response.json())
      .then((adminResponse) => {
        setAdmin(adminResponse);
        setPageLoaded(true);
      })
      .catch((e) => {
        alert(e);
      });
  }

  const fetch_requests = (id) => {
    fetchOrgRequests(id).then((requests) => {
      setAllRequests(requests);
    });
  };

  const pusherSetup = (id) => {
    var pusher = new Pusher("ed72954a8d404950e3c8", {
      cluster: "us2",
      forceTLS: true,
    });
    var channel = pusher.subscribe(id);
    channel.bind("general", function (data) {
      fetch_requests(id);
      addToast(data, {
        appearance: "info",
        autoDismiss: true,
      });
    });
    channel.bind("complete", function () {
      fetch_requests(id);
      addToast("Someone completed a request!", {
        appearance: "success",
        autoDismiss: true,
      });
    });
    channel.bind("request-details", function () {
      fetch_requests(id);
    });
  };

  function login(adminMode) {
    // Get association from login
    fetch('/api/association/current_demo')
      .then((response) => response.json())
      .then((association_response) => {
        setAssociation(association_response);
        pusherSetup(association_response._id);

        // Get requests for an association
        fetch_requests(association_response._id);

        // All beacons
        fetchBeacons().then((beacons) => {
          setBeacons(beacons);
        });

        // Get all volunteers for an association
        fetchOrgVolunteers(association_response._id).then((volunteers) => {
          setVolunteers(volunteers);
        });

        if (adminMode) {
          fetchCurrentAdmin();
        } else {
          setPageLoaded(true);
        }
      })
      .catch((e) => {
        alert(e);
      });
  }

  if (beaconView) {
    return (
      <LiveBeaconView
        volunteers={volunteers}
        association={association}
        setBeaconView={setBeaconView}
        beacons={beacons}
      />
    );
  } else if (showLogin === true) {
    return (
      <OrgLogin
        setLanguage={props.setLanguage}
        language={props.language}
        login={login}
        setShowLogin={setShowLogin}
        orgReset={props.location.orgReset}
      />
    );
  } else if (!pageLoaded) {
    return <></>;
  }
  return [
    <div className="App" key="1">
      <NavBar
        setLanguage={props.setLanguage}
        language={'en'}
        pageLoaded={pageLoaded}
        isLoggedIn={true}
        totalVolunteers={volunteers.length}
        setAdmin={setAdmin}
        orgPortal={true}
        first_name={getName(admin, association)}
        handleShowModal={() => {}}
      />
      <div style={{ zoom: "95%" }}>
        <Jumbotron
          fluid
          id="jumbo-volunteer"
          style={{ paddingBottom: 50, paddingTop: 60 }}
        >
          <Container style={{ maxWidth: 2000 }}>
            <Row>
              <Col lg={6} md={6} sm={12}>
                <h1 id="home-heading" style={{ marginTop: 0 }}>
                  Welcome back,
                </h1>
                <h1 id="home-heading" style={{ marginTop: 0 }}>
                  {association.name}!
                </h1>
                <p id="regular-text" style={{ fontSize: 20, marginBottom: 40 }}>
                  This is your organization portal, a place for you to manage
                  volunteers and requests in your area
                </p>
                <Button
                  id="medium-button"
                  style={{ marginRight: 10, marginTop: 5 }}
                  onClick={() => {
                    setAdminModal(true);
                  }}
                >
                  Manage Organization
                </Button>
                <Button
                  id="medium-button"
                  style={{ marginTop: 5 }}
                  onClick={() => {
                    setVolunteersModal(true);
                  }}
                >
                  View Volunteers
                </Button>{" "}
                <br />
                <Button
                  variant="link"
                  id="resources-link"
                  onClick={() => {
                    setResourceModal(true);
                  }}
                >
                  + Add a link to your community&apos;s resources
                </Button>
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                style={width < 768 ? { display: "none" } : { display: "block" }}
              >
                <Container
                  id="newOfferContainer"
                  style={{
                    width: "75%",
                    marginBottom: 0,
                    position: "absolute",
                    marginTop: 20,
                  }}
                >
                  <h3 id="home-heading" style={{ marginTop: 0, fontSize: 20 }}>
                    Need a task done?{" "}
                    <Badge id="task-info" style={{ background: "#AE2F2F" }}>
                      BETA
                    </Badge>
                  </h3>
                  <p id="regular-text" style={{ marginBottom: 10 }}>
                    Use our <b>Beacon Notification System</b> and mass notify
                    your volunteers about any internal organization requests
                  </p>
                  <Row>
                    <Col style={{ paddingRight: 5 }}>
                      <Button
                        id="large-button"
                        onClick={() => {
                          setBeaconModal(true);
                        }}
                      >
                        Create Beacon
                      </Button>
                    </Col>
                    <Col style={{ paddingLeft: 5 }}>
                      <Button
                        id="large-button-empty"
                        style={{ marginTop: 0, paddingLeft: 5 }}
                        onClick={() => {
                          setBeaconView(true);
                        }}
                      >
                        Live Beacons (
                        {
                          beacons.filter((beacon) => beacon.beaconStatus === 1)
                            .length
                        }
                        )
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
        <Container style={{ maxWidth: 2000 }}>
          <Row className="justify-content-md-center">
            <Col lg={6} md={12} sm={12} style={{ marginTop: -44 }}>
              <OrganizationRequestBoard
                currTabNumber={currTabNumber}
                setCurrTab={setCurrTab}
                allRequests={allRequests}
                setInRequest={setInRequest}
                setCurrRequest={setCurrRequest}
                setRequestDetailsModal={setRequestDetailsModal}
              />
            </Col>
            <Col lg={6} md={12} sm={12}>
              <OrganizationMap
                requests={allRequests}
                volunteers={volunteers}
                mode={currTabNumber}
                allRequests={allRequests}
                volunteerDetailModal={volunteerDetailModal}
                association={association}
                setVolunteerDetailsModal={setVolunteerDetailsModal}
                width={width}
                currVolunteer={currVolunteer}
                setCurrVolunteer={setCurrVolunteer}
                requestDetailsModal={requestDetailsModal}
                setRequestDetailsModal={setRequestDetailsModal}
                currRequest={currRequest}
                setCurrRequest={setCurrRequest}
                setInRequest={setInRequest}
              />
            </Col>
          </Row>
        </Container>
        <VolunteersModal
          volunteersModal={volunteersModal}
          setVolunteersModal={setVolunteersModal}
          volunteers={volunteers}
          association={association}
          setCurrVolunteer={setCurrVolunteer}
          setVolunteerDetailsModal={setVolunteerDetailsModal}
          setInVolunteer={setInVolunteer}
        />
        <AdminModal
          adminModal={adminModal}
          setAdminModal={setAdminModal}
          association={association}
          setAssociation={setAssociation}
        />
        <OrgResourcesModal
          resourceModal={resourceModal}
          setResourceModal={setResourceModal}
          association={association}
          setAssociation={setAssociation}
        />
        <VolunteerDetails
          volunteerDetailModal={volunteerDetailModal}
          setVolunteerDetailsModal={setVolunteerDetailsModal}
          currVolunteer={currVolunteer}
          setVolunteersModal={setVolunteersModal}
          currRequest={currRequest}
          requestDetailsModal={requestDetailsModal}
          setRequestDetailsModal={setRequestDetailsModal}
          inRequest={inRequest}
          inVolunteer={inVolunteer}
        />
        <RequestDetails
          requestDetailsModal={requestDetailsModal}
          setRequestDetailsModal={setRequestDetailsModal}
          volunteerDetailModal={volunteerDetailModal}
          setVolunteerDetailsModal={setVolunteerDetailsModal}
          setCurrVolunteer={setCurrVolunteer}
          currRequest={currRequest}
          setCurrRequest={setCurrRequest}
          association={association}
          allRequests={allRequests}
          setAllRequests={setAllRequests}
          mode={currTabNumber}
          volunteers={volunteers}
          admin={admin}
          setInRequest={setInRequest}
        />
        <BeaconCreation
          beaconModal={beaconModal}
          setBeaconModal={setBeaconModal}
          association={association}
          volunteers={volunteers}
          pushBeacon={pushBeacon}
          switchToBeacon={() => setBeaconView(true)}
        />
      </div>
    </div>,
    <Footer key="2" />,
  ];
}

OrganiationPortal.propTypes = {
  language: PropTypes.string,
  setLanguage: PropTypes.func,
};
