import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'

import RequestDetails from './RequestDetails'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VolunteerRequests(props) {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Row>
                <Col xs={12}>
                    <Form>
                        <Form.Group controlId="zip" bssize="large" style={{marginTop: 10}}>
                            <Form.Control placeholder="Search through your requests"/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col xs={12}>
                    <p id="requestCall" style={{marginTop: 10, marginBottom: 0}}></p>
                </Col>
                <Col xs={12}>
                    <ListGroup variant="flush" onClick={() => {setModalOpen(true)}}>
                        <ListGroup.Item action>
                            <div >
                                <h5 className="volunteer-name">
                                    Jeffrey Li
                                </h5>
                            </div>
                            <div style={{display: 'inline-block', width: '100%'}}>
                                <p style={{float: 'left', marginBottom: 0}}>Needed by: Jan 2, 2020</p>
                                <Badge id="request-status">Action Needed</Badge>
                                {/* <i class="fa fa-angle-right fa-5x" aria-hidden="true" style={{float: 'right'}}></i> */}
                            </div>
                            <div>
                                <Badge className='task-info'>Medication</Badge>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <RequestDetails modalOpen={modalOpen} setModalOpen={setModalOpen}/>
        </>
    )
}