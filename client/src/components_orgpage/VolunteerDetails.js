import React, { useEffect, useState} from 'react';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useFormFields } from "../libs/hooksLib";
import { generateMapsURL } from '../Helpers';
import { generateURL } from '../Helpers';
import { updateAllRequests } from './OrganizationHelpers';
import PropTypes from 'prop-types';

/**
 * Volunteer Details Modal in Org portal
 */

export default function VolunteerDetails(props) {
    const [mapURL, setMapURL] = useState('');
    const [verified, setVerified] = useState(true);
    const [prevNote, setPrevNote] = useState('');
    const [statistics, setStatistics] = useState();
    const [fields, handleFieldChange] = useFormFields({
        email5: "",
        adminDetails: ''
    });

    useEffect(() => {
        if (props.currVolunteer.latlong) {
            const tempURL = generateMapsURL(props.currVolunteer.latlong[1], props.currVolunteer.latlong[0]);
            setMapURL(tempURL);
            setVerified(props.currVolunteer.preVerified);
        }
        if (props.currVolunteer.note) {
            fields.email5 = props.currVolunteer.note;
            setPrevNote(props.currVolunteer.note);
        } if (props.currVolunteer._id) {
            fetch_statistics(props.currVolunteer._id)
        }
        else {
            fields.email5 = '';
        }
    // }, [props.currVolunteer, props.show])
    }, [props.currVolunteer, props.volunteerDetailModal])

    const fetch_statistics = (id) => {
		let params = {'id': id};
		var url = generateURL( "/api/request/volunteerStatistics?", params);
		fetch(url).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    setStatistics(data)
                });
            } else {
                console.log("Error")
            }
        }).catch((e) => {
            console.log(e)
        });
	}
 
    const handleChangeVerify = (event) => {
        event.persist();
        setVerified(!verified);
        if (Object.keys(props.currVolunteer).length === 0) {
            return;
        }
        let form = {
            'user_id': props.currVolunteer._id,
            'preVerified': !verified
        };

        fetch('/api/users/update_verify', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (!response.ok) {
                alert("unable to attach");
            }
        }).catch(e => {
            alert(e);
        });
    };

    // Not currently updating all other states
    const setNotes = () =>{
        if (Object.keys(props.currVolunteer).length === 0 || prevNote === fields.email5) {
            return;
        }
        let form = {
            'user_id': props.currVolunteer._id,
            'note': fields.email5
        };

        fetch('/api/users/set_notes', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (!response.ok) {
                alert("unable to attach");
            }
        }).catch(e => {
            alert(e);
        });
    }

    const displaySwitch = () => {
        return (<Form>
                    <Form.Group controlId="preverify" bssize="large" style = {{marginBottom: 0, marginTop: 2}}>
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            style={{color: '#7F7F7F', fontSize: 14}}
                            label={verified ? "Verified": "Not Verified"}
                            checked={verified}
                            onChange={handleChangeVerify}/>
                    </Form.Group>
                </Form>);
    }

    const hidingVolunteerModal = () => {
        props.setVolunteerDetailsModal(false);
        setNotes();
        if (props.inVolunteer) {
            props.setVolunteersModal(true);
        }
        if (props.inRequest) {
            props.setRequestDetailsModal(true);
        }
        if (props.matching && props.matching[0]) {
            props.setTopMatchesModal(true);
            props.setBestMatchVolunteer(false);
        }
        if (props.matching && props.matching[1]) {
            props.setConfirmModal(true);
            props.setBestMatchVolunteer(false);
        }
    }
    if (Object.keys(props.currVolunteer).length > 0 && statistics) {
        return (
            <Modal id="volunteer-details" show={props.volunteerDetailModal} onHide={hidingVolunteerModal} style = {{marginTop: 10, paddingBottom: 40}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Volunteer Information</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: 24, paddingTop: 10}}>
                    <div id="name-details">{props.currVolunteer.first_name} {props.currVolunteer.last_name} 
                        {props.currVolunteer.availability ? 
                            <Badge aria-describedby='tooltip-bottom' id='task-info' style={{marginLeft: 8, marginTop: 0, backgroundColor: '#28a745'}}>
                                Visible
                            </Badge>
                          : <Badge aria-describedby='tooltip-bottom' id='task-info' style={{marginLeft: 8, marginTop: -4, backgroundColor: '#dc3545'}}>
                                Not visible
                            </Badge>}
                    </div>
                    {displaySwitch()}
                    <p id="regular-text-nomargin">Location: <a target="_blank" rel="noopener noreferrer" href={mapURL}>Click here</a></p>
                    <p id="regular-text-nomargin">{props.currVolunteer.email}</p>
                    <p id="regular-text-nomargin">{props.currVolunteer.phone}</p>
                    <p id="regular-text-nomargin" style={{marginTop: 14}}>Languages: {props.currVolunteer.languages ? props.currVolunteer.languages.join(', ') : ""}</p>
                    <p id="regular-text-nomargin">Neighborhoods: {props.currVolunteer.offer ? props.currVolunteer.offer.neighborhoods.join(', ') : ""}</p>
                    <p id="regular-text-nomargin">Driver: {props.currVolunteer.offer ? (props.currVolunteer.offer.car ? ' Yes': ' No') : ""}</p>
                    <h5 id="regular-text-bold" style={{marginBottom: 0, marginTop: 14}}>Volunteer Statistics:</h5>
                    <OverlayTrigger
                    placement = "left"
                    overlay={
                    <Tooltip >
                        Total requests matched all time.
                    </Tooltip>
                    }
                    >
                    <p id="regular-text-nomargin">Matched: {statistics["total"]}</p></OverlayTrigger>
                    <OverlayTrigger
                    placement = "left"
                    overlay={
                    <Tooltip >
                        Total requests completed.
                    </Tooltip>
                    }
                    >
                    <p id="regular-text-nomargin">Completed {statistics["completed"]}</p></OverlayTrigger>
                    <h5 id="regular-text-bold" style={{marginBottom: 8, marginTop: 16}}>Notes:</h5>
                    <Form>
                        <Form.Group controlId="email5" bssize="large">
                            <Form.Control as="textarea" 
                                        rows="2"
                                        placeholder="Details about this volunteer"
                                        value={fields.email5 ? fields.email5 : ''} 
                                        onChange={handleFieldChange}/>
                        </Form.Group>
                    </Form>
                    <h5 id="regular-text-bold" style={{marginBottom: 5, marginTop: 16}}>Tasks:</h5>
                    {props.currVolunteer.offer ? props.currVolunteer.offer.tasks.map((task, i) => {
                        return <Badge key={i} id='task-info'>{task}</Badge>
                    }) : ""}
                    <h5 id="regular-text-bold" style={{marginBottom: 0, marginTop: 16}}>Details:</h5>
                    <p id="regular-text-nomargin"> {props.currVolunteer.offer ? props.currVolunteer.offer.details : ""}</p>
                </Modal.Body>
            </Modal>
        );
    } else {
        return (
            <Modal id="volunteer-details" show={props.volunteerDetailModal} onHide={() => {
                    props.setVolunteerDetailsModal(false);
                    if (props.setVolunteersModal) {
                        props.setVolunteersModal(true);
                    }
                }} style = {{marginTop: 40}}>
                <Modal.Header closeButton>
                    <Modal.Title>Volunteer Information</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: 24, paddingTop: 10}}>
                    Loading...
                </Modal.Body>
            </Modal>
        );
    }
}

VolunteerDetails.propTypes = {
    currVolunteer: PropTypes.object,
    inRequest: PropTypes.bool,
    inVolunteer: PropTypes.bool,
    volunteerDetailModal: PropTypes.bool,
    setVolunteerDetailsModal: PropTypes.func,
    setVolunteersModal: PropTypes.func,
    setRequestDetailsModal: PropTypes.func,
    setTopMatchesModal: PropTypes.func,
    setBestMatchVolunteer: PropTypes.func
};