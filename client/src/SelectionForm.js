import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function SelectionForm(props) {

    const findCurrAssoc = (assocName) => {
        if (props.associations.length > 0) {
            return props.associations.filter(function(assoc) {
                return assoc['name'] === assocName;
            })[0];
        } else {
            return {}
        }
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
                                        const foundAssoc = findCurrAssoc(e.target.value);
                                        if (Object.keys(foundAssoc).length > 0) {
                                            props.setState({currAssoc: foundAssoc});
                                        }
                                    }}
                                    value = {props.currAssoc ? props.currAssoc['name'] : "No Association"}
                                    style = {{fontSize: 15}}>
                            {props.associations.map((assoc) => {
                                return <option style={{textIndent: 10}}>{assoc['name']}</option>;
                            })}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        );
    }
}