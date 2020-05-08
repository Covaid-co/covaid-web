import React from "react";
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form'

export default function HelpOrganization(props) {

    const assocName = (assoc) => {
        if (assoc) {
            if (Object.keys(assoc).length === 0) {
                return "Covaid"
            } else {
                return assoc.name;
            }
        }
        return "Covaid";
    }

    return (
        <Form.Group controlId="helpDetails" bssize="large" style = {{marginBottom: 0, marginTop: 0}}>
            <h5 id="regular-text-bold" style = {{marginTop: 0, marginBottom: 5}}>
                Can you help {assocName(props.currentAssoc)}?
            </h5>
            <p style={{fontSize: 14, marginBottom: 7}} id="regular-text">
                We are always looking for volunteers to join the team! If you can help with finding volunteers for 
                those in need of support, please check the box and fill out more details if you would like.
            </p>
            <Form.Check type = "checkbox" id="regular-text" label = "I can help with finding volunteers!" checked = {props.canHelp} 
                onChange = {() => { props.setCanHelp(!props.canHelp) }} style = {{fontSize: 12, color: 'black', marginBottom: 5}}/>
            {props.canHelp ?
                <Form.Control as="textarea" rows="3" value={props.helpDetails} onChange={props.handleFieldChange}
                        placeholder="Any other information you would like us to know?"/> : 
                <></>}
        </Form.Group>
    )
}

HelpOrganization.propTypes = {
    currentAssoc: PropTypes.object,
    canHelp: PropTypes.bool,
    setCanHelp: PropTypes.func,
    helpDetails: PropTypes.string,
    handleFieldChange: PropTypes.func
}