import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import NavBar from "../components/NavBar";
import BeaconCreation from "./BeaconCreation";
import OrganizationBeacons from "./OrganizationBeacons";

import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";

const BeaconStatusEnum = { active: 1, inactive: 2, complete: 3, delete: 4 };

export default function LiveBeaconView(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeBeacons, setActiveBeacons] = useState([]);
  const [inactiveBeacons, setInactiveBeacons] = useState([]);
  const [completedBeacons, setCompletedBeacons] = useState([]);
  const [currTabNumber, setCurrTab] = useState(1);
  const [beaconModal, setBeaconModal] = useState(false);

  const displayTab = (tabNumber) => {
    if (tabNumber === currTabNumber) {
      return { display: "block", paddingLeft: 15, paddingTop: 15 };
    } else {
      return { display: "none", paddingLeft: 15, paddingTop: 15 };
    }
  };
  const tabID = (tabNumber) => {
    return tabNumber === currTabNumber ? "tab-button-selected" : "tab-button";
  };

  useEffect(() => {
    setIsLoaded(true);
    setActiveBeacons(
      props.beacons.filter(function (beacon) {
        return beacon.beaconStatus === 1;
      })
    );
    setInactiveBeacons(
      props.beacons.filter(function (beacon) {
        return beacon.beaconStatus === 2;
      })
    );
    setCompletedBeacons(
      props.beacons.filter(function (beacon) {
        return beacon.beaconStatus === 3;
      })
    );
  }, [props.volunteers, props.association, props.beacons]);

  if (!isLoaded) {
    return <></>;
  }

  const createBeacon = (beacon) => {
    setActiveBeacons(activeBeacons.concat(beacon));
  };

  const move = (beacon, from, to) => {
    const beaconStates = {
      1: [setActiveBeacons, activeBeacons],
      2: [setInactiveBeacons, inactiveBeacons],
      3: [setCompletedBeacons, completedBeacons],
    };

    var beaconStartingStateSetter = beaconStates[from][0];
    var beaconStartingState = beaconStates[from][1];
    var beaconEndingStateSetter = beaconStates[to][0];
    var beaconEndingState = beaconStates[to][1];

    beaconStartingStateSetter(
      beaconStartingState.filter((currBeacon) => currBeacon._id !== beacon._id)
    );
    beaconEndingStateSetter(beaconEndingState.concat(beacon));
    setCurrTab(to);
  };

  return (
    <>
      <Jumbotron
        fluid
        id="jumbo-volunteer"
        style={{ paddingBottom: 50, paddingTop: 60 }}
      >
        <Container style={{ maxWidth: 1500 }}>
          <Row>
            <Col style={{ marginTop: 165 }}>
              <h1 id="home-heading" style={{ marginTop: 0 }}>
                Your Live Beacons
              </h1>
              <p id="regular-text" style={{ fontSize: 20, marginBottom: 40 }}>
                Beacons are your organization's way of sending mass
                notifications to your volunteers
              </p>
              <Button
                id="medium-button-solid"
                onClick={() => {
                  setBeaconModal(true);
                }}
              >
                Create Beacon
              </Button>
              <br />
              <Button
                variant="link"
                id="resources-link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  window.location.reload(false);
                }}
              >
                Return to dashboard
              </Button>
            </Col>
            <Col lg={1}></Col>
            <Col lg={6} md={12} sm={12} style={{ marginTop: 30 }}>
              <Container style={{ padding: 0, marginLeft: 0 }}>
                <Button
                  id={tabID(1)}
                  onClick={() => {
                    setCurrTab(1);
                  }}
                >
                  Active
                </Button>
                <Button
                  id={tabID(2)}
                  onClick={() => {
                    setCurrTab(2);
                  }}
                >
                  Drafts
                </Button>
                <Button
                  id={tabID(3)}
                  onClick={() => {
                    setCurrTab(3);
                  }}
                >
                  Complete
                </Button>
              </Container>
              <Container id="newOfferContainer" style={displayTab(1)}>
                <OrganizationBeacons
                  beacons={activeBeacons}
                  association={props.association}
                  type={BeaconStatusEnum.active}
                  move={move}
                />
              </Container>
              <Container id="newOfferContainer" style={displayTab(2)}>
                <OrganizationBeacons
                  beacons={inactiveBeacons}
                  association={props.association}
                  type={BeaconStatusEnum.inactive}
                  move={move}
                />
              </Container>
              <Container id="newOfferContainer" style={displayTab(3)}>
                <OrganizationBeacons
                  beacons={completedBeacons}
                  association={props.association}
                  type={BeaconStatusEnum.complete}
                  move={move}
                />
              </Container>
            </Col>
          </Row>
        </Container>
      </Jumbotron>

      <BeaconCreation
        beaconModal={beaconModal}
        setBeaconModal={setBeaconModal}
        association={props.association}
        volunteers={props.volunteers}
        pushBeacon={createBeacon}
      />
    </>
  );
}
