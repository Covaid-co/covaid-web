import React from 'react';
import { useFormFields } from "../libs/hooksLib";
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl'

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

/**
 * Submitting an update for covaid
 */

export default function ChangeLog() {
    const [fields, handleFieldChange] = useFormFields({
        date_field: "",
        features_field: "",
        improvements_field: "",
        fixes_field: ""
    });

    const handleSubmit = async e => {
        e.preventDefault();
        const features = fields.features_field.split("\n");
        const improvements = fields.improvements_field.split("\n");
        const fixes = fields.fixes_field.split("\n");

        let form = {
            'date': fields.date_field,
            'features': features[0] === "" ? [] : features,
            'improvements': improvements[0] === "" ? [] : improvements,
            'fixes': fixes[0] === "" ? [] : fixes,
        };

        fetch('/api/changelog/add_log', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("Successfully added");
            } else {
                console.log("Not successful");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    return ([
        <div className="App" key="1">
            <NavBar isLoggedIn={false} totalVolunteers={0} orgPortal={true}/>
            <Container style={{maxWidth: 1500}}>
                <Row>
                    <Col lg={3} md={2} sm={0}></Col>
                    <Col lg={6} md={8} sm={12}>
                        <Form style={{marginTop: 0, marginBottom: 10, display: "block", whiteSpace: 'nowrap'}}>
                            <Form.Group controlId="date_field" bssize="large">
                                <FormControl value={fields.date_field} onChange={handleFieldChange} placeholder="Date" style={{marginBottom: 5}}/>
                            </Form.Group>
                            <Form.Group controlId="features_field" bssize="large">
                                <FormControl value={fields.features_field} onChange={handleFieldChange} 
                                             as="textarea" rows="5" placeholder="Features"/>
                            </Form.Group>
                            <Form.Group controlId="improvements_field" bssize="large">
                                <FormControl value={fields.improvements_field} onChange={handleFieldChange} 
                                             as="textarea" rows="5" placeholder="Improvements"/>
                            </Form.Group>
                            <Form.Group controlId="fixes_field" bssize="large">
                                <FormControl value={fields.fixes_field} onChange={handleFieldChange} 
                                             as="textarea" rows="5" placeholder="Fixes"/>
                            </Form.Group>
                            <Button type="submit" id="large-button" style={{marginTop: 15}} onClick={handleSubmit}>
                                Submit Changelog
                            </Button>
                        </Form>
                    </Col>
                    <Col lg={3} md={2} sm={0}></Col>
                </Row>
            </Container>
        </div>,
        <Footer key="2"/>
    ]);
}