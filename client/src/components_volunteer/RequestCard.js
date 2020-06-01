import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import RequestInfo from "./RequestInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faClock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { volunteer_status, defaultResources } from "../constants";

export default function RequestCard(props) {
  const [loaded, setLoaded] = useState(false);
  const [modalMode, setModalMode] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currRequest, setCurrRequest] = useState({});
  const [volunteerSpecificInfo, setVolunteerSpecificInfo] = useState({});
  useEffect(() => {
    setLoaded(true);
  }, [props.request]);

  // Callback to change VolunteerPortal state (Pending -> In Progress)
  const acceptRequest = () => {
    props.moveRequestFromPendingToInProgress(currRequest);
  };

  // Callback to change VolunteerPortal state (Reject (Disappear))
  const rejectRequest = () => {
    props.rejectAPendingRequest(currRequest);
  };

  // Callback to change VolunteerPortal state (In Progress -> Complete)
  const completeARequest = () => {
    props.completeAnInProgressRequest(currRequest);
  };

  const helpNeeded = () => {
    let volunteers_needed = props.request.status.volunteer_quota;
    var matchedVolunteers = 0;
    props.request.status.volunteers.forEach((volunteer_status_obj) => {
      if (volunteer_status_obj.volunteer !== props.user._id) {
        if (
          parseInt(volunteer_status_obj.current_status) ===
            volunteer_status.IN_PROGRESS ||
          parseInt(volunteer_status_obj.current_status) ===
            volunteer_status.COMPLETE
        ) {
          matchedVolunteers += 1;
        }
      }
    });
    return matchedVolunteers < volunteers_needed;
  };

  if (!loaded) {
    return <></>;
  }
  if (props.empty) {
    return (
      <div
        style={{
          height: "90px",
          border: "1px dashed #CECECE",
          boxSizing: "border-box",
          borderRadius: "0px 0px 6px 6px",
          marginBottom: 16,
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <p
          id="regular-text"
          style={{
            fontSize: 16,
            color: "#CECECE",
            fontWeight: 600,
            textAlign: "center",
            paddingTop: "30px",
            paddingBottom: "30px",
          }}
        >
          No requests
        </p>
      </div>
    );
  }
  function getFormattedDate(date) {
    var month = (1 + date.getMonth()).toString();
    var day = date.getDate().toString();
    return month + "/" + day;
  }
  const name = () => {
    if (props.requestStatus === volunteer_status.PENDING) {
      if (helpNeeded()) return "New request";
      else return "Someone else is on it";
    } else {
      // if (props.request.personal_info.requester_name.length > 10) {
      //   return props.request.personal_info.requester_name.slice(0, 10) + "...";
      // }
      return props.request.personal_info.requester_name;
    }
  };
  const resources = () => {
    return props.request.request_info.resource_request.join(", ");
  };
  const date = () => {
    if (props.requestStatus === volunteer_status.COMPLETE) {
      return getFormattedDate(new Date(props.request.status.completed_date));
    } else {
      return (
        "Due: " + getFormattedDate(new Date(props.request.request_info.date))
      );
    }
  };
  const statusBubble = () => {
    switch (props.requestStatus) {
      case volunteer_status.PENDING:
        if (helpNeeded()) {
          return (
            <span
              style={{
                display: "inline-block",
                borderRadius: "50%",
                marginLeft: 5,
                // backgroundColor: 'rgba(255, 89, 36, 0.26)',
                color: props.color,
                textAlign: "center",
                height: 20,
                width: 20,
              }}
            >
              <FontAwesomeIcon icon={faExclamationCircle} />
            </span>
          );
        } else {
          return (
            <span
              style={{
                display: "inline-block",
                borderRadius: "50%",
                marginLeft: 5,
                // backgroundColor: 'rgba(255, 89, 36, 0.26)',
                color: "#7F7F7F",
                textAlign: "center",
                height: 20,
                width: 20,
              }}
            >
              <FontAwesomeIcon icon={faCheck} />
            </span>
          );
        }
      case volunteer_status.IN_PROGRESS:
        return (
          <span
            style={{
              display: "inline-block",
              borderRadius: "50%",
              marginLeft: 5,
              // backgroundColor: 'rgba(219, 147, 39, 0.26)',
              color: props.color,
              textAlign: "center",
              height: 20,
              width: 20,
            }}
          >
            <FontAwesomeIcon icon={faClock} />
          </span>
        );
      case volunteer_status.COMPLETE:
        return (
          <span
            style={{
              display: "inline-block",
              borderRadius: "50%",
              marginLeft: 5,
              // backgroundColor: 'rgba(58, 189, 36, 0.26)',
              textAlign: "center",
              height: 20,
              width: 20,
            }}
          >
            <FontAwesomeIcon style={{ color: props.color }} icon={faCheck} />
          </span>
        );
      default:
        return <></>;
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleRequestClick = () => {
    setCurrRequest({ ...props.request });
    setModalOpen(true);
    setModalMode(props.requestStatus);
    let volunteerSpecific = props.request.status.volunteers.filter(function (
      volunteer
    ) {
      return volunteer.volunteer === props.user._id;
    });
    if (volunteerSpecific.length === 1) {
      setVolunteerSpecificInfo(volunteerSpecific[0]);
    }
  };

  return (
    <>
      <div
        style={{
          height: "90px",
          border: "1px solid #CECECE",
          boxSizing: "border-box",
          borderRadius: "0px 0px 6px 6px",
          borderTop: "2px solid " + (helpNeeded() ? props.color : "#7F7F7F"),
          marginBottom: 16,
          marginRight: 10,
          marginLeft: 10,
          cursor: helpNeeded() ? "pointer" : "auto",
        }}
        disabled={!helpNeeded()}
        onClick={() => {
          if (helpNeeded()) handleRequestClick();
        }}
      >
        <div style={{ marginTop: 20, marginLeft: 25, marginRight: 19 }}>
          <h1
            id="volunteer-name"
            style={{
              fontSize: 16,
              color: "#4F4F4F",
              textOverflow: "ellipsis",
              overflow: "hidden",
              maxWidth: "85%",
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            {name()}
          </h1>
          <span
            id="regular-text"
            style={{ fontSize: 14, float: "right", whiteSpace: "nowrap" }}
          >
            {/* {date()} */}
            {statusBubble()}
          </span>
        </div>
        <span
          id="regular-text"
          style={{
            fontSize: 14,
            marginLeft: 25,
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxWidth: "85%",
            whiteSpace: "nowrap",
            display: "inline-block",
          }}
        >
          {resources()}
        </span>
      </div>
      <RequestInfo
        currUser={props.user}
        modalOpen={modalOpen}
        modalMode={modalMode}
        setModalOpen={setModalOpen}
        closeModal={closeModal}
        currRequest={currRequest}
        acceptRequest={acceptRequest}
        rejectRequest={rejectRequest}
        completeARequest={completeARequest}
        volunteerSpecificInfo={volunteerSpecificInfo}
      />
    </>
  );
}
