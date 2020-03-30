import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function NewHasCar(props) {

    return (
        <>
            <h5 className="titleHeadings" style = {{marginTop: '26px', marginBottom: '0px'}}>
                Can you drive?
            </h5>
            <Row>
                <Col xs={6} style = {{padding: 0, paddingLeft: 15}}>
                    <Button id={props.hasCar ? 'leftCarButtonPressed' : 'leftCarButton'}
                            onClick={() => props.setHasCar(true)}>
                        Yes
                    </Button>
                </Col>
                <Col xs={6} style = {{padding: 0, paddingRight: 15}}>
                    <Button id={props.hasCar ? 'rightCarButton' : 'rightCarButtonPressed'}
                            onClick={() => props.setHasCar(false)}>
                        No
                    </Button>
                </Col>
            </Row>
        </>
    );
}