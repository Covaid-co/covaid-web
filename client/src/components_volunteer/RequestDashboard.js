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
  if (width < 280) {
    return (
      <>
        <div
          style={{
            alignContent: "center",
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div>
            <p
              id={selectedTab(0)}
              onClick={() => {
                setTab(0);
              }}
              style={{ paddingBottom: 2 }}
            >
              New
            </p>
          </div>
          <div>
            <p
              id={selectedTab(1)}
              onClick={() => {
                setTab(1);
              }}
              style={{ paddingBottom: 2 }}
            >
              Active
            </p>
          </div>
          <div>
            <p
              id={selectedTab(2)}
              onClick={() => {
                setTab(2);
              }}
              style={{ paddingBottom: 2 }}
            >
              Complete
            </p>
          </div>
        </div>

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
  } else if (width < 412) {
    return (
      <>
        <Row
          style={{
            paddingLeft: width > 328 ? 20 : 10,
            marginLeft: 0,
          }}
        >
          <p
            id={selectedTab(0)}
            onClick={() => {
              setTab(0);
            }}
            style={{
              marginRight: width > 342 ? 4 : 0,
              paddingBottom: 8,
              width: 75,
            }}
          >
            New
          </p>
          <p
            id={selectedTab(1)}
            onClick={() => {
              setTab(1);
            }}
            style={{
              marginRight: width > 342 ? 4 : 0,
              marginLeft: width > 342 ? 4 : 0,
              paddingBottom: 8,
              width: width < 302 && 75,
            }}
          >
            Active
          </p>
          <p
            id={selectedTab(2)}
            onClick={() => {
              setTab(2);
            }}
            style={{
              paddingBottom: 8,
              marginLeft: width > 342 ? 4 : 0,
              width: width < 302 && 90,
            }}
          >
            Complete
          </p>
        </Row>
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
  } else if (width < 767) {
    return (
      <>
        <Row
          style={{
            paddingLeft: 20,
          }}
        >
          <p
            id={selectedTab(0)}
            onClick={() => {
              setTab(0);
            }}
            style={{
              marginRight:
                width > 876
                  ? 96
                  : width > 802
                  ? 88
                  : width > 767
                  ? 64
                  : width > 676
                  ? 92
                  : width > 576
                  ? 48
                  : width > 492
                  ? 32
                  : width > 460
                  ? 24
                  : 8,
              marginLeft: 4,
              paddingBottom: 8,
            }}
          >
            New
          </p>
          <p
            id={selectedTab(1)}
            onClick={() => {
              setTab(1);
            }}
            style={{
              marginRight:
                width > 876
                  ? 96
                  : width > 802
                  ? 88
                  : width > 767
                  ? 64
                  : width > 676
                  ? 92
                  : width > 576
                  ? 48
                  : width > 492
                  ? 32
                  : width > 460
                  ? 24
                  : 8,
              marginLeft:
                width > 876
                  ? 48
                  : width > 802
                  ? 36
                  : width > 767
                  ? 24
                  : width > 676
                  ? 42
                  : width > 576
                  ? 16
                  : width > 460
                  ? 8
                  : 0,
              paddingBottom: 8,
            }}
          >
            Active
          </p>
          <p
            id={selectedTab(2)}
            onClick={() => {
              setTab(2);
            }}
            style={{
              paddingBottom: 8,
              marginLeft:
                width > 876
                  ? 48
                  : width > 802
                  ? 36
                  : width > 767
                  ? 24
                  : width > 676
                  ? 42
                  : width > 576
                  ? 16
                  : width > 460
                  ? 8
                  : 0,
            }}
          >
            Complete
          </p>
        </Row>
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
      <Col style={{ paddingRight: width <= 1060 ? 0 : 35 }}>
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
      <Col style={{ paddingRight: width <= 1060 ? 0 : 35 }}>
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
