import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal'

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from 'react-localization';
import {translations} from '../translations/translations';

let translatedStrings = new LocalizedStrings({translations});

export default function AboutUs(props) {
    const [language, setLanguage] = useState("en")

    useEffect(() => {
        if (props.switchToLanguage === "Español") {
            setLanguage("es")
        } else {
            setLanguage("en")
        }
    }, [props.switchToLanguage]);

    return (

        <Modal show={props.showModal} style={{marginTop: 60}} onHide={props.hideModal}>
            <Modal.Header closeButton>
            <Modal.Title>{translatedStrings[language].AboutUs}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p id="regular-text">{translatedStrings[language].AboutUs_Text1}
                </p>
                <p id="regular-text">
                    {translatedStrings[language].AboutUs_Text2}<strong><font id="home" style={{fontSize: 18}}> covaid</font></strong>
                    {translatedStrings[language].AboutUs_Text3}
                </p>
                <p id="regular-text">
                    <strong>{translatedStrings[language].AboutUs_Question}</strong> {translatedStrings[language].AboutUs_Email} covaidco@gmail.com
                </p>
            </Modal.Body>
        </Modal>
    );
}
