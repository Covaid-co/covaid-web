import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import RequestColumn from "./RequestColumn";
import { volunteer_status } from "../constants";
import { useWindowDimensions } from "../libs/hooksLib";

export default function RequestDashboard(props) {
  const { height, width } = useWindowDimensions();
  const [tab, setTab] = useState(0);

  useEffect(() => {}, [props.user]);

  const selectedTab = (currTab) => {
    if (tab === currTab) {
      return "tab-name-active-requests";
    } else {
      return "tab-name-inactive-requests";
    }
  };

  const displayTab = (currTab) => {
    if (tab === currTab) {
      return { display: "block" };
    } else {
      return { display: "none" };
    }
  };

  if (width < 980) {
    return (
      <>
        <p
          id={selectedTab(0)}
          onClick={() => {
            setTab(0);
          }}
        >
          New
        </p>
        <p
          id={selectedTab(1)}
          onClick={() => {
            setTab(1);
          }}
        >
          Active
        </p>
        <p
          id={selectedTab(2)}
          onClick={() => {
            setTab(2);
          }}
        >
          Complete
        </p>
        <Container id="requester-tab" style={displayTab(0)}>
          <RequestColumn
            requests={props.pendingRequests}
            notitle={true}
            requestStatus={volunteer_status.PENDING}
            user={props.user}
            moveRequestFromPendingToInProgress={
              props.moveRequestFromPendingToInProgress
            }
            rejectAPendingRequest={props.rejectAPendingRequest}
            completeAnInProgressRequest={props.completeAnInProgressRequest}
          />
        </Container>
        <Container id="requester-tab" style={displayTab(1)}>
          <RequestColumn
            requests={props.acceptedRequests}
            notitle={true}
            requestStatus={volunteer_status.IN_PROGRESS}
            user={props.user}
            moveRequestFromPendingToInProgress={
              props.moveRequestFromPendingToInProgress
            }
            rejectAPendingRequest={props.rejectAPendingRequest}
            completeAnInProgressRequest={props.completeAnInProgressRequest}
          />
        </Container>
        <Container id="requester-tab" style={displayTab(2)}>
          <RequestColumn
            requests={props.completedRequests}
            notitle={true}
            requestStatus={volunteer_status.COMPLETE}
            user={props.user}
          />
        </Container>
      </>
    );
  }
  return (
    <Row>
      <Col style={{ paddingRight: 35 }}>
        <RequestColumn
          requests={props.pendingRequests}
          requestStatus={volunteer_status.PENDING}
          user={props.user}
          moveRequestFromPendingToInProgress={
            props.moveRequestFromPendingToInProgress
          }
          rejectAPendingRequest={props.rejectAPendingRequest}
          completeAnInProgressRequest={props.completeAnInProgressRequest}
        />
      </Col>
      <Col style={{ paddingRight: 35 }}>
        <RequestColumn
          requests={props.acceptedRequests}
          requestStatus={volunteer_status.IN_PROGRESS}
          user={props.user}
          moveRequestFromPendingToInProgress={
            props.moveRequestFromPendingToInProgress
          }
          rejectAPendingRequest={props.rejectAPendingRequest}
          completeAnInProgressRequest={props.completeAnInProgressRequest}
        />
      </Col>
      <Col>
        <RequestColumn
          requests={props.completedRequests}
          requestStatus={volunteer_status.COMPLETE}
          user={props.user}
        />
      </Col>
    </Row>
  );
}
