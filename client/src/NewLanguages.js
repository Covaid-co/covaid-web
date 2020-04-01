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
            {props.languages.map((lang) => {
                return <Button key={lang}
                               id={props.languageChecked[lang] ? "task-info-selected" : "task-info-not-selected"}
                               onClick = {() => handleChangeLanguage(lang)}>
                            {lang}
                        </Button>
            })}
        </>
    );
}