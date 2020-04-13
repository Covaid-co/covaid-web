import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

export default function NewLanguages(props) {

    const handleChangeLanguage = (lang) => { 
        props.setLanguageChecked(prev => ({ 
            ...prev,
            [lang]: !props.languageChecked[lang]
        }));
    }

    return (
        <>
            {props.languages.map((lang, i) => {
                return <Button key={lang + i}
                               id={props.languageChecked[lang] ? "task-info-selected" : "task-info-not-selected"}
                               onClick = {() => handleChangeLanguage(lang)}>
                            {lang}
                        </Button>
            })}
        </>
    );
}