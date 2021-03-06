import React, { useState, useEffect, setValues } from "react";
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
import Container from "react-bootstrap/Container";
import { defaultResources } from "../constants";
import CheckForm from "../components/CheckForm";
import { extractTrueObj } from "../Helpers";
export default function ResourceModal(props) {
  const [fields, handleFieldChange] = useFormFields({
    url: "",
    name: "",
    description: "",
    // categories: "", // change to array TODO
  });
  const [isPublic, setIsPublic] = useState(false);
  const [categories, setCategories] = useState({});
  const [disabledbtn, setDisabledbtn] = useState(false);
  const [charsLeft, setCharsLeft] = useState(100);

  const setResourcesObject = (fullList, setFunction) => {
    for (var i = 0; i < fullList.length; i++) {
      const curr = fullList[i];
      setFunction((prev) => ({
        ...prev,
        [curr]: false,
      }));
    }
  };

  useEffect(() => {
    setResourcesObject(props.association.resources, setCategories);
  }, []);
  // function onSelectedOptionsChange(e) {
  //   console.log("Clicked on " + e.target.value);
  //   if (!categories.includes(e.target.value)) {
  //     setCategories(categories.concat(e.target.value));
  //   } else {
  //     var i = categories.indexOf(e.target.value);
  //     categories.splice(i, 1);
  //   }
  // }

  const validateURL = (url) => {
    var re = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    var isValid = re.test(url);
    if (isValid) {
      if (!url.match(/^[a-zA-Z]+:\/\//)) {
        fields.url = "https://" + url;
      }
    }
    return isValid;
  };

  const checkInputs = () => {
    var valid = true;

    if (fields.name.length === 0) {
      console.log("here1");
      alert("Enter a title");
      valid = false;
    } else if (fields.description.length === 0) {
      alert("Enter a description");
      valid = false;
    } else if (fields.description.length > 100) {
      alert(
        "Character limit of 100 exceeded for description. Reduce number of characters in description."
      );
      valid = false;
    } else if (fields.url.length === 0 || validateURL(fields.url) === false) {
      alert("Enter a valid url");
      valid = false;
    }
    return valid;
  };

  async function handleSubmit(event) {
    if (disabledbtn) {
      return;
    }

    event.preventDefault();

    if (!checkInputs()) {
      props.setResourceModal(true);
      return;
    }

    setDisabledbtn(true);
    var categoriesList = extractTrueObj(categories);
    let form = {
      resource: {
        url: fields.url,
        name: fields.name,
        description: fields.description,
        associationID: props.association._id,
        categories: categoriesList, // fix later TODO
        isPublic: isPublic,
      },
    };

    const response = await fetch("/api/infohub/create", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Resource successfully submitted!");
      response
        .json()
        .then((resourceOuter) => props.addResource(resourceOuter.resource));
      setDisabledbtn(false);
      fields.url = "";
      fields.name = "";
      fields.description = "";
      fields.categories = "";
      setIsPublic(false);
      props.setResourceModal(false);
      props.setAdminModal(true);
    } else {
      alert("Resource did not successfully upload!");
      setDisabledbtn(false);
    }
  }

  // const handleWordCount = event => {
  //   const charCount = event.target.value.length;
  //   setCharsLeft((100-charCount));
  //   if (charsLeft < 0) {
  //     alert("Character limit of 100 exceeded for description. Reduce number of characters in description.")
  //   }
  // }

  // const twoCalls = e => {
  //   handleFieldChange()
  //   handleWordCount(e)
  // }

  return (
    <>
      <Modal
        size="md"
        show={props.resourceModal}
        onHide={() => {
          props.setResourceModal(false);
          props.setAdminModal(true);
        }}
        style={{ marginTop: 10, paddingBottom: 40 }}
      >
        <Modal.Header closeButton>
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
            <Form.Group
              controlId="isPublic"
              bssize="large"
              style={{ marginBottom: 0, marginTop: -5 }}
            >
              <Form.Check
                value={isPublic}
                type="switch"
                id="custom-switch"
                style={{ color: "#7F7F7F", fontSize: 14 }}
                label={isPublic ? "Public" : "Private"}
                checked={isPublic ? true : false}
                onChange={() => {
                  setIsPublic(!isPublic);
                }}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="type">
              <Form.Label style={{ color: "grey" }}>Category:</Form.Label>
              <Row style={{ paddingLeft: "20px" }}>
                <CheckForm obj={categories} setObj={setCategories} />
              </Row>
              {/* <Form.Control
                as="select"
                multiple
                value={categories}
                onChange={onSelectedOptionsChange}
              >
                {props.association.resources.map((option, index) => {
                  return (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  );
                })}
              </Form.Control> */}
            </Form.Group>
            <br />
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
                placeholder="Description (max 100 characters)"
              />
            </Form.Group>
            <Button
              type="submit"
              id="large-button"
              style={{ marginTop: 15 }}
              disabled={disabledbtn}
            >
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
  setAdminModal: PropTypes.func,
  addResource: PropTypes.func,
};
