import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequestCard from "./RequestCard";
import { volunteer_status } from "../constants";

export default function RequestColumn(props) {
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  useEffect(() => {
    switch (props.requestStatus) {
      case volunteer_status.PENDING:
        setTitle("Requires Action (" + props.requests.length + ")");
        setColor("#EB5757");
        setLoaded(true);
        break;
      case volunteer_status.IN_PROGRESS:
        setTitle("In Progress (" + props.requests.length + ")");
        setColor("#DB9327");
        setLoaded(true);
        break;
      case volunteer_status.COMPLETE:
        setTitle("Completed (" + props.requests.length + ")");
        setColor("#3ABD24");
        setLoaded(true);
        break;
      default:
        break;
    }
  }, [props.requests, props.requestStatus]);

  if (!loaded) {
    return <></>;
  }

  const requestCards = () => {
    if (props.requests.length > 0) {
      return props.requests.map((request, i) => {
        return (
          <RequestCard
            request={request}
            requestStatus={props.requestStatus}
            color={color}
            user={props.user}
            moveRequestFromPendingToInProgress={
              props.moveRequestFromPendingToInProgress
            }
            rejectAPendingRequest={props.rejectAPendingRequest}
            completeAnInProgressRequest={props.completeAnInProgressRequest}
          />
        );
      });
    } else {
      return <RequestCard empty={true} requestStatus={props.requestStatus} />;
    }
  };

  return (
    <>
      <p
        id="regular-text"
        style={{ fontSize: 16, color: "#4F4F4F", fontWeight: 600 }}
      >
        {title}
      </p>
      <p id="requestCall" style={{ marginTop: 15, marginBottom: 0 }}></p>
      <div style={{ overflowY: "scroll", height: 350 }}>{requestCards()}</div>
    </>
  );
}
