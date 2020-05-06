import React, {useState, useEffect} from "react";
import {translations} from './translations';
import LocalizedStrings from 'react-localization';

let translatedStrings = new LocalizedStrings({translations});

export default function OrgHeader(props) {
    const [language, setLanguage] = useState('es');
    const [loadedStrings, setLoadedStrings] = useState(false);

    useEffect(() => {
        setLoadedStrings(true);
    });

    if (!loadedStrings) {
        return <></>;
    }

    const createFormName = (assocName, assocCity) => {
        switch (language) {
            case 'en':
                return assocName + " " + translatedStrings[language].formTitle
            case 'es':
                return "Formulario de Ayuda Mutua en " + assocCity;
            default:
                break;
        }
    }

    return (
        <>
            <h1 id="small-header">{createFormName(props.assoc.name, props.assoc.city)}</h1>
            <p id="regular-text">
                {translatedStrings[language].intro}
                <a href={props.assoc.homepage} target="_blank" rel="noopener noreferrer"> {props.assoc.name}</a>.
            </p>
            <p id="regular-text">
                {translatedStrings[language].prioritizing} {props.assoc.city} {translatedStrings[language].areas}. 
            </p>
            <p id="regular-text">
                {translatedStrings[language].formManage} {props.assoc.city} {translatedStrings[language].managedBy}. 
            </p>
            <p id="regular-text">
                {translatedStrings[language].questions}:<br/>
                <strong>{props.assoc.email}</strong>
            </p>
            <p id="regular-text">
                {translatedStrings[language].motto}
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}>{translatedStrings[language].call}: 
            <br /><span id="phoneNumber">{props.assoc.phone ? props.assoc.phone : '(401) 526-8243'}</span></p>
        </>
    );
}