import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function CitySupport(props) {

    const citySupportedBy = (screen) => {
        var float = "left";
        if (screen === 'tablet') {
            float = "right";
        }
        return <div style={{marginTop: -8, float: float, color: '#797979'}}className="volunteer-location">
                    This city is supported by:<br/> 
                    {props.associations.map((association, i) => {                
                        return <div key={i}>
                                    <a href={association.homepage} target="_blank" rel="noopener noreferrer" 
                                        style={{float: 'left', color: '#4B81EC', marginBottom: 0}} className="volunteer-location">
                                        {association.name}</a><br /> 
                                </div>
                    })}
                    <p style={{float: 'left', color: '#4B81EC'}} className="volunteer-location">Covaid.co</p> 
                </div>
    }

    return (
        <>
            <Row>
                <Col md={6} sm={6} id="city-support-text-tablet">
                    {citySupportedBy('tablet')}
                </Col>
            </Row>
            <Row id="web-separate">
                <Col lg={4} md={6} sm={6} xs={12}>
                    <p id="requestCall" style={{marginBottom: 40}}></p>
                    {citySupportedBy('web')}
                </Col>
            </Row>
            <Row id="mobile-tablet-separate">
                <Col lg={12} md={12}>
                    <p id="requestCall" style={{marginTop: 20, marginBottom: 20}}></p>
                </Col>
            </Row>
            <Row id="mobile-org">
                <Col md={12}>
                    {citySupportedBy()}
                </Col>
            </Row>
        </>
    );
}