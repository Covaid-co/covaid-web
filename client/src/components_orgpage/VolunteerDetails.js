import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import Image from "react-bootstrap/Image";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useFormFields } from "../libs/hooksLib";
import { generateURL } from "../Helpers";
import PropTypes from "prop-types";
import MapDetail from "./VolunteerDetailsLocationMap";

/**
 * Volunteer Details Modal in Org portal
 */

export default function VolunteerDetails(props) {
  const [verified, setVerified] = useState(true);
  const [prevNote, setPrevNote] = useState("");
  const [statistics, setStatistics] = useState();
  const [fields, handleFieldChange] = useFormFields({
    email5: "",
    adminDetails: "",
  });
  const [imageUrl, setImageUrl] = useState(
    "https://www.csfences.com/wp-content/uploads/2016/08/profile-placeholder.jpg"
  );

  const [mapBoxToken, setMapBoxToken] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    fetch("/api/apikey/mapbox").then((response) => {
      if (response.ok) {
        response.json().then((key) => {
          setMapBoxToken(key["mapbox"]);
        });
      } else {
        console.log("Error");
      }
    });
    setVerified(props.currVolunteer.preVerified);
    if (props.currVolunteer.note && props.currVolunteer.note.length > 0) {
      fields.email5 = props.currVolunteer.note;
      setPrevNote(props.currVolunteer.note);
    } else {
      fields.email5 = "";
      setPrevNote("");
    }
    if (props.currVolunteer._id) {
      var list = [];
      list.push(props.currVolunteer._id);
      fetch_statistics(list);
      fetchProfilePic(props.currVolunteer._id);
    }
  }, [props.currVolunteer, props.volunteerDetailModal]);

  const fetchProfilePic = (id) => {
    fetch("api/image/" + id).then((response) => {
      if (response.ok) {
        setImageUrl("http://localhost:5000/api/image/" + id);
      } else {
        setImageUrl(
          "https://www.csfences.com/wp-content/uploads/2016/08/profile-placeholder.jpg"
        );
      }
    });
  };

  const fetch_statistics = (id_list) => {
    let params = { id_list: id_list };
    var url = generateURL("/api/request/volunteerStatistics?", params);
    fetch(url)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setStatistics(data);
          });
        } else {
          console.log("Error");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleChangeVerify = (event) => {
    event.persist();
    setVerified(!verified);
    if (Object.keys(props.currVolunteer).length === 0) {
      return;
    }
    let form = {
      user_id: props.currVolunteer._id,
      preVerified: !verified,
    };

    fetch("/api/users/update_verify", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          alert("unable to attach");
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  // Not currently updating all other states
  const setNotes = () => {
    if (
      Object.keys(props.currVolunteer).length === 0 ||
      prevNote === fields.email5
    ) {
      return;
    }
    let form = {
      user_id: props.currVolunteer._id,
      note: fields.email5,
    };

    fetch("/api/users/set_notes", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          alert("unable to attach");
        } else {
          // console.log(props.volunteers)
          var copyVolunteers = props.volunteers.map((volunteer) =>
            volunteer._id === props.currVolunteer._id
              ? { ...volunteer, note: form.note }
              : volunteer
          );
          props.setVolunteers(copyVolunteers);
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const displaySwitch = () => {
    return (
      <Form>
        <Form.Group
          controlId="preverify"
          bssize="large"
          style={{ marginBottom: 0, marginTop: 2 }}
        >
          <Form.Check
            type="switch"
            id="custom-switch"
            style={{ color: "#7F7F7F", fontSize: 14 }}
            label={verified ? "Verified" : "Not Verified"}
            checked={verified}
            onChange={handleChangeVerify}
          />
        </Form.Group>
      </Form>
    );
  };

  const hidingVolunteerModal = () => {
    props.setVolunteerDetailsModal(false);
    setNotes();
    if (props.inVolunteer) {
      props.setVolunteersModal(true);
    }
    if (props.inRequest) {
      props.setRequestDetailsModal(true);
    }
    if (props.matching && props.matching[0]) {
      props.setTopMatchesModal(true);
      props.setBestMatchVolunteer(false);
    }
    if (props.matching && props.matching[1]) {
      props.setConfirmModal(true);
      props.setBestMatchVolunteer(false);
    }
  };

  const handleOpenMap = () => {
    setShowMapModal(true);
    props.setVolunteerDetailsModal(false);
  };

  if (
    Object.keys(props.currVolunteer).length > 0 &&
    statistics &&
    statistics[props.currVolunteer._id]
  ) {
    return (
      <>
        <Modal
          id="volunteer-details"
          show={props.volunteerDetailModal}
          onHide={hidingVolunteerModal}
          style={{ marginTop: 10, paddingBottom: 40, zoom: "90%" }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="small-header">Volunteer Information</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: 24, paddingTop: 10 }}>
            <div id="name-details">
              {props.currVolunteer.first_name} {props.currVolunteer.last_name}
              {props.currVolunteer.availability ? (
                <Badge
                  aria-describedby="tooltip-bottom"
                  id="task-info"
                  style={{
                    marginLeft: 8,
                    marginTop: 0,
                    backgroundColor: "#28a745",
                  }}
                >
                  Visible
                </Badge>
              ) : (
                <Badge
                  aria-describedby="tooltip-bottom"
                  id="task-info"
                  style={{
                    marginLeft: 8,
                    marginTop: -4,
                    backgroundColor: "#dc3545",
                  }}
                >
                  Not visible
                </Badge>
              )}
            </div>
            <Image
              src={imageUrl}
              id="profile-pic"
              style={{
                marginRight: 30,
                marginTop: -30,
                float: 'right',
                cursor: "pointer",
                display: 'inline',
                height: 120,
                width: 120
              }}
            />
            {displaySwitch()}
            <>
              {props.currVolunteer.pronouns === undefined ||
              props.currVolunteer.pronouns === "" ||
              props.currVolunteer.pronouns === " " ? (
                ""
              ) : (
                <p id="regular-text-nomargin">
                  Pronouns: {props.currVolunteer.pronouns}{" "}
                </p>
              )}
            </>
            <p id="regular-text-nomargin" style={{ marginBottom: -8 }}>
              <Button
                id="regular-text"
                variant="link"
                style={{ color: "#2670FF", padding: 0, marginBottom: 4 }}
                onClick={handleOpenMap}
              >
                Location
              </Button>
            </p>
            <p id="regular-text-nomargin">{props.currVolunteer.email}</p>
            <p id="regular-text-nomargin">{props.currVolunteer.phone}</p>
            <p id="regular-text-nomargin" style={{ marginTop: 14 }}>
              Languages:{" "}
              {props.currVolunteer.languages
                ? props.currVolunteer.languages.join(", ")
                : ""}
            </p>
            <p id="regular-text-nomargin">
              Neighborhoods:{" "}
              {props.currVolunteer.offer
                ? props.currVolunteer.offer.neighborhoods.join(", ")
                : ""}
            </p>
            <p id="regular-text-nomargin">
              Driver:{" "}
              {props.currVolunteer.offer
                ? props.currVolunteer.offer.car
                  ? " Yes"
                  : " No"
                : ""}
            </p>
            <h5
              id="regular-text-bold"
              style={{ marginBottom: 0, marginTop: 14 }}
            >
              Volunteer Statistics:
            </h5>
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip>Total requests matched all time.</Tooltip>}
            >
              <p id="regular-text-nomargin">
                Matched: {statistics[props.currVolunteer._id].total}
              </p>
            </OverlayTrigger>
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip>Total requests completed.</Tooltip>}
            >
              <p id="regular-text-nomargin">
                Completed: {statistics[props.currVolunteer._id].completed}
              </p>
            </OverlayTrigger>
            <h5
              id="regular-text-bold"
              style={{ marginBottom: 8, marginTop: 16 }}
            >
              Notes:
            </h5>
            <Form>
              <Form.Group controlId="email5" bssize="large">
                <Form.Control
                  as="textarea"
                  rows="2"
                  placeholder="Details about this volunteer"
                  value={fields.email5 ? fields.email5 : ""}
                  onChange={handleFieldChange}
                />
              </Form.Group>
            </Form>
            <h5
              id="regular-text-bold"
              style={{ marginBottom: 5, marginTop: 16 }}
            >
              Tasks:
            </h5>
            {props.currVolunteer.offer
              ? props.currVolunteer.offer.tasks.map((task, i) => {
                  return (
                    <Badge key={i} id="task-info">
                      {task}
                    </Badge>
                  );
                })
              : ""}
            <h5
              id="regular-text-bold"
              style={{ marginBottom: 0, marginTop: 16 }}
            >
              Details:
            </h5>
            <p id="regular-text-nomargin">
              {" "}
              {props.currVolunteer.offer
                ? props.currVolunteer.offer.details
                : ""}
            </p>
          </Modal.Body>
        </Modal>
        <Modal
          show={showMapModal}
          onHide={() => {
            setShowMapModal(false);
            props.setVolunteerDetailsModal(true);
          }}
          style={{ marginTop: 10, paddingBottom: 50 }}
        >
          <MapDetail
            currVolunteer={props.currVolunteer}
            mapBoxToken={mapBoxToken}
          />
        </Modal>
      </>
    );
  } else {
    return (
      <Modal
        id="volunteer-details"
        show={props.volunteerDetailModal}
        onHide={() => {
          props.setVolunteerDetailsModal(false);
          if (props.setVolunteersModal) {
            props.setVolunteersModal(true);
          }
        }}
        style={{ marginTop: 40 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Volunteer Information</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 24, paddingTop: 10 }}>
          Loading...
        </Modal.Body>
      </Modal>
    );
  }
}

VolunteerDetails.propTypes = {
  currVolunteer: PropTypes.object,
  inRequest: PropTypes.bool,
  inVolunteer: PropTypes.bool,
  volunteerDetailModal: PropTypes.bool,
  setVolunteerDetailsModal: PropTypes.func,
  setVolunteersModal: PropTypes.func,
  setRequestDetailsModal: PropTypes.func,
  setTopMatchesModal: PropTypes.func,
  setBestMatchVolunteer: PropTypes.func,
};
