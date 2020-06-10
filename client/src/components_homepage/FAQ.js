import React, { useState } from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

/**
 * About us/contributors page
 */

export default function FAQ(props) {
  const [tab, setTab] = useState(0);
  document.title = "Covaid | FAQ";

  const displayTab = (currTab) => {
    if (tab === currTab) {
      return { display: "block" };
    } else {
      return { display: "none" };
    }
  };

  const selectedTab = (currTab) => {
    if (tab === currTab) {
      return "tab-name-active";
    } else {
      return "tab-name-inactive";
    }
  };

  return (
    <div className="App">
      <NavBar
        setLanguage={props.setLanguage}
        language={props.language}
        isLoggedIn={props.isLoggedIn}
        first_name={
          Object.keys(props.currentUser).length !== 0
            ? props.currentUser.first_name
            : ""
        }
      />
      <Container style={{ maxWidth: 2500 }}>
        <Row>
          <Col md={5} id="login-container" style={{ paddingRight: 75 }}>
            <h1 id="home-heading">Frequently Asked Questions</h1>
            <p id="regular-text">
              Covaid is a nationwide mutual aid platform founded to provide
              volunteer support during the COVID-19 outbreak. We strive to be a
              resource primarily for those who are most impacted by the
              pandemic, such as the elderly and immunocompromised.
            </p>
            <p id="regular-text">
              <strong>Any questions?</strong> Just email us at
              covaidco@gmail.com
            </p>
          </Col>
          <Col
            md={7}
            id="login-container"
            style={{ marginTop: 30, paddingRight: 50 }}
          >
            <Row>
              <Container style={{ padding: 0, marginLeft: 0, width: "100%" }}>
                {/* <Button
                  id={requester ? "tab-button-selected" : "tab-button"}
                  onClick={() => setRequester(true)}
                >
                  Requester
                </Button>
                <Button
                  id={!requester ? "tab-button-selected" : "tab-button"}
                  onClick={() => setRequester(false)}
                >
                  Volunteer
                </Button> */}
                <p id={selectedTab(0)} onClick={() => setTab(0)}>
                  Requester
                </p>
                <p id={selectedTab(1)} onClick={() => setTab(1)}>
                  Volunteer
                </p>
                <p id={selectedTab(2)} onClick={() => setTab(2)}>
                  Organization
                </p>
                <p id="requestCall" style={{ marginTop: -25, marginBottom: 5 }}>
                  &nbsp;
                </p>
              </Container>
              <Container id="requester-tab" style={displayTab(0)}>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 20 }}>
                  How can I get help?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Our purpose is to help with essential day-to-day tasks such as
                  grocery delivery, medication pick-up, and more. Please consult
                  your local Community Bulletin to see how volunteers in your
                  area are able to help.
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  Where is Covaid active?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Our platform is active nationwide; however, we are only able
                  best match your request if you are in an area where there are
                  volunteers.
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  What if there are no volunteers in my area?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  If your Community Bulletin does not show any volunteers, or if
                  none of the volunteers listed in your area match your needs,
                  we would be happy to suggest local resources instead. If
                  interested, please email covaidco@gmail.com with your name,
                  zip code, and how we can help (finding financial assistance,
                  donated food, etc.).
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  Is Covaid free to use?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Yes! However, while delivery is free, you must pay for the
                  items the volunteer delivers. If you are in need of donated
                  food/supplies, please contact us at covaidco@gmail.com and we
                  will do our best to find donations in your area.
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  Can you help cover the cost of food/supplies that are
                  delivered?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Unfortunately, Covaid is currently unable to cover the cost of
                  food or supplies; we are simply built to help with delivery so
                  those at risk for complications from COVID-19 can remain at
                  home. If you are in need of donated food/supplies, please
                  contact us at covaidco@gmail.com and we will do our best to
                  find local food banks and other resources.
                </p>
              </Container>

              <Container id="requester-tab" style={displayTab(1)}>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 20 }}>
                  How do I sign up to volunteer?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0, marginLeft: 14 }}>
                  1. From the homepage, click Volunteer Registration.
                  <br />
                  2. Complete all three pages of information. Please be as
                  specific as possible when describing how you can help your
                  community! Once you’re done, click Sign Up.
                  <br />
                  3. You now have a volunteer account. When signed in, you can
                  edit your offer from the Your Offer tab. If you no longer wish
                  to be listed as an active volunteer, you can remove yourself
                  from the Community Bulletin with the toggle switch. <br />
                  4. That’s it! Whenever someone needs your help, you’ll receive
                  an email, text, or call from us.
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  Where is Covaid active?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Our platform is active nationwide, but our ability to serve
                  people in a certain area is entirely dependent on the presence
                  of volunteers. If we’re low on volunteers in your area, please
                  consider signing up and encouraging your friends to join as
                  well!
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  What tasks can volunteers help with?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Most volunteers choose to help with grocery shopping,
                  medication pick-up, or similar daily chores. However,
                  volunteers are encouraged to list other tasks they may be able
                  to help with as well, such as online tutoring for children
                  learning from home, navigation of social services during the
                  pandemic, and more.
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  How does payment work?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Requesters can either call the store ahead of time to pre-pay
                  for the items (recommended), or the volunteer can pay for the
                  items and be reimbursed by the requester at the time of
                  delivery. Please note that it is entirely up to the volunteer
                  and requester to decide on a payment plan prior to the
                  volunteer making a purchase, as Covaid cannot be held liable
                  for financial loss.
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  I’m a mutual aid organizer. Can I partner with you?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  We’re always looking to partner with other mutual aid groups!
                  Please reach out to us at covaidco@gmail.com.
                </p>
              </Container>

              <Container id="requester-tab" style={displayTab(2)}>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 20 }}>
                  How can Covaid help my organization?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0, marginLeft: 14 }}>
                  We are proud to offer the Covaid platform to mutual aid
                  organizers around the United States. Whether you have an
                  existing mutual aid group or would like to start one, Covaid’s
                  administrative dashboard has custom-built features designed to
                  help you facilitate grassroots volunteer efforts in your
                  community.
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  Why is Covaid better than spreadsheets?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Covaid is built from scratch to facilitate mutual aid work.
                  The platform has the following key features:
                  <ul>
                    <li>
                      Intuitive admin dashboards that let organizers track the
                      status of requests
                    </li>
                    <li>
                      Automated email notifications for volunteers and admins
                    </li>
                    <li>
                      Smart matching between volunteers and requesters,
                      optimized for task and geographic distance
                    </li>
                    <li>
                      Custom portal for volunteers to modify their offer and
                      view/accept new requests
                    </li>
                  </ul>
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  Is the Covaid platform free to use?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>Yes!</p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  Is Covaid secure/how are you protecting people’s information?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  All data is stored securely in our database for only each
                  organization to see. Volunteer personal information is not
                  visible publicly to anyone.
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  Does Covaid have to replace my organization’s current
                  platform/workflow?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  No. Covaid can be a standalone platform for facilitating
                  mutual aid, but it can also be used to supplement your
                  existing spreadsheets and communication tools. All volunteer
                  and requester information gathered through Covaid can be
                  exported into spreadsheets.
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  If there’s no mutual aid group in my area, can I use Covaid to
                  start one?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Absolutely! Our platform is open to new or existing
                  organizations. If you’re new to the world of mutual aid, we’re
                  happy to help you get started!
                </p>
                <h5 id="header" style={{ marginBottom: 3, marginTop: 18 }}>
                  I’m interested in partnering with you. What are the next
                  steps?
                </h5>
                <p style={{ fontSize: 14, marginTop: 0 }}>
                  Email us at covaidco@gmail.com! We’ll set up a meeting to get
                  to know you, show you how the platform works, and answer any
                  questions you may have.
                </p>
              </Container>
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer key="2" />
    </div>
  );
}

FAQ.propTypes = {
  setLanguage: PropTypes.func,
  language: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  currentUser: PropTypes.object,
};
