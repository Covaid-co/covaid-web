import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'

export default function Languages(props) {

    const handleChangeLanguage = (event, lang) => { 
        props.setLanguageChecked(prev => ({ 
            ...prev,
            [lang]: !props.languageChecked[lang]
        }));
    }

    return (
        <Form.Group controlId="language" bssize="large" style = {{marginBottom: 30}}>
            <Form.Label style = {{marginBottom: 0, color: "black"}}><h3>Languages</h3></Form.Label>
            <p style = {{fontWeight: 300, fontStyle: 'italic'}} id="createAccountText">Which are you comfortable speaking. Check all that apply.</p>
            {props.languages.map((lang) => {
                return <Form.Check key={lang} 
                                id={lang}
                                type = "checkbox" 
                                label = {lang}
                                onChange = {(evt) => { handleChangeLanguage(evt, lang) }}
                                checked = {props.languageChecked[lang]} 
                                style = {{fontSize: 14, marginTop: 2, color: "black"}}/>
            })}
        </Form.Group>
    );
    
}