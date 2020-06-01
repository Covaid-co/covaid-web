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
import { useWindowDimensions } from "./libs/hooksLib";

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
  const { height, width } = useWindowDimensions();
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
        <Container
          id="volunteer-main-content"
          style={{
            marginTop: 50,
            marginRight: 16,
            marginBottom: width < 980 ? 30 : 0,
          }}
        >
          <h1
            id="home-heading"
            style={{
              marginTop: 0,
              fontSize: 24,
              color: "#4F4F4F",
            }}
          >
            Request Dashboard
          </h1>
          <p id="regular-text" style={{ fontSize: 16, marginBottom: 20 }}>
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
        <Container
          id="volunteer-main-content"
          style={{
            marginTop: 50,
            marginRight: 16,
            marginBottom: width < 980 ? 30 : 0,
          }}
        >
          <h1
            id="home-heading"
            style={{ marginTop: 0, fontSize: 24, color: "#4F4F4F" }}
          >
            Your Offer
          </h1>
          <p id="regular-text" style={{ fontSize: 16, marginBottom: 20 }}>
            Customize your volunteer experience
          </p>
          <p id="requestCall" style={{ marginTop: 15, marginBottom: 29 }}></p>
          <Container
            style={{
              marginLeft: 0,
              paddingLeft: 0,
              marginRight: 180,
              paddingRight: 0,
            }}
          >
            {foundUser ? (
              <YourOffer
                user={user}
                setUser={setUser}
                setLanguage={props.setLanguage}
                language={props.language}
              />
            ) : (
              <></>
            )}
          </Container>
        </Container>
      );
    } else {
      return <></>;
    }
  };

  if (foundUser) {
    return (
      <>
        <div className="App" style={{ marginBottom: 30 }}>
          <div></div>
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
          <div class="flex-container">
            <div style={{ width: width < 980 ? "100%" : "75%", float: "left" }}>
              <Jumbotron fluid id="jumbo-volunteer" style={{ paddingTop: 50 }}>
                <ProfileHeader
                  user={user}
                  setShowAccountModal={setShowAccountModal}
                />
              </Jumbotron>
              {mainContentView()}
            </div>
            <span
              style={{ display: width < 980 ? "none" : "inline" }}
              id="vertical-line"
            ></span>
            <div
              style={{
                width: width < 980 ? "100%" : "23%",
                float: "left",
                height: "100%",
              }}
            >
              <Container>
                <h1
                  id="home-heading"
                  style={{ marginTop: 0, fontSize: 24, color: "#4F4F4F" }}
                >
                  Important Information
                </h1>
                <p id="regular-text" style={{ fontSize: 16 }}>
                  Messages from your organization, Covaid updates, and
                  miscellaneous resources
                </p>
                <p
                  id="requestCall"
                  style={{ marginTop: 30, marginBottom: 10 }}
                ></p>
                <VolunteerBeacons
                  beacons={beacons}
                  volunteer={user}
                  fetchBeacons={fetchBeacons}
                />
              </Container>
            </div>
          </div>
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
    return (
      <VolunteerLogin
        setLanguage={props.setLanguage}
        language={props.language}
      />
    );
  } else {
    return <></>;
  }
}

VolunteerPortal.propTypes = {
  language: PropTypes.string,
  setLanguage: PropTypes.func,
};
