import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import FormControl from "react-bootstrap/FormControl";
import { useFormFields } from "../libs/hooksLib";
import { toastTime } from "../constants";
import { generateURL } from '../Helpers';

export default function BeaconModal(props) {
    const [justRegistered, setJustRegistered] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [fields, handleFieldChange] = useFormFields({
        org_name: "",
        org_contact: "",
        org_details: "",
    });
    // TODO: Add fields regarding # of volunteers, other skills needed, anything else that may be relevant. 

    const validateForm = () => {
        var valid = true;
        if (fields.org_name.length === 0) {
            setToastMessage("Enter your organization name");
            valid = false;
        } else if (fields.org_contact.length === 0) {
            setToastMessage("Enter your contact information");
            valid = false;
        } else if (fields.org_details.length === 10) {
            setToastMessage("Enter any additional details about your organization");
            valid = false;
        }
        if (valid === false) {
            setShowToast(true);
        }
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm() === false) {
            return;
        }

        setJustRegistered(true);

        let form = {
            name: fields.org_name,
            contact: fields.org_contact,
            details: fields.org_details,
        };

        let params = {
            message: "Organization Name: " + fields.org_name + ", Contact Info: " + fields.org_contact + ", Details: " + fields.org_details
        };
        var url = generateURL("/api/beacon/create?", params);
        fetch(url).then((response) => {
            if (response.ok) {
                console.log(response);
                response
                    .json()
                    .then(() => {
                        console.log("created!");
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        });
    };

    if (justRegistered) {
        return (
            <Modal show={props.showModal} onHide={props.hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thanks for submitting a beacon!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text">
                        We'll be in contact with you shortly regarding volunteers who can help out with your initative!
                    </p>
                </Modal.Body>
            </Modal>
        );
    }
    return (
        <Modal
            show={props.showModal}
            style={{ marginTop: 10 }}
            onHide={props.hideModal}
        >
            <Modal.Header closeButton>
                <Modal.Title>Submit a Beacon</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p id="regular-text">
                    Covaid empowers your organization to help more people within your community.
                    Beacons are a large-scale request for volunteers to join your cause, and Covaid can
                    help you find people interested in getting involved.
                </p>
                <p id="regular-text" style={{ fontStyle: "italic", fontWeight: 600 }}>
                    Simply fill out this form and we’ll be in contact with you shortly!
                </p>
                <Form
                    onSubmit={props.handleHide}
                    style={{
                        marginTop: 0,
                        marginBottom: 10,
                        display: "block",
                        whiteSpace: "nowrap",
                    }}
                >
                    <Form.Group controlId="org_name" bssize="large">
                        <FormControl
                            value={fields.org_name}
                            onChange={handleFieldChange}
                            placeholder="Organization Name"
                            style={{ marginBottom: 5 }}
                        />
                    </Form.Group>
                    <Form.Group controlId="org_contact" bssize="large">
                        <FormControl
                            value={fields.org_contact}
                            onChange={handleFieldChange}
                            placeholder="Organization Contact"
                            style={{ marginBottom: 5 }}
                        />
                    </Form.Group>
                    <Form.Group controlId="org_details" bssize="large">
                        <FormControl
                            value={fields.org_details}
                            onChange={handleFieldChange}
                            as="textarea"
                            rows="5"
                            placeholder="Details/Additional Info. Include # of volunteers needed, date, location, and description of volunteer work, at the least, for us to best match volunteers for your organization's need."
                        />
                    </Form.Group>
                    <Button
                        type="submit"
                        id="large-button"
                        style={{ marginTop: 15 }}
                        onClick={handleSubmit}
                    >
                        Submit Beacon
                    </Button>
                </Form>
            </Modal.Body>
            <Toast
                show={showToast}
                delay={toastTime}
                onClose={() => setShowToast(false)}
                autohide
                id="toastError"
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </Modal>
    );
}