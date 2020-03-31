import React, {useState} from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function LocationSetting(props) {
    return (
        <>
        <Row>
            <Col lg={4} md={6} sm={6}>
                <p id="requestCall" style={{marginTop: 20, marginBottom: 20}}></p>
            </Col>
        </Row>
        <Row>
            <Col lg={4} md={6} sm={6}>
                <p style={{marginTop: -8}}className="volunteer-location">This city is supported by:</p>
                {props.associations.map((association, i) => {                
                    return <p key={i} style={{marginTop: -8, color: '#194bd3'}} className="volunteer-location">{association.name}</p>   
                })}
            </Col>
        </Row>
        <Row>
            <Col lg={4} md={6} sm={6}>
                <p id="requestCall" style={{marginTop: 12, marginBottom: 20}}></p>
            </Col>
        </Row>
        </>
    );
}