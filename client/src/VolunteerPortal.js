/**
 * Volunteer Portal component for covaid
 */

import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import PropTypes from "prop-types";
import { useToasts } from "react-toast-notifications";
import AccountInfo from "./components_volunteer/AccountInfo";
import YourOffer from "./components_volunteer/YourOffer";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CurrentVolunteerRequests from "./components_volunteer/CurrentVolunteerRequests";
import CompletedVolunteerRequests from "./components_volunteer/CompletedVolunteerRequests";
import ProfileHeader from "./components_volunteer/ProfileHeader";
import RequestDashboard from "./components_volunteer/RequestDashboard";
import { request_status, volunteer_status } from "./constants";
import { generateURL } from "./Helpers";
import NavBar from "./components/NavBar";
import VolunteerLogin from "./components_volunteer/VolunteerLogin";
import VolunteerBeacons from "./components_volunteer/VolunteerBeacons";
import "./VolunteerPage.css";
import fetch_a from "./util/fetch_auth";
import Footer from "./components/Footer";

export default function VolunteerPortal(props) {
  const [tabNum, setTabNum] = useState(1);
  const [user, setUser] = useState({});
  const [foundUser, setFoundUser] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [beacons, setBeacons] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [view, setView] = useState("request-dashboard");
  const { addToast } = useToasts();

  // fetch requests given a status, update frontend state using 'requestStateChanger'
  const fetchRequests = (status, requestStateChanger, reverse) => {
    let params = { status: status };
    var url = generateURL("/api/request/volunteerRequests?", params);
    fetch_a("token", url, {
      method: "get",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            if (reverse) {
              data = data.reverse();
            }
            requestStateChanger(data);
          });
        } else {
          console.log("Error");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // fetch beacons tied to a user
  const fetchBeacons = () => {
    fetch_a("token", "/api/beacon/user", {
      method: "get",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setBeacons(data);
          });
        } else {
          console.log("Error");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchUser = () => {
    // Get the current authenticated user
    fetch_a("token", "/api/users/current")
      .then((response) => response.json())
      .then((user) => {
        setUser(user);
        setFoundUser(true);

        // Set up the push notifs
        var pusher = new Pusher("ed72954a8d404950e3c8", {
          cluster: "us2",
          forceTLS: true,
        });
        var channel = pusher.subscribe(user._id);
        channel.bind("direct-match", function (data) {
          fetchRequests(volunteer_status.PENDING, setPendingRequests);
          addToast("You have a new pending request!", {
            appearance: "info",
            autoDismiss: true,
          });
        });

        // Fetch requests
        fetchRequests(volunteer_status.PENDING, setPendingRequests);
        fetchRequests(volunteer_status.IN_PROGRESS, setAcceptedRequests);
        fetchRequests(volunteer_status.COMPLETE, setCompletedRequests, true);

        // Featch beacons
        fetchBeacons();
      })
      .catch((error) => {
        setLoginError(true);
      });
  };

  const prepend = (element, array = []) =>
    !element ? [] : Array.of(element, ...array);

  // State change (Pending -> In Progress)
  const moveRequestFromPendingToInProgress = (request) => {
    setPendingRequests(
      pendingRequests.filter(
        (pendingRequest) => pendingRequest._id !== request._id
      )
    );
    setAcceptedRequests(acceptedRequests.concat(request));
  };

  // State change (Pending -> Reject (Disappear))
  const rejectAPendingRequest = (request) => {
    setPendingRequests(
      pendingRequests.filter(
        (pendingRequest) => pendingRequest._id !== request._id
      )
    );
    setAcceptedRequests(
      acceptedRequests.filter(
        (acceptedRequest) => acceptedRequest._id !== request._id
      )
    );
  };

  // State change (Accepted -> Complete)
  const completeAnInProgressRequest = (request) => {
    request.status.completed_date = Date.now();
    setAcceptedRequests(
      acceptedRequests.filter(
        (acceptedRequest) => acceptedRequest._id !== request._id
      )
    );
    setCompletedRequests(prepend(request, completedRequests));
    setTabNum(3);
  };

  useEffect(() => {
    // Fetch user and all requests/beacons
    fetchUser();
  }, []);

  const mainContentView = () => {
    if (view === "request-dashboard") {
      return (
        <Container id="volunteer-info" style={{ marginTop: 50 }}>
          <h1
            id="home-heading"
            style={{ marginTop: 0, fontSize: 24, color: "#4F4F4F" }}
          >
            Request Dashboard
          </h1>
          <p id="regular-text" style={{ fontSize: 16 }}>
            Respond to requests that have been delegated to you
          </p>
          <p id="requestCall" style={{ marginTop: 15, marginBottom: 34 }}></p>
          <RequestDashboard
            pendingRequests={pendingRequests}
            acceptedRequests={acceptedRequests}
            completedRequests={completedRequests}
            user={user}
            moveRequestFromPendingToInProgress={
              moveRequestFromPendingToInProgress
            }
            rejectAPendingRequest={rejectAPendingRequest}
            completeAnInProgressRequest={completeAnInProgressRequest}
          />
        </Container>
      );
    } else if (view === "your-offer") {
      return (
        <Container id="volunteer-info" style={{ marginTop: 50 }}>
          <h1
            id="home-heading"
            style={{ marginTop: 0, fontSize: 24, color: "#4F4F4F" }}
          >
            Your Offer
          </h1>
          <p id="regular-text" style={{ fontSize: 16 }}>
            Customize your volunteer experience
          </p>
          <p id="requestCall" style={{ marginTop: 15, marginBottom: 10 }}></p>
        </Container>
      );
    } else {
      return <></>;
    }
  };

  if (foundUser) {
    return (
      <>
        <div className="App">
          <NavBar
            setLanguage={props.setLanguage}
            language={"en"}
            isLoggedIn={true}
            mode={"volunteer"}
            first_name={user.first_name}
            last_name={user.last_name}
            setView={setView}
            pageLoaded={true}
            isLoggedIn={true}
          />
          <Jumbotron fluid id="jumbo-volunteer">
            <ProfileHeader
              user={user}
              setShowAccountModal={setShowAccountModal}
            />
          </Jumbotron>
          {mainContentView()}

          {/* <Container id="volunteer-info" style={{ marginTop: 50 }}>
            <Row className="justify-content-md-center">
              <Col lg={1}></Col>
              <Col lg={6} md={10} sm={12} style={{ marginTop: -20 }}>
                <Container style={{ padding: 0, marginLeft: 0 }}>
                  <Button
                    id={tabNum === 1 ? "tab-button-selected" : "tab-button"}
                    onClick={() => {
                      setTabNum(1);
                    }}
                  >
                    Your Offer
                  </Button>
                  <Button
                    id={tabNum === 2 ? "tab-button-selected" : "tab-button"}
                    onClick={() => {
                      setTabNum(2);
                    }}
                  >
                    Pending ({pendingRequests.length}) / Active (
                    {acceptedRequests.length})
                  </Button>
                  <Button
                    id={tabNum === 3 ? "tab-button-selected" : "tab-button"}
                    onClick={() => {
                      setTabNum(3);
                    }}
                  >
                    Completed ({completedRequests.length})
                  </Button>
                </Container>
                <Container
                  id="newOfferContainer"
                  style={
                    tabNum === 1 ? { display: "block" } : { display: "none" }
                  }
                >
                  {foundUser ? (
                    <YourOffer
                      user={user}
                      setLanguage={props.setLanguage}
                      language={props.language}
                    />
                  ) : (
                    <></>
                  )}
                </Container>
                <Container
                  id="newOfferContainer"
                  style={
                    tabNum === 2 ? { display: "block" } : { display: "none" }
                  }
                >
                  <CurrentVolunteerRequests
                    user={user}
                    pendingRequests={pendingRequests}
                    acceptedRequests={acceptedRequests}
                    moveRequestFromPendingToInProgress={
                      moveRequestFromPendingToInProgress
                    }
                    rejectAPendingRequest={rejectAPendingRequest}
                    completeAnInProgressRequest={completeAnInProgressRequest}
                  />
                </Container>
                <Container
                  id="newOfferContainer"
                  style={
                    tabNum === 3 ? { display: "block" } : { display: "none" }
                  }
                >
                  <CompletedVolunteerRequests
                    user={user}
                    completedRequests={completedRequests}
                  />
                </Container>
              </Col>
              <Col lg={4} md={10} sm={12} style={{ marginTop: 0 }}>
                <h5
                  id="volunteer-offer-status"
                  style={{ fontSize: 24, fontWeight: "bold", color: "black" }}
                >
                  Organization Beacons
                </h5>
                <Container
                  id="newOfferContainer"
                  style={{ display: "block", marginTop: 10 }}
                >
                  <VolunteerBeacons
                    beacons={beacons}
                    volunteer={user}
                    fetchBeacons={fetchBeacons}
                  />
                </Container>
              </Col>
              <Col lg={1}></Col>
            </Row>
          </Container> */}
        </div>
        <Footer />
        <AccountInfo
          user={user}
          showAccountModal={showAccountModal}
          setShowAccountModal={setShowAccountModal}
        />
      </>
    );
  } else if (loginError) {
    return <VolunteerLogin />;
  } else {
    return <></>;
  }
}

VolunteerPortal.propTypes = {
  language: PropTypes.string,
  setLanguage: PropTypes.func,
};
