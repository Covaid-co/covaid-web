import React, { useState } from "react";
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


export default function ResourceModal(props) {
  const [fields, handleFieldChange] = useFormFields({
    url: "",
    name: "",
    description: "",
  });

  
  async function handleSubmit(event) {
    event.preventDefault();
    let form = {
        resource:{url: fields.url, name:fields.name, description: fields.description, associationID: props.association._id},
    };

    const response = await fetch("/api/infohub/create", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
    });

    if (response.ok) {
    props.setResourceModal(false);
    props.setAdminModal(true);
    } else {
    alert("Resource did not successfully upload");
    }
  }   

  return (
    <>
      <Modal
        size="md"
        show={props.resourceModal}
        onHide={() => props.setResourceModal(false)}
        style={{ marginTop: 10, paddingBottom: 40 }}
      >
        <Modal.Header closeButton
                    onClick={() => {
                        props.setAdminModal(true);
                        }}>
          <Modal.Title style={{ marginLeft: 5 }}>Add a resource</Modal.Title>

        </Modal.Header>
        <Modal.Body>
        <Form
          onSubmit={handleSubmit}
          style={{
            marginTop: 0,
            marginBottom: 10,
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
            <Form.Group controlId="name" bssize="large">
                <FormControl
                    value={fields.name}
                    onChange={handleFieldChange}
                    placeholder="Resource Title"
                    style={{ marginBottom: 10 }}
                />
            </Form.Group>
            <Form.Group controlId="url" bssize="large">
                <FormControl
                    value={fields.url}
                    onChange={handleFieldChange}
                    placeholder="Link"
                    style={{ marginBottom: 10 }}
                />
            </Form.Group>
            <Form.Group controlId="description" bssize="large">
                <FormControl
                    value={fields.description}
                    onChange={handleFieldChange}
                    as="textarea"
                    rows="3"
                    placeholder="Description"
                />
            </Form.Group>
          <Button type="submit" id="large-button" style={{ marginTop: 15 }}>
            Submit
          </Button>
        </Form>
      </Modal.Body>
      </Modal>

    </>
  );
}

ResourceModal.propTypes = {
    association: PropTypes.object,
    resourceModal: PropTypes.bool,
    setResourceModal: PropTypes.func,
    setAssociation: PropTypes.func,
    adminModal: PropTypes.bool,
    setAdminModal: PropTypes.func
};