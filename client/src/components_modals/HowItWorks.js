import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from 'react-localization';
import {translations} from '../translations/translations';

let translatedStrings = new LocalizedStrings({translations});

export default function HowItWorks(props) {
    const [language, setLanguage] = useState("en")

    useEffect(() => {
        if (props.switchToLanguage === "Español") {
            setLanguage("es")
        } else {
            setLanguage("en")
        }
        
    }, [props.switchToLanguage]);

    const [requester, setRequester] = useState(true);

    return (
        <Modal size="lg" show={props.showModal} style={{marginTop: 10}} onHide={props.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{translatedStrings[language].FAQs}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{paddingLeft: 5, paddingRight: 0}}>
                <Container id="volunteer-info" style={{maxWidth: 2000, marginLeft: 0, marginRight: 0, color: 'black'}}>
                    <Row>
                        <Col xs="12">
                            <p id="regular-text" style={{marginTop: 10, marginBottom: 25}}>{translatedStrings[language].FAQs_Text1}</p>
                        </Col>
                        <Col xs="12">
							<Container style={{padding: 0,  marginLeft: 0}}>
								<Button id={requester ? 'tab-button-selected' : 'tab-button'} onClick={()=>setRequester(true)}>{translatedStrings[language].FAQs_Requester}</Button>
								<Button id={!requester ? 'tab-button-selected' : 'tab-button'} onClick={()=>setRequester(false)}>{translatedStrings[language].FAQs_Volunteer}</Button>
							</Container>
                            <Container id="requester-tab" style={requester ? {'display': 'block'} : {'display': 'none'}}>
                                <h5 id="header" style={{marginBottom: 3}}>{translatedStrings[language].FAQs_Text2}</h5>
                                <p style={{fontSize: 14, marginTop: 0}}>{translatedStrings[language].FAQs_Text3}</p>
                                <h5 id="header" style={{marginBottom: 3, marginTop: 18}}>{translatedStrings[language].FAQs_Text4}</h5>
                                <p style={{fontSize: 14, marginTop: 0}}>{translatedStrings[language].FAQs_Text5}</p>
                                <h5 id="header" style={{marginBottom: 3, marginTop: 18}}>{translatedStrings[language].FAQs_Text6}</h5>
                                <p style={{fontSize: 14, marginTop: 0}}>{translatedStrings[language].FAQs_Text7}</p>
                                <h5 id="header" style={{marginBottom: 3, marginTop: 18}}>{translatedStrings[language].FAQs_Text8}</h5>
                                <p style={{fontSize: 14, marginTop: 0}}>{translatedStrings[language].FAQs_Text9}</p>
                                <h5 id="header" style={{marginBottom: 3, marginTop: 18}}>{translatedStrings[language].FAQs_Text10}</h5>
                                <p style={{fontSize: 14, marginTop: 0}}>{translatedStrings[language].FAQs_Text11}</p>
							</Container>
    
                            <Container id="requester-tab" style={requester ? {'display': 'none'} : {'display': 'block'}}>
                                <h5 id="header" style={{marginBottom: 3}}>{translatedStrings[language].FAQs_Text12}</h5>
                                <p style={{fontSize: 14, marginTop: 0, marginLeft: 14}}>
                                    {translatedStrings[language].FAQs_Text13}<br/>
                                    {translatedStrings[language].FAQs_Text14}<br/>
                                    {translatedStrings[language].FAQs_Text15} <br/>
                                    {translatedStrings[language].FAQs_Text16}
                                </p>
                                <h5 id="header" style={{marginBottom: 3, marginTop: 18}}>{translatedStrings[language].FAQs_Text17}</h5>
                                <p style={{fontSize: 14, marginTop: 0}}>{translatedStrings[language].FAQs_Text18}</p>
                                <h5 id="header" style={{marginBottom: 3, marginTop: 18}}>{translatedStrings[language].FAQs_Text19}</h5>
                                <p style={{fontSize: 14, marginTop: 0}}>{translatedStrings[language].FAQs_Text20}</p>
                                <h5 id="header" style={{marginBottom: 3, marginTop: 18}}>{translatedStrings[language].FAQs_Text21}</h5>
                                <p style={{fontSize: 14, marginTop: 0}}>{translatedStrings[language].FAQs_Text22}</p>
                                <h5 id="header" style={{marginBottom: 3, marginTop: 18}}>{translatedStrings[language].FAQs_Text23}</h5>
                                <p style={{fontSize: 14, marginTop: 0}}>{translatedStrings[language].FAQs_Text24}</p>
							</Container>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}
