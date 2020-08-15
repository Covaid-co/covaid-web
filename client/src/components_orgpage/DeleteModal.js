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
import FormControl from "react-bootstrap/FormControl";

export default function DeleteModal(props) {
  const [disabledbtn, setDisabledbtn] = useState(false);

  async function deleteRes() {
    if (disabledbtn) {
      return;
    }
    setDisabledbtn(true);

    let params = { _id: props.resource._id };

    var url = generateURL("/api/infohub/delete?", params);

    const response = await fetch(url, {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      alert("Resource successfully deleted!");
      props.deleteResource(props.resource);
      setDisabledbtn(false);
      props.setDeleteModal(false);
      props.setAdminModal(true);
    } else {
      alert("Resource did not delete successfully!");
      setDisabledbtn(false);
    }
  }

  return (
    <>
      <Modal
        size="md"
        show={props.deleteModal}
        onHide={() => {
          props.setDeleteModal(false);
          props.setAdminModal(true);
        }}
        style={{ marginTop: 10, paddingBottom: 40 }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ marginLeft: 5 }}>
            Are you sure you would like to delete this resource?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={6}>
              <Button
                id="large-button"
                onClick={() => {
                  props.setDeleteModal(false);
                  props.setAdminModal(true);
                }}
              >
                Don't delete
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                id="large-button"
                disabled={disabledbtn}
                style={{ backgroundColor: "#DB4B4B", borderColor: "#DB4B4B" }}
                onClick={deleteRes}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

DeleteModal.propTypes = {
  association: PropTypes.object,
  deleteModal: PropTypes.bool,
  setDeleteModal: PropTypes.func,
  setAssociation: PropTypes.func,
  adminModal: PropTypes.bool,
  setAdminModal: PropTypes.func,
  deleteResource: PropTypes.func,
  resource: PropTypes.array,
};
