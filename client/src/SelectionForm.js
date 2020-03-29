import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function SelectionForm(props) {

    const findIDFromAssoc = (assoc) => {
        return Object.keys(props.associationNames).filter(function(id) {
            return props.associationNames[id] == assoc;
        })[0];
    }

    const findCurrentAssocID = () => {
        return Object.keys(props.associations).filter(function(id) {
            return props.associations[id];
        })[0];
    }

    if (Object.keys(props.associations).length === 0) {
        return (<></>);
    } else {
        return (
            <Row style = {{marginRight: -25, marginLeft: -25, marginBottom: 0, marginTop: 10}}>
                <Col md={12}>
                    <Form.Label style = {{marginBottom: -5}}><h4>Association *</h4></Form.Label>
                    <p style = {{fontWeight: 300, 
                                fontStyle: 'italic', 
                                fontSize: 13,
                                marginBottom: 5}}>Select an organization you would like to volunteer with</p>

                    <Form.Group controlId="payment" bssize="large">
                        <Form.Control as="select"
                                onChange={(e) => {
                                    e.persist();
                                    var id = findCurrentAssocID();
                                    props.setAssociations(prev => ({ 
                                        ...prev,
                                        [id]: false,
                                    }));

                                    const assoc = e.target.value;
                                    id = findIDFromAssoc(assoc);
                                    props.setAssociations(prev => ({ 
                                        ...prev,
                                        [id]: true,
                                    }));
                                }}
                                value = {props.associationNames[findCurrentAssocID()]}
                                style = {{fontSize: 13}}>
                            {Object.keys(props.associations).map((assocID) => {
                                return <option>{props.associationNames[assocID]}</option>;
                            })}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        );
    }
}