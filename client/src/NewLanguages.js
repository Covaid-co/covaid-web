import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function NewLanguages(props) {

    const handleChangeLanguage = (lang) => { 
        console.log(props.languageChecked)
        props.setLanguageChecked(prev => ({ 
            ...prev,
            [lang]: !props.languageChecked[lang]
        }));
    }

    return (
        <>
            <h5 className="titleHeadings" style = {{marginTop: '8px', marginBottom: '4px'}}>
                What language do you speak?
            </h5>
            <p id="locationInfo">
                If language not listed, please mention in details section below
            </p>
            {props.languages.map((lang) => {
                return <Button key={lang}
                               id={props.languageChecked[lang] ? "selected" : "notSelected"}
                               onClick = {() => handleChangeLanguage(lang)}>
                            {lang}
                        </Button>
            })}
        </>
    );
}