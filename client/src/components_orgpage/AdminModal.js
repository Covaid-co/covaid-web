import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useFormFields } from "../libs/hooksLib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { generateURL } from "../Helpers";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

import ResourceModal from "./ResourceModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal.js";

/**
 * Manage Organization Modal
 */

export default function AdminModal(props) {
  const [addAdmin, setAddAdmin] = useState(false);
  const [resourceModal, setResourceModal] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    name3: "",
    email3: "",
  });
  const [resources, setResources] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editResource, setEditResource] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedResource, setDeletedResource] = useState([]);

  const newHandleSubmit = async (e) => {
    e.preventDefault();
    let form = {
      associationID: props.association._id,
      email: fields.email3,
      name: fields.name3,
    };

    fetch("/api/association/admins", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          setAddAdmin(false);
          props.setAdminModal(true);
          var currAdmins = [...props.association.admins];
          currAdmins.push({ email: fields.email3, name: fields.name3 });
          props.setAssociation({
            ...props.association,
            admins: currAdmins,
          });
          fields.email3 = "";
          fields.name3 = "";
        } else {
          alert("unable to attach");
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const updateRecruiting = async (e) => {
    e.preventDefault();
    let form = {
      associationID: props.association._id,
      recruiting: !props.association.recruiting,
    };

    fetch("/api/association/update_recruiting", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          props.setAssociation({
            ...props.association,
            recruiting: !props.association.recruiting,
          });
        } else {
          alert("unable to attach");
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const exportVolunteers = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let params = { association: props.association._id };
    var url = generateURL("/api/users/allFromAssoc?", params);
    fetch(url, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((volunteers) => {
            var d = new Date();
            const reformattedVolunteers = volunteers.map((volunteer) => {
              return {
                "First Name": volunteer.first_name,
                "Last Name": volunteer.last_name,
                Pronouns: volunteer.pronouns,
                Email: volunteer.email,
                Phone: volunteer.phone,
                "More Info": volunteer.offer.details,
                Neighborhoods: volunteer.offer.neighborhoods.join(", "),
                Resources: volunteer.offer.tasks.join(", "),
                "Internal Note": volunteer.note,
              };
            });
            const fileName = "volunteers-" + d.toLocaleDateString();
            const ws = XLSX.utils.json_to_sheet(reformattedVolunteers);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, {
              bookType: "xlsx",
              type: "array",
            });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
          });
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const exportRequests = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    let params = { association: props.association._id };
    var url = generateURL("/api/request/allRequestsInAssoc?", params);

    fetch(url, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((requests) => {
            var d = new Date();
            const reformattedRequests = requests.map((request) => {
              console.log(request);
              return {
                Name: request.personal_info.requester_name,
                Email: request.personal_info.requester_email,
                Phone: request.personal_info.requester_phone,
                "Resource Request": request.request_info.resource_request.join(", "),
                Details: request.request_info.details,
                "Time Created": request.time_posted,
              };
            });
            const fileName = "requests-" + d.toLocaleDateString();
            const ws = XLSX.utils.json_to_sheet(reformattedRequests);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, {
              bookType: "xlsx",
              type: "array",
            });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
          });
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const getHeight = () => {
    const adminLength = props.association.admins
      ? props.association.admins.length
      : 0;
    return Math.min(adminLength * 72, 300);
  };

  const getResourceHeight = () => {
    const resourceLength = resources.length;
    return Math.min(resourceLength * 95, 300);
  };

  const addResource = (resource) => {
    setResources(resources.concat(resource));
  };

  const editResourceList = (resource) => {
    var i = resources.findIndex((r) => r._id == resource._id);
    var currResources = [...resources];
    currResources[i] = resource;
    setResources(currResources);
  };

  const deleteResource = (resource) => {
    var currResources = [...resources];
    currResources = currResources.filter(
      (currResource) => currResource._id !== resource._id
    );
    setResources(currResources);
  };

  useEffect(() => {
    async function getAssociationResources() {
      let params = { associationID: props.association._id };

      var url = generateURL("/api/infohub/?", params);

      const response = await fetch(url);

      const jsonData = await response.json();

      setResources(jsonData);
    }
    getAssociationResources();
  }, []);

  return (
    <>
      <Modal
        size="md"
        show={props.adminModal}
        onHide={() => props.setAdminModal(false)}
        style={{ marginTop: 10, paddingBottom: 40 }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ marginLeft: 5 }}>Current Admins</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: 0 }}>
          <Row>
            <Col xs={12}>
              <ListGroup
                variant="flush"
                style={{ overflowY: "scroll", height: getHeight() }}
              >
                {props.association.admins ? (
                  props.association.admins.map((admin, i) => {
                    return (
                      <ListGroup.Item style={{ height: 72 }} key={i}>
                        <h5 id="volunteer-name">{admin.name}</h5>
                        <p id="regular-text" style={{ marginBottom: 0 }}>
                          {admin.email}
                        </p>
                      </ListGroup.Item>
                    );
                  })
                ) : (
                  <></>
                )}
              </ListGroup>
            </Col>
            {/* <Col xs={12}>
                            <p id="requestCall" style={{marginTop: 0, marginBottom: 10}}></p>
                        </Col>
                        <Col xs={12} style={{textAlign: 'center'}}>
                            <Button id="regular-text" variant="link" style={{color: '#2670FF'}} 
                                onClick={() => {setAddAdmin(true); props.setAdminModal(false)}}>
                                Add an Admin +
                            </Button>
                        </Col> */}
          </Row>
        </Modal.Body>
        <Modal.Header>
          <Modal.Title style={{ marginLeft: 5 }}>
            Recruiting for admins
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              controlId="preverify"
              bssize="large"
              style={{ marginBottom: 0, marginTop: -5 }}
            >
              <Form.Check
                type="switch"
                id="custom-switch"
                style={{ color: "#7F7F7F", fontSize: 14 }}
                label={
                  props.association.recruiting ? "Recruiting" : "Not Recruiting"
                }
                checked={
                  props.association.recruiting
                    ? props.association.recruiting
                    : false
                }
                onChange={updateRecruiting}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Header>
          <Modal.Title style={{ marginLeft: 5 }}>Export to file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={6}>
              <Button id="large-button" onClick={exportVolunteers}>
                Volunteers <FontAwesomeIcon icon={faFileExcel} />
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                id="large-button"
                style={{ backgroundColor: "#DB4B4B", borderColor: "#DB4B4B" }}
                onClick={exportRequests}
              >
                Requests <FontAwesomeIcon icon={faFileExcel} />
              </Button>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Header>
          <Modal.Title style={{ marginLeft: 5 }}>Add a resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={6}>
              <Button
                id="large-button"
                onClick={() => {
                  setResourceModal(true);
                  props.setAdminModal(false);
                }}
              >
                New Resource
              </Button>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Header>
          <Modal.Title style={{ marginLeft: 5 }}>
            Uploaded Resources
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: 0 }}>
          <Row>
            <Col xs={12}>
              <ListGroup
                variant="flush"
                style={{ overflowY: "scroll", height: getResourceHeight() }}
              >
                {resources ? (
                  resources.map((resource, i) => {
                    return (
                      <ListGroup.Item style={{ height: 95 }} key={i}>
                        <h5
                          id="volunteer-name"
                          style={{ position: "relative" }}
                        >
                          {resource.name}
                          <span style={{ float: "right" }}>
                            <IconButton aria-label="edit">
                              <EditIcon
                                fontSize="small"
                                style={{
                                  position: "absolute",
                                  fill: "#7f7f7f",
                                }}
                                onClick={() => {
                                  setEditResource(resource);
                                  setEditModal(true);
                                  props.setAdminModal(false);
                                }}
                              />
                            </IconButton>
                            <IconButton aria-label="delete">
                              <DeleteIcon
                                fontSize="small"
                                style={{
                                  position: "absolute",
                                  fill: "#7f7f7f",
                                }}
                                onClick={() => {
                                  setDeletedResource(resource);
                                  setDeleteModal(true);
                                  props.setAdminModal(false);
                                }}
                              />
                            </IconButton>
                          </span>
                        </h5>
                        <p
                          id="regular-text"
                          style={{ marginBottom: 0, color: "#2670FF" }}
                        >
                          {resource.url}
                        </p>
                        <p
                          id="regular-text"
                          style={{
                            marginBottom: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {resource.description}
                        </p>
                      </ListGroup.Item>
                    );
                  })
                ) : (
                  <></>
                )}
              </ListGroup>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        size="sm"
        show={addAdmin}
        onHide={() => {
          setAddAdmin(false);
          props.setAdminModal(true);
        }}
      >
        <Modal.Header closeButton style={{ borderBottom: "0px solid" }}>
          <Modal.Title id="small-header" style={{ marginLeft: 5 }}>
            Add an Admin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: 0 }}>
          <Row>
            <Col xs={12}>
              <Form onSubmit={newHandleSubmit}>
                <Form.Group controlId="name3" bssize="large">
                  <Form.Control
                    value={fields.name3}
                    placeholder="Name"
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group
                  controlId="email3"
                  bssize="large"
                  style={{ marginTop: 5 }}
                >
                  <Form.Control
                    value={fields.email3}
                    placeholder="Email"
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  id="large-button"
                  style={{ marginTop: 0 }}
                >
                  Add Admin
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <ResourceModal
        resourceModal={resourceModal}
        setResourceModal={setResourceModal}
        association={props.association}
        setAssociation={props.setAssociation}
        adminModal={props.adminModal}
        setAdminModal={props.setAdminModal}
        addResource={addResource}
      />

      <EditModal
        editModal={editModal}
        setEditModal={setEditModal}
        association={props.association}
        setAssociation={props.setAssociation}
        adminModal={props.adminModal}
        setAdminModal={props.setAdminModal}
        editResourceList={editResourceList}
        resource={editResource}
      />

      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        association={props.association}
        setAssociation={props.setAssociation}
        adminModal={props.adminModal}
        setAdminModal={props.setAdminModal}
        deleteResource={deleteResource}
        resource={deletedResource}
      />
    </>
  );
}

AdminModal.propTypes = {
  association: PropTypes.object,
  adminModal: PropTypes.bool,
  setAdminModal: PropTypes.func,
  setAssociation: PropTypes.func,
};
