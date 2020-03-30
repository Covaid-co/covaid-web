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
            <Row>
                <Col xs={12}>
                    <Form.Group controlId="payment" bssize="large">
                        <Form.Control as="select"
                                id="orgSelect"
                                onChange={(e) => {
                                    e.persist();
                                    var id = findCurrentAssocID();
                                    props.setState(prev => ({
                                        ...prev,
                                        associations: {
                                            ...prev.associations,
                                            id: false
                                        }
                                    }));
                                    const assoc = e.target.value;
                                    id = findIDFromAssoc(assoc);
                                    props.setState(prev => ({
                                        ...prev,
                                        associations: {
                                            ...prev.associations,
                                            id: true
                                        }
                                    }));
                                }}
                                value = {props.associationNames[findCurrentAssocID()]}
                                style = {{fontSize: 15}}>
                            {Object.keys(props.associations).map((assocID) => {
                                return <option style={{textIndent: 10}}>{props.associationNames[assocID]}</option>;
                            })}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        );
    }
}