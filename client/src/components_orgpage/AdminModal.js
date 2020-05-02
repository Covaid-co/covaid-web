import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { useFormFields } from "../libs/hooksLib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { generateURL, convertTime } from '../Helpers'

export default function AdminModal(props) {
    
    const [addAdmin, setAddAdmin] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        name3: "",
        email3: ""
    });

    const newHandleSubmit = async e => {
        e.preventDefault();
        let form = {
            'associationID': props.association._id,
            'email': fields.email3,
            'name': fields.name3
        };

        fetch('/api/association/admins', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                setAddAdmin(false);
                props.setAdminModal(true);
                var currAdmins = [...props.association.admins];
                currAdmins.push({'email': fields.email3, 'name': fields.name3});
                props.setAssociation({
                    ...props.association,
                    'admins': currAdmins
                })
                fields.email3 = "";
                fields.name3 = "";
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const exportVolunteers = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        let params = {'association': props.association._id}
				var url = generateURL("/api/users/allFromAssoc?", params);
				fetch(url, {
					method: 'get',
					headers: {'Content-Type': 'application/json'},
				}).then((response) => {
					if (response.ok) {
						response.json().then(volunteers => {
                            var d = new Date();
                            const reformattedVolunteers = volunteers.map(volunteer => {
                                return {
                                    'First Name': volunteer.first_name,
                                    'Last Name': volunteer.last_name,
                                    'Pronouns': volunteer.pronouns,
                                    'Email': volunteer.email,
                                    'Phone': volunteer.phone,
                                    'More Info': volunteer.offer.details,
                                    'Neighborhoods': volunteer.offer.neighborhoods.join(", "),
                                    'Resources': volunteer.offer.tasks.join(", "),
                                    'Internal Note': volunteer.note
                                };
                            })
                            const fileName = 'volunteers-' + d.toLocaleDateString();
                            const ws = XLSX.utils.json_to_sheet(reformattedVolunteers);
                            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                            const data = new Blob([excelBuffer], {type: fileType});
                            FileSaver.saveAs(data, fileName + fileExtension);
						});
					} else {
						console.log(response);
					}
				}).catch((e) => {
					console.log(e);
				});
    }

    const exportRequests = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        let params = {'association': props.association._id}
        var url = generateURL( "/api/request/allRequestsInAssoc?", params);

        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.ok) {
                response.json().then(requests => {
                    var d = new Date();
                    const reformattedRequests = requests.map(request => {
                        if (!request.delete) {
                            return {
                                'Name': request.requester_first,
                                'Email': request.requester_email,
                                'Phone': request.requester_phone,
                                'Resource Request': request.resource_request.join(", "),
                                'Details': request.details,
                                'Time Created': request.time_posted,
                            };
                        }
                    })
                    const fileName = 'requests-' + d.toLocaleDateString();
                    const ws = XLSX.utils.json_to_sheet(reformattedRequests);
                    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    const data = new Blob([excelBuffer], {type: fileType});
                    FileSaver.saveAs(data, fileName + fileExtension);
                });
            } else {
                console.log("Error");
            }
        }).catch((e) => {
            console.log(e);
        });

    }

    return (
        <>
            <Modal size="md" show={props.adminModal} onHide={() => props.setAdminModal(false)} style = {{marginTop: 10, paddingBottom: 40}}>
                <Modal.Header closeButton>
                    <Modal.Title style={{marginLeft: 5}}>Current Admins</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{paddingTop: 0}}>
                    <Row>
                        <Col xs={12}>
                            <ListGroup variant="flush" style={{overflowY: "scroll", height: 300}}>
                                {props.association.admins ? props.association.admins.map((admin, i) => {
                                    return (
                                    <ListGroup.Item key={i}>
                                        <h5 id="volunteer-name">{admin.name}</h5>
                                        <p id="regular-text" style={{marginBottom: 0}}>{admin.email}</p>
                                    </ListGroup.Item>);
                                }) : <></>}
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
                    <Modal.Title style={{marginLeft: 5}}>Export to file</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={6}>
                            <Button id="large-button" onClick={exportVolunteers}>Volunteers <FontAwesomeIcon icon={faFileExcel} /></Button>
                        </Col>
                        <Col xs={6}>
                            <Button id="large-button" style={{backgroundColor: "#DB4B4B", borderColor: '#DB4B4B'}} onClick={exportRequests}>Requests <FontAwesomeIcon icon={faFileExcel} /></Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            
            <Modal centered size="sm" show={addAdmin} onHide={() => {setAddAdmin(false); props.setAdminModal(true)}}>
                <Modal.Header closeButton style={{borderBottom: '0px solid'}}>
                    <Modal.Title id="small-header" style={{marginLeft: 5}}>Add an Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{paddingTop: 0}}>
                    <Row>
                        <Col xs={12}>
                            <Form onSubmit={newHandleSubmit}>
                                <Form.Group controlId="name3" bssize="large">
                                    <Form.Control value={fields.name3} placeholder="Name" onChange={handleFieldChange} />
                                </Form.Group>
                                <Form.Group controlId="email3" bssize="large" style={{marginTop: 5}}>
                                    <Form.Control value={fields.email3} placeholder="Email" onChange={handleFieldChange} />
                                </Form.Group>
                                <Button type="submit" id="large-button" style={{marginTop: 0}}>Add Admin</Button>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}