import React from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function OrgHeader(props) {
    const createFormName = (assocName, assocCity) => {
        switch (props.language) {
            case 'en':
                return assocName + " " + props.translations[props.language].formTitle
            case 'es':
                return "Formulario de Ayuda Mutua en " + assocCity;
            default:
                break;
        }
    }

    const handleLanguageChange = (language) => {
        props.changeLanguage(language);
    }

    if (props.modal) {
        return <>
            <p id="regular-text">
                After submitting a direct request, a volunteer will reach out to you shortly! If you have any problems, please contact <span id="phoneNumber">{props.assoc.email ? props.assoc.email : 'covaidco@gmail.com'}</span>.
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}> For those who would rather call in a request, 
                please call <br /><span id="phoneNumber">{props.assoc.phone ? props.assoc.phone : '(401) 526-8243'}</span></p>
        </>
    }
    return (
        <>
            <Row>
                <Col md={8}>
                    <h1 id="small-header" style={{marginTop: 4}}>{createFormName(props.assoc.name, props.assoc.city)}
                    </h1>
                </Col>
                <Col md={4}>
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
                {props.translations[props.language].intro}
                <a href={props.assoc.homepage} target="_blank" rel="noopener noreferrer"> {props.assoc.name}</a>.
            </p>
            <p id="regular-text">
                {props.translations[props.language].prioritizing} {props.assoc.city} {props.translations[props.language].areas}. 
            </p>
            <p id="regular-text">
                {props.translations[props.language].formManage} {props.assoc.city} {props.translations[props.language].managedBy}. 
            </p>
            <p id="regular-text">
                {props.translations[props.language].questions}:<br/>
                <strong>{props.assoc.email}</strong>.
            </p>
            <p id="regular-text">
                {props.translations[props.language].motto}
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}>{props.translations[props.language].call}: 
            <br /><span id="phoneNumber">{props.assoc.phone ? props.assoc.phone : '(401) 526-8243'}</span></p>
        </>
    );
}