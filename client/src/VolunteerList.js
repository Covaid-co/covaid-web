import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

import VolunteerDetails from './VolunteerDetails'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VolunteerList(props) {

    const [modalOpen, setModalOpen] = useState(false);

    // useEffect(() => {
    //     var url = "/api/user/allfromassoc?";
    //     let params = {
    //         'association': props.association._id
    //     }
    //     let query = Object.keys(params)
    //          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    //          .join('&');
    //     url += query;
    //     console.log(url)

    //     fetch(url, {
    //         method: 'get',
    //         headers: {'Content-Type': 'application/json'},
    //     }).then((response) => {
    //         if (response.ok) {
    //             response.json().then(data => {
    //                 setRequests(data);
    //                 console.log(data);
    //                 setFilteredRequests(data);
    //             });
    //         } else {
    //             console.log("Error");
    //         }
    //     }).catch((e) => {
    //         console.log(e)
    //     });
    // }, [props.association])

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
