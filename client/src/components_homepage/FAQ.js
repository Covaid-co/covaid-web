import React, { useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

/**
 * About us/contributors page
 */

export default function FAQ() {
  const [requester, setRequester] = useState(true);

  return (
    <div className="App">
      <NavBar isLoggedIn={false} pageLoaded={true} />
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
                <p
                  id={requester ? "tab-name-active" : "tab-name-inactive"}
                  onClick={() => setRequester(true)}
                >
                  Requester
                </p>
                <p
                  id={!requester ? "tab-name-active" : "tab-name-inactive"}
                  onClick={() => setRequester(false)}
                >
                  Volunteer
                </p>
                <p id="requestCall" style={{ marginTop: -25, marginBottom: 5 }}>
                  &nbsp;
                </p>
              </Container>
              <Container
                id="requester-tab"
                style={requester ? { display: "block" } : { display: "none" }}
              >
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

              <Container
                id="requester-tab"
                style={requester ? { display: "none" } : { display: "block" }}
              >
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
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer key="2" />
    </div>
  );
}
