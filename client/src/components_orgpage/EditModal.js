import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useFormFields } from "../libs/hooksLib";
import FormControl from "react-bootstrap/FormControl";
import CheckForm from "../components/CheckForm";
import { extractTrueObj } from "../Helpers";
import Row from "react-bootstrap/Row";

export default function EditModal(props) {
  const [fields, handleFieldChange] = useFormFields({
    url: props.resource.url,
    name: props.resource.name,
    description: props.resource.description,
  });
  const [categories, setCategories] = useState({});
  const [isPublic, setIsPublic] = useState(false);
  const [disabledbtn, setDisabledbtn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const setResourcesObject = (userList, fullList, setFunction) => {
    for (var i = 0; i < fullList.length; i++) {
      const curr = fullList[i];
      const include = userList.includes(curr) ? true : false;
      setFunction((prev) => ({
        ...prev,
        [curr]: include,
      }));
    }
  };

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
      props.setEditModal(true);
      return;
    }

    setDisabledbtn(true);
    var categoriesList = extractTrueObj(categories);
    let form = {
      resourceID: props.resource._id,
      updates: {
        url: fields.url,
        name: fields.name,
        description: fields.description,
        isPublic: isPublic,
        categories: categoriesList,
      },
    };

    const response = await fetch("/api/infohub/updateResource", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Resource updated successfully!");
      response.json().then((resource) => props.editResourceList(resource));
      setDisabledbtn(false);
      props.setEditModal(false);
      props.setAdminModal(true);
    } else {
      alert("Resource did not update successfully!");
      setDisabledbtn(false);
    }
  }

  useEffect(() => {
    if (
      props.resource &&
      props.resource.url &&
      props.resource.name &&
      props.resource.description &&
      props.resource.categories
    ) {
      setIsLoaded(true);
      fields.url = props.resource.url;
      fields.name = props.resource.name;
      fields.description = props.resource.description;
      setResourcesObject(
        props.resource.categories,
        props.association.resources,
        setCategories
      );
      setIsPublic(props.resource.isPublic);
    }
  }, [props.resource]);

  if (isLoaded) {
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
            <Modal.Title style={{ marginLeft: 5 }}>
              Edit this resource
            </Modal.Title>
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
  } else {
    return <></>;
  }
}
