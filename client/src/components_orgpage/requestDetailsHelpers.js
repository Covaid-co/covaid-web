import React from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import { generateURL } from "../Helpers";
import { current_tab, volunteer_status } from "../constants";
import { filter_volunteers, distance, formatName } from "./OrganizationHelpers";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

// Find a volunteer attached to this request
export const findAttachedVolunteer = async (curr_request, mode) => {
  if (
    curr_request.status === undefined ||
    curr_request.status.volunteers.length === 0 ||
    mode === current_tab.UNMATCHED
  ) {
    return {};
  }
  const params = { id: curr_request.status.volunteers[0].volunteer };
  const url = generateURL("/api/users/user?", params);

  const response = await fetch(url, {
    method: "get",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    const data = await response.json();
    if (data.length > 0) {
      return data[0];
    }
  }
  return {};
};

export const matchVolunteersButton = (mode, topMatch) => {
  if (mode === current_tab.UNMATCHED) {
    return (
      <Button id="large-button" style={{ marginTop: 30 }} onClick={topMatch}>
        Match volunteers
      </Button>
    );
  }
  return <></>;
};

export const unmatchCompleteButtons = (
  mode,
  closeRequest,
  setUnmatchModal,
  setDeleteModal,
  setConfirmCompleteModal
) => {
  var rightButton = (
    <Col xs={6} style={{ padding: 0, paddingRight: 4, paddingLeft: 15 }}>
      <Button
        id="large-button-empty"
        style={{ borderColor: "#DB4B4B", color: "#DB4B4B" }}
        onClick={() => {
          setUnmatchModal(true);
          closeRequest();
        }}
      >
        Unmatch Request
      </Button>
    </Col>
  );

  var leftButton = (
    <Col xs={6} style={{ padding: 0, paddingLeft: 4, paddingRight: 15 }}>
      <Button
        id="large-button-empty"
        style={{ borderColor: "#28a745", color: "#28a745" }}
        onClick={() => {
          setConfirmCompleteModal(true);
          closeRequest();
        }}
      >
        {mode === current_tab.COMPLETED ? "Update Status" : "Mark Complete"}
      </Button>
    </Col>
  );

  if (mode === current_tab.UNMATCHED) {
    rightButton = (
      <Col xs={6} style={{ padding: 0, paddingRight: 4, paddingLeft: 15 }}>
        <Button
          id="large-button-empty"
          style={{ borderColor: "#DB4B4B", color: "#DB4B4B" }}
          onClick={() => {
            setDeleteModal(true);
            closeRequest();
          }}
        >
          Delete Request
        </Button>
      </Col>
    );
  }

  return (
    <Row style={{ marginBottom: 10 }}>
      {rightButton}
      {leftButton}
    </Row>
  );
};

export const viewVolunteersInfo = (
  mode,
  curr_request,
  viewEdit,
  viewComplete
) => {
  if (mode === current_tab.MATCHED) {
    const volunteers = curr_request.status.volunteers;
    const in_progress = filter_volunteers(
      volunteers,
      volunteer_status.IN_PROGRESS
    );
    const pending = filter_volunteers(volunteers, volunteer_status.PENDING);

    // If there is at least 1 in progress, the request is in progress
    if (in_progress.length > 0) {
      return (
        <div style={{ textAlign: "center" }}>
          <Button
            variant="link"
            style={{ color: "#DB9327", fontWeight: "bold" }}
            onClick={viewEdit}
          >
            <p
              id="regular-text-nomargin"
              style={{ marginTop: 10, marginBottom: 10, color: "#DB9327" }}
            >
              {in_progress.length === 1
                ? "1 volunteer"
                : in_progress.length + " volunteers"}{" "}
              working on this
            </p>
          </Button>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <Button
            variant="link"
            style={{ color: "#8A8A8A", fontWeight: "bold" }}
            onClick={viewEdit}
          >
            <p
              id="regular-text-nomargin"
              style={{ marginTop: 10, marginBottom: 10, color: "#8A8A8A" }}
            >
              Awaiting response from{" "}
              {pending.length === 1
                ? "1 volunteer"
                : pending.length + " volunteers"}
            </p>
          </Button>
        </div>
      );
    }
  } else if (mode === current_tab.COMPLETED) {
    const volunteers = curr_request.status.volunteers;
    const completed = filter_volunteers(volunteers, volunteer_status.COMPLETE);
    if (completed.length > 0) {
      // TODO -> UI for multiple completing volunteers
      return (
        <div style={{ textAlign: "center" }}>
          <Button
            variant="link"
            style={{ color: "#28a745", fontWeight: "bold" }}
            onClick={() => viewComplete(completed[0])}
          >
            <p
              id="regular-text-nomargin"
              style={{ marginTop: 10, marginBottom: 10, color: "#28a745" }}
            >
              View volunteer who completed this request
            </p>
          </Button>
        </div>
      );
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
};

export const bestMatchesTitle = (curr_request, mode) => {
  if (mode === current_tab.UNMATCHED) {
    return "Top Matches";
  } else if (mode === current_tab.MATCHED) {
    return "Edit Volunteer List";
  } else {
    return "View Volunteers";
  }
};

export const unselectButtonStyle = (volunteerCount) => {
  if (volunteerCount() === 0) {
    return { color: "#cadaff", backgroundColor: "transparent" };
  }
  return { color: "#2670FF", backgroundColor: "transparent" };
};

// Display if volunteer was previously matched
export const displayPrevMatched = (volunteer, curr_request) => {
  const volunteers = curr_request.status.volunteers;
  const found = volunteers.find((vol) => {
    return (
      volunteer._id === vol.volunteer &&
      vol.current_status === volunteer_status.REJECTED
    );
  });

  if (found) {
    return (
      <h5 id="association-name" style={{ color: "#FF4133" }}>
        Previously Matched
      </h5>
    );
  }
  return <></>;
};

const sortSelectedTask = (curr_request) => (x, y) => {
  const validX =
    curr_request &&
    curr_request.request_info &&
    curr_request.request_info.resource_request.length > 0 &&
    curr_request.request_info.resource_request.indexOf(x) !== -1;

  const validY =
    curr_request &&
    curr_request.request_info &&
    curr_request.request_info.resource_request.length > 0 &&
    curr_request.request_info.resource_request.indexOf(y) !== -1;
  return validX === validY ? 0 : validX ? -1 : 1;
};

// Resource's that match between requester and volunteer
export const displayResourceMatch = (volunteer, curr_request) => {
  if (volunteer.offer.tasks.length === 0) {
    return (
      <Badge id="task-info" style={{ background: "#AE2F2F" }}>
        No tasks entered
      </Badge>
    );
  } else {
    var tasks = volunteer.offer.tasks;
    tasks.sort(sortSelectedTask(curr_request));
    return tasks.map((task, i) => {
      if (
        curr_request &&
        curr_request.request_info &&
        curr_request.request_info.resource_request.length > 0 &&
        curr_request.request_info.resource_request.indexOf(task) !== -1
      ) {
        return (
          <Badge key={i} style={{ background: "#2670FF" }} id="task-info">
            {task}
          </Badge>
        );
      } else {
        return (
          <Badge key={i} style={{ background: "#cadaff" }} id="task-info">
            {task}
          </Badge>
        );
      }
    });
  }
};

// List group item for volunteers in request details
export const volunteerListGroup = (
  volunteer,
  curr_request,
  handleVolunteerClick,
  statistics,
  checkboxStatus,
  handleCheckboxAction
) => {
  if (checkboxStatus && statistics) {
    var styleTag = "none";
    if (
      statistics["completed"] &&
      statistics["completed"].toString(10).localeCompare("0")
    ) {
      styleTag = "inline";
    }
    return (
      <ListGroup.Item key={volunteer._id} style={{ padding: 0 }}>
        <Row>
          <Col xs={1}>
            <Form.Check
              type="checkbox"
              style={{ marginTop: 35 }}
              id="default-checkbox"
              checked={checkboxStatus[volunteer._id]}
              onChange={(event) => {
                handleCheckboxAction(volunteer, event);
              }}
            />
          </Col>
          <Col
            id="best-match-item"
            xs={11}
            onClick={() => handleVolunteerClick(volunteer)}
          >
            <div>
              <h5 id="volunteer-name" style={{ marginBottom: 0 }}>
                {volunteer.first_name} {volunteer.last_name} &nbsp;&nbsp;
              </h5>

              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="tooltip-right">
                    Total requests completed.
                  </Tooltip>
                }
              >
                <span style={{ display: styleTag }}>
                  <Badge
                    key={0}
                    style={{
                      background: "#28A745",
                      marginTop: 0,
                      marginRight: 0,
                      marginLeft: -8,
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: "center",
                    }}
                    id="task-info"
                  >
                    {statistics["completed"]}
                  </Badge>
                </span>
              </OverlayTrigger>

              {displayPrevMatched(volunteer, curr_request)}
            </div>
            <div>
              <p id="volunteer-location">
                {volunteer.offer.neighborhoods.join(", ")}
              </p>
              <p
                id="volunteer-location"
                style={{ float: "right", marginTop: -25, marginRight: 10 }}
              >
                {distance(volunteer, curr_request)} miles
              </p>
            </div>

            <div>{displayResourceMatch(volunteer, curr_request)}</div>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  } else if (statistics) {
    var styleTag = "none";
    if (
      statistics["completed"] &&
      statistics["completed"].toString(10).localeCompare("0")
    ) {
      styleTag = "inline";
    }
    return (
      <ListGroup.Item key={volunteer._id} style={{ padding: 0 }}>
        <Row>
          <Col
            id="best-match-item"
            xs={12}
            onClick={() => handleVolunteerClick(volunteer)}
            style={{ paddingLeft: 35 }}
          >
            <div>
              <h5 id="volunteer-name" style={{ marginBottom: 0 }}>
                {volunteer.first_name} {volunteer.last_name} &nbsp;&nbsp;
              </h5>
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Total requests completed.</Tooltip>}
              >
                <span style={{ display: styleTag }}>
                  <Badge
                    key={0}
                    style={{ background: "#28A745" }}
                    id="task-info"
                  >
                    {statistics["completed"]}
                  </Badge>
                </span>
              </OverlayTrigger>
              {displayPrevMatched(volunteer, curr_request)}
              <p
                id="volunteer-location"
                style={{
                  float: "right",
                  marginTop: 0,
                  marginRight: 10,
                  marginBottom: 0,
                }}
              >
                {distance(volunteer, curr_request)} miles
              </p>
            </div>

            <div>
              <p id="volunteer-location">
                {volunteer.offer.neighborhoods.join(", ")}
                {requestStatusBadge(curr_request, volunteer)}
              </p>
            </div>
            <div>{displayResourceMatch(volunteer, curr_request)}</div>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  } else {
    return (
      <ListGroup.Item key={volunteer._id} style={{ padding: 0 }}>
        <Row>
          <Col
            id="best-match-item"
            xs={12}
            onClick={() => handleVolunteerClick(volunteer)}
            style={{ paddingLeft: 35 }}
          >
            <div>
              <h5 id="volunteer-name" style={{ marginBottom: 0 }}>
                {volunteer.first_name} {volunteer.last_name} &nbsp;&nbsp;
              </h5>
              {displayPrevMatched(volunteer, curr_request)}
              <p
                id="volunteer-location"
                style={{
                  float: "right",
                  marginTop: 0,
                  marginRight: 10,
                  marginBottom: 0,
                }}
              >
                {distance(volunteer, curr_request)} miles
              </p>
            </div>

            <div>
              <p id="volunteer-location">
                {volunteer.offer.neighborhoods.join(", ")}
                {requestStatusBadge(curr_request, volunteer)}
              </p>
            </div>
            <div>{displayResourceMatch(volunteer, curr_request)}</div>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  }
};

const requestStatusBadge = (curr_request, volunteer) => {
  const request_volunteers = curr_request.status.volunteers;
  const filtered = request_volunteers.filter(
    (vol) => vol.volunteer === volunteer._id
  );
  if (filtered.length > 0) {
    if (filtered[0].current_status === volunteer_status.PENDING) {
      return (
        <Badge className="pending-task" style={{ marginTop: 6 }}>
          Pending
        </Badge>
      );
    } else if (filtered[0].current_status === volunteer_status.IN_PROGRESS) {
      return (
        <Badge
          className="in-progress-task"
          style={{ marginTop: 6, marginRight: 10, float: "right" }}
        >
          In Progress
        </Badge>
      );
    }
  } else {
    return <></>;
  }
};

// Volunteers attached to a request that have been notified
export const notifiedVolunteers = (curr_request, volunteers) => {
  const request_volunteers = curr_request.status.volunteers;
  const in_progress = filter_volunteers(
    request_volunteers,
    volunteer_status.IN_PROGRESS
  );
  const pending = filter_volunteers(
    request_volunteers,
    volunteer_status.PENDING
  );
  var displayed_volunteers = [];
  const in_progress_ids = in_progress.map((volunteer) => volunteer.volunteer);
  const pending_ids = pending.map((volunteer) => volunteer.volunteer);
  const in_progress_displayed = volunteers.filter((volunteer) =>
    in_progress_ids.includes(volunteer._id)
  );
  const pending_displayed = volunteers.filter((volunteer) =>
    pending_ids.includes(volunteer._id)
  );
  displayed_volunteers = in_progress_displayed.concat(pending_displayed);
  displayed_volunteers.sort(function (a, b) {
    return distance(a, curr_request) - distance(b, curr_request);
  });
  return displayed_volunteers;
};

// Volunteers attached to a request that are to be notified
export const unSelectedVolunteers = (curr_request, volunteers, strict) => {
  const request_volunteers = curr_request.status.volunteers;
  const in_progress = filter_volunteers(
    request_volunteers,
    volunteer_status.IN_PROGRESS
  );
  const in_progress_ids = in_progress.map((volunteer) => volunteer.volunteer);
  const pending = filter_volunteers(
    request_volunteers,
    volunteer_status.PENDING
  );
  const pending_ids = pending.map((volunteer) => volunteer.volunteer);

  const needed_resources = curr_request.request_info
    ? curr_request.request_info.resource_request
    : [];
  var displayed_volunteers = volunteers.filter(
    (volunteer) =>
      !in_progress_ids.includes(volunteer._id) &&
      !pending_ids.includes(volunteer._id)
  );
  if (strict) {
    displayed_volunteers = displayed_volunteers.filter((volunteer) =>
      volunteer.offer.tasks.some((item) => needed_resources.includes(item))
    );
  }
  displayed_volunteers = displayed_volunteers.filter(
    (volunteer) => volunteer.availability
  );
  displayed_volunteers.sort(function (a, b) {
    return distance(a, curr_request) - distance(b, curr_request);
  });
  return displayed_volunteers.slice(0, 100);
};
