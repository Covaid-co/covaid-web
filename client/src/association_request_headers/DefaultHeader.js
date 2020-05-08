import React from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function DefaultHeader(props) {
    const handleLanguageChange = (language) => {
        props.changeLanguage(language);
    }

    if (props.modal) {
        return <>
            <p id="regular-text">
                {props.requestHeaderText}
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}> For those who would rather call in a request, 
                please call <br /><span id="phoneNumber">(401) 526-8243</span></p>
        </>
    }

    return (
        <>
            <Row>
                <Col xs={9} sm={8}>
                    <h1 id="small-header" style={{marginTop: 4}}>{props.translations[props.language].RequestSupport} 
                    </h1>
                </Col>
                <Col xs={3} sm={4}>
                    <Button id={props.language === 'en' ? "selected" : "notSelected"}
                            onClick = {() => handleLanguageChange('en')}>
                            English
                    </Button>
                    <Button id={props.language === 'es' ? "selected" : "notSelected"}
                            onClick = {() => handleLanguageChange('es')}>
                            Español
                    </Button>
                </Col>
            </Row>
            <p id="requestCall" style={{marginTop: 15, marginBottom: 10}}></p>
            <p id="regular-text">
                {props.requestHeaderText}
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}>{props.translations[props.language].call}:<br /><span id="phoneNumber">(401) 526-8243</span></p>
        </>
    );
}