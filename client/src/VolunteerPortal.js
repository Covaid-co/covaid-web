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
import { currURL } from "../src/constants";

export default function VolunteerPortal(props) {
  document.title = "Covaid | Volunteer";
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
  // const [toggle, setToggle] = useState(false);
  const { height, width } = useWindowDimensions();
  const { addToast } = useToasts();
  const [isCollapsed, setCollapsed] = useState(true);

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
    if (window.location.href.includes("#offer")) {
      setView("your-offer");
    } else if (window.location.href.includes("#requests")) {
      setView("request-dashboard");
    }
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
            paddingLeft: width < 386 ? 0 : "auto",
            paddingRight: width < 386 ? 0 : "auto",
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
            Requests
          </h1>
          <p
            id="regular-text"
            style={{ marginLeft: 1, fontSize: 16, marginBottom: 20 }}
          >
            Respond to requests that have been delegated to you
          </p>
          <p
            id="requestCall"
            style={{ marginTop: 15, marginBottom: 29, marginRight: -16 }}
          ></p>

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
          <p
            id="regular-text"
            style={{ marginLeft: 1, fontSize: 16, marginBottom: 20 }}
          >
            Customize your volunteer experience
          </p>
          <p
            id="requestCall"
            style={{ marginTop: 15, marginBottom: 29, marginRight: -16 }}
          ></p>
          <Container
            className={width > 767 ? `your-offer-web` : `your-offer-small`}
            style={{
              marginLeft: 0,
              paddingLeft: 0,
              paddingRight: 0,
              marginRight: 0,
              maxWidth: "none !important",
              width: "100%",
              // marginRight: width > 767 ? "auto" : 0,
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
          <NavBar
            setLanguage={props.setLanguage}
            // setToggle={setToggle}
            // simplified={true}
            volunteerPortal={true}
            language={"en"}
            isLoggedIn={true}
            mode={"volunteer"}
            first_name={user.first_name}
            last_name={user.last_name}
            setView={setView}
            pageLoaded={true}
          />
          {width >= 576 && (
            <p id="requestCall" style={{ marginTop: -8, marginBottom: 0 }}></p>
          )}
          <div class="flex-container">
            <div style={{ width: "95%", float: "left" }}>
              <Jumbotron
                fluid
                id="jumbo-volunteer"
                style={{
                  marginLeft: 35,
                  paddingTop: 32,
                  paddingBottom: 32,
                  marginBottom: 16,
                }}
              >
                <ProfileHeader
                  user={user}
                  setShowAccountModal={setShowAccountModal}
                />
              </Jumbotron>
              {mainContentView()}
            </div>
            {/* {width > 767 ? (
              <>
                <span
                  style={{
                    height: "95vh",
                    display: "inline",
                  }}
                  id="vertical-line"
                ></span>
                <div
                  style={{
                    width: "23%",
                    float: "left",
                    height: "100%",
                  }}
                >
                  <Container>
                    <h1
                      id="home-heading"
                      style={{
                        marginTop: 44,
                        marginBottom: 14,
                        fontSize: 24,
                        color: "#4F4F4F",
                      }}
                    >
                      Important Information
                    </h1>
                    <p id="regular-text" style={{ fontSize: 16 }}>
                      Covaid updates, curated resources, and messages from your
                      organization.
                    </p>
                    <p
                      id="requestCall"
                      style={{ marginTop: 20, marginBottom: 10 }}
                    ></p>
                    <VolunteerBeacons
                      beacons={beacons}
                      volunteer={user}
                      fetchBeacons={fetchBeacons}
                    />
                  </Container>
                </div>
              </>
            ) : (
              <> */}
            <div
              className={isCollapsed ? "triangle" : "triangle_expand"}
              style={{
                marginRight:
                  !isCollapsed &&
                  (width > 767 ? "30%" : width > 448 ? "60%" : "90%"),
              }}
              onClick={() => {
                setCollapsed(!isCollapsed);
              }}
            >
              <p className="pullouttext">Notifications</p>
            </div>
            <div
              className={isCollapsed ? "info_sidebar" : "info_expand"}
              style={{
                width:
                  !isCollapsed &&
                  (width > 767 ? "30%" : width > 448 ? "60%" : "90%"),
              }} // onClick={() => {
              //   setCollapsed(!isCollapsed);
              // }}
            >
              {!isCollapsed && (
                <Container>
                  <h1
                    id="home-heading"
                    style={{
                      marginTop: 80,
                      marginBottom: 14,
                      fontSize: 24,
                      color: "rgb(79, 79, 79)",
                    }}
                  >
                    Important Information
                  </h1>
                  <p id="regular-text" style={{ fontSize: 16 }}>
                    Covaid updates, curated resources, and messages from your
                    organization.
                  </p>
                  <p
                    id="requestCall"
                    style={{ marginTop: 20, marginBottom: 10 }}
                  ></p>
                  <VolunteerBeacons
                    beacons={beacons}
                    volunteer={user}
                    fetchBeacons={fetchBeacons}
                  />
                </Container>
              )}
            </div>
            {/* </>
            )} */}
          </div>
        </div>
        <Footer style={{ marginTop: -20, paddingTop: 0, paddingBottom: 0 }} />
        <AccountInfo
          user={user}
          language={props.language}
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
