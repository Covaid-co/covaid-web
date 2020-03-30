import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { useFormFields } from "./libs/hooksLib";

import SelectionForm from './SelectionForm';

export default function LocationSetting(props) {

    const [fields, handleFieldChange] = useFormFields({
        locationString: ""
    });

    const handleSubmit = async e => {
        e.preventDefault();
        e.stopPropagation();
        console.log(e.target.value);
        console.log("submitting");
    }

    return (
        <Container style={{color: 'black'}}>
            <h1 id="jumboHeading" style={{fontSize: 24, marginBottom: 1}}>See who's helping in {props.state.locality}</h1>
            <p id="helpText">Click an offer below for more info.</p>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col sm={6}>
                        {/* <Form.Group controlId="first_name" bssize="large">
                            <Form.Control value={fields.locationString} onChange={handleFieldChange} placeholder="City/Zip Code: 19426" />
                        </Form.Group> */}
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="City/Zip Code: 19426" 
                                aria-label="City/Zip Code: 19426"
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" type="submit">Button</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <SelectionForm associations={props.state.associations}
                                        setState={props.setState}
                                        currAssoc={props.state.currAssoc}/>
                    </Col>
                    <Col xs={12}>
                        <p id="requestCall" style={{marginTop: 20, marginBottom: 20}}></p>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}