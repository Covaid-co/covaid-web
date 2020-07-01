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

export default function EditModal(props) {
  const [fields, handleFieldChange] = useFormFields({
    url: props.resource.url,
    name: props.resource.name,
    description: props.resource.description,
  });
  const [disabledbtn, setDisabledbtn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const validateURL = (url) => {
    var re = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    var isValid = re.test(url);
    if (isValid) {
      if (!(url.match(/^[a-zA-Z]+:\/\//))) {
        fields.url = 'https://' + url;
      }
    }
    return isValid;
  };

  const checkInputs = () => {
    var valid = true;

    if (fields.name.length === 0) {
      console.log("here1")
      alert("Enter a title");
      valid = false;
    } else if (fields.description.length === 0) {
      alert("Enter a description");
      valid = false;
    } else if (
      fields.url.length === 0 ||
      validateURL(fields.url) === false
    ) {
      alert("Enter a valid url");
      valid = false;
    }
    return valid;
  };
  
  async function handleSubmit(event) {
    if(disabledbtn) {
        return;
    }
      
    event.preventDefault();
    
    if (!checkInputs()) {
        props.setEditModal(true);
        return;
    }
    
    setDisabledbtn(true);

    let form = {
        resourceID: props.resource._id,
        updates: {
          url: fields.url,
          name: fields.name,
          description: fields.description,
        },
      };

    const response = await fetch("/api/infohub/updateResource", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Resource updated successfully!");
      response.json().then(resource => props.editResourceList(resource));
      setDisabledbtn(false);
      props.setEditModal(false);
      props.setAdminModal(true);
    } else {
      alert("Resource did not update successfully!");
      setDisabledbtn(false);
    }
  }  

  useEffect(() => {
    fields.url = props.resource.url;
    fields.name = props.resource.name;
    fields.description = props.resource.description;
    
    setIsLoaded(true);
  }, [props.resource]);
  
  if(isLoaded) {
        return (
        <>
            <Modal
            size="md"
            show={props.editModal}
            onHide={() => {
                props.setEditModal(false);
                props.setAdminModal(true);
            }}
            style={{ marginTop: 10, paddingBottom: 40 }}
            >
            <Modal.Header closeButton>
                <Modal.Title style={{ marginLeft: 5 }}>Edit this resource</Modal.Title>
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
                <Button type="submit" id="large-button" style={{ marginTop: 15 }} disabled={disabledbtn}>
                Submit
                </Button>
            </Form>
            </Modal.Body>
            </Modal>

        </>
    );
    } else {
        return <></>;
    }
}

EditModal.propTypes = {
    association: PropTypes.object,
    editModal: PropTypes.bool,
    setEditModal: PropTypes.func,
    setAssociation: PropTypes.func,
    adminModal: PropTypes.bool,
    setAdminModal: PropTypes.func,
    editResourceList: PropTypes.func,
    resource: PropTypes.array
};