import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { useFormFields } from "./libs/hooksLib";

export default function AdminModal(props) {
    
    const [addAdmin, setAddAdmin] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        name3: "",
        email3: ""
    });

    const newHandleSubmit = async e => {
        e.preventDefault();

        const ID = props.association._id;
        let form = {
            'associationID': ID,
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

    return (
        <>
            <Modal size="sm" show={props.adminModal} onHide={() => props.setAdminModal(false)} style = {{marginTop: 50, paddingBottom: 40}}>
                <Modal.Header closeButton>
                    <Modal.Title>Current Admins</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{paddingTop: 0}}>
                    <Row>
                        <Col xs={12}>
                            <ListGroup variant="flush">
                                {props.association.admins ? props.association.admins.map((admin, i) => {
                                    return (
                                    <ListGroup.Item key={i}>
                                        <div >
                                            <h5 className="volunteer-name">
                                                {admin.name}
                                            </h5>
                                        </div>
                                        <p style={{float: 'left', marginBottom: 0, marginTop: -2}}>
                                            {admin.email}
                                        </p>
                                    </ListGroup.Item>);
                                }) : <></>}
                            </ListGroup>
                        </Col>
                        <Col xs={12}>
                            <p id="requestCall" style={{marginTop: 0, marginBottom: 10}}></p>
                        </Col>
                        <Col xs={12}  style={{textAlign: 'center'}}>
                            <a href="#" style={{color: '#314CCE'}} onClick={() => {setAddAdmin(true); props.setAdminModal(false)}}>Add an Admin +</a>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            
            <Modal centered size="sm" show={addAdmin} onHide={() => {setAddAdmin(false); props.setAdminModal(true)}}>
                <Modal.Header closeButton style={{borderBottom: '0px solid'}}>
                    <Modal.Title>Add an Admin</Modal.Title>
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
                                <Button type="submit" id="nextPage" style={{marginTop: 0}}>Add Admin</Button>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}