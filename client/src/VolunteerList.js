import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'

import VolunteerDetails from './VolunteerDetails'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VolunteerList(props) {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Row>
                <Col xs={12}>
                    <Form>
                        <Form.Group controlId="zip" bssize="large" style={{marginTop: 10}}>
                            <Form.Control placeholder="Search for a volunteer"/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col xs={12}>
                    <p id="requestCall" style={{marginTop: 10, marginBottom: 0}}></p>
                </Col>
                <Col xs={12}>
                    <ListGroup variant="flush" onClick={() => {setModalOpen(true)}}>
                        <ListGroup.Item action style={{paddingBottom: 0}}>
                            <div >
                                <h5 className="volunteer-name">
                                    Jeffrey Li
                                </h5>
                                <i class="fa fa-angle-right fa-2x" aria-hidden="true" style={{float: 'right', marginRight: 15, marginTop: 5}}></i>
                            </div>
                            <div style={{display: 'inline-block', width: '100%'}}>
                                <p style={{float: 'left', marginBottom: 0, marginTop: -10}}>San Jose, CA</p>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <VolunteerDetails modalOpen={modalOpen} setModalOpen={setModalOpen}/>
        </>
    )
}