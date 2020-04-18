import React, {useState} from 'react';
import { useFormFields } from "./libs/hooksLib";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function OrgResourcesModal(props) {

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [fields, handleFieldChange, setFields] = useFormFields({
        resourceName: "",
        resourceLink: ""
    });

    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    const validSubmission = () => {
        var valid = true;
        if (Object.keys(props.association).length === 0) {
            setToastMessage('No Association');
            valid = false;
        }

        if (fields.resourceName === "") {
            setToastMessage('No resource name provided');
            valid = false;
        }

        if (fields.resourceLink === "") {
            setToastMessage('No resource link provided');
            valid = false;
        }

        if (!validURL(fields.resourceLink)) {
            setToastMessage('Not a valid resource URL');
            valid = false;
        }

        return valid;
    }

    const submitResource = () => {
        if (!validSubmission()) {
            setShowToast(true);
            return;
        }

        let form = {
            'associationID': props.association._id,
            'link': fields.resourceLink,
            'name': fields.resourceName
        };

        fetch('/api/association/addLink', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    var currLinks = [...props.association.links];
                    currLinks.push({'_id': data, 'link': fields.resourceLink, 'name': fields.resourceName});
                    props.setAssociation({
                        ...props.association,
                        'links': currLinks
                    })
                    setToastMessage('Submitted!');
                    setShowToast(true);
                    setFields({
                        resourceName: "",
                        resourceLink: ""
                    })
                });
            } else {
                alert("Unable to upload");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const deleteResource = (id) => {
        console.log(id)
        let form = {
            'id': props.association._id
        }
        fetch('/api/association/' + id + '/deletelink', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                var currLinks = [...props.association.links];
                currLinks = currLinks.filter(currLink => currLink._id !== id);
                props.setAssociation({
                    ...props.association,
                    'links': currLinks
                })
                setToastMessage('Deleted!');
                setShowToast(true);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    return (
        <Modal show={props.resourceModal} onHide={() => props.setResourceModal(false)} style = {{marginTop: 10, paddingBottom: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>Add a resource</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={12}>
                        <Form>
                            <Form.Group controlId="resourceName" bssize="large" style={{marginTop: 0}}>
                                <Form.Control placeholder="Name of resource" value={fields.resourceName} onChange={handleFieldChange}/>
                            </Form.Group>
                            <Form.Group controlId="resourceLink" bssize="large" style={{marginTop: 5}}>
                                <Form.Control placeholder="Resource link (https://www.example.com) " value={fields.resourceLink} onChange={handleFieldChange}/>
                            </Form.Group>
                            <Button style={{marginTop: 5}} id="large-button-empty" onClick={()=>submitResource()}>Submit Resource</Button>
                        </Form>
                    </Col>
                    <Col xs={12}>
                        <Modal.Title style={{fontSize: 22, marginTop: 20}}>Current Resources</Modal.Title>
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 15}}>&nbsp;</p>
                        {props.association.links ? props.association.links.map((resource,i) => {
                            return (
                            <>
                                <a target="_blank" id="regular-text" rel="noopener noreferrer" key={i} href={resource.link} style={{color: '#2670FF'}}>
                                    {resource.name}
                                </a> 
                                <Button style={{backgroundColor: "Transparent", border: "none"}} onClick={() => deleteResource(resource._id)}>
                                    <FontAwesomeIcon style={{color: "red"}} icon={faTimes} /> 
                                </Button>
                                <br />
                            </>
                            )
                        }) : <></>}
                    </Col>
                </Row>
            </Modal.Body>
            <Toast show={showToast} delay={3000} onClose={() => setShowToast(false)} autohide id='toastError'>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </Modal>
    );
}