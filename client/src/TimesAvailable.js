import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'

export default function TimesAvailable(props) { 

    const handleChangeTime = (e, time) => {
        props.setTimes(prev => ({ 
            ...prev,
            [time]: !props.times[time],
        }));
    }

    return (
        <Form.Group controlId="payment" bssize="large" style = {{marginBottom: 30}}>
            <Form.Label style = {{marginBottom: 0}}><h3>Times</h3></Form.Label>
            <p style = {{fontWeight: 300, fontStyle: 'italic'}}>What general times are you available to help</p>
            {Object.keys(props.times).map(function(time) {
                return  <Form.Check key={time} 
                                    type = "checkbox" 
                                    label = {time}
                                    onChange = {(evt) => { handleChangeTime(evt, time) }}
                                    checked = {props.times[time]} 
                                    style = {{fontSize: 14, marginTop: 1}}/>
            })}
        </Form.Group>
    );
}