import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal' 
import VolunteerActionConfirmationModal from './VolunteerActionConfirmationModal'
import fetch_a from '../util/fetch_auth'

export default function RequestInfo(props) {

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [title, setTitle] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [action, setAction] = useState('');
    const [buttonColor, setButtonColor] = useState('');

    const showReject = () => {
        setShowConfirmationModal(true);
        props.setModalOpen(false)
        setTitle("Confirmation");
        setConfirmation("Are you sure you want to reject this request?")
        setAction('reject');
        setButtonColor("#DB4B4B")
    }
    const showComplete = () => {
        setShowConfirmationModal(true);
        props.setModalOpen(false)
        setTitle("Confirmation");
        setConfirmation("Confirm that you've completed this request");
        setAction('complete');
        setButtonColor("#28a745")
    }

    useEffect(() => {
        var tempURL = "https://www.google.com/maps/@";
        if (props.currRequest.latitude && props.currRequest.longitude) {
            tempURL += props.currRequest.latitude + ',';
            tempURL += props.currRequest.longitude + ',15z';
        }
        setMapURL(tempURL);
    }, [props.currRequest])

    const [mapURL, setMapURL] = useState('');

    const reject = () => {
        console.log("attached");
        props.setModalOpen(false)
        props.rejectRequest();
    }

    const accept = () => {
        var url = "/api/request/acceptRequest?";
        let params = {
            'ID' : props.currRequest._id
        }
        let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
        url += query;
        fetch_a('token', url)
        .then((response) => {
            console.log("Successful")
            props.setModalOpen(false)
            props.acceptRequest()
        })
        .catch((error) => {
          console.error(error);
        });
    }

    const complete = () => {
        console.log("attached");
        props.setModalOpen(false)
        props.completeARequest()
    } 

    var header = <></>
    var contactInfo = <>
        <h5 id="regular-text-bold" style={{marginBottom: 3, marginTop: 0}}>Who:</h5>
        <p id="regular-text-nomargin"> {props.currRequest.requester_first}</p>
        <h5 id="regular-text-bold" style={{marginBottom: 3, marginTop: 16}}>Contact:</h5>
        <p id="regular-text-nomargin">{props.currRequest.requester_email} {props.currRequest.requester_phone}</p>
    </>
    var timeSpecific = <>
        <h5 id="regular-text-bold" style={{marginBottom: 3, marginTop: 16}}>Needed by:</h5>
        <p id="regular-text-nomargin">{props.currRequest.time} of {props.currRequest.date}</p>
        <h5 id="regular-text-bold" style={{marginBottom: 3, marginTop: 16}}>Location:</h5>
        <p id="regular-text-bold"><a target="_blank" rel="noopener noreferrer" href={mapURL}>Click here</a></p>
    </>
    var buttons = <></> 
    if (props.modalMode === 1) {
        header = <Modal.Title id="small-header">New pending request</Modal.Title>
        contactInfo = <></>
        buttons =
        <Row style={{marginTop: 15}}>
            <Col xs={6} style = {{padding: 0, paddingLeft: 15, paddingRight: 4}}>
                <Button onClick={showReject} id='large-button-empty' style={{borderColor: '#DB4B4B', color: '#DB4B4B'}}>Reject this request</Button>
            </Col>
            <Col xs={6} style = {{padding: 0, paddingLeft: 15, paddingRight: 4}}>
                <Button onClick={accept} id='large-button-empty' style={{borderColor: '#28a745', color: '#28a745'}}>Accept this request</Button>
            </Col>
        </Row>
    } else if (props.modalMode === 2) {
        header = <Modal.Title id="small-header">Request is in-progress</Modal.Title>
        buttons = <Row style={{marginTop: 15}}>
                    <Col xs={6} style = {{padding: 0, paddingLeft: 15, paddingRight: 4}}>
                        <Button onClick={showReject} id='large-button-empty' style={{borderColor: '#DB4B4B', color: '#DB4B4B'}}>Cancel this request</Button>
                    </Col>
                    <Col xs={6} style = {{padding: 0, paddingLeft: 15, paddingRight: 4}}>
                        <Button onClick={showComplete} id='large-button-empty' style={{borderColor: '#28a745', color: '#28a745'}}>Complete this request</Button>
                    </Col>
                </Row>
    } else if (props.modalMode === 3) {
        header = <Modal.Title id="small-header">Completed request</Modal.Title>
        timeSpecific = <></>
    }

    const adminDetails = () => {
        if ((props.modalMode === 2 || props.modalMode == 1) && props.currRequest.adminMessage && props.currRequest.adminMessage.length > 0) {
            return (
                <>
                <h5 id="regular-text-bold" style={{marginBottom: 3, marginTop: 16}}>Message from your mutual aid group:</h5>
                <p id="regular-text-nomargin">"{props.currRequest.adminMessage}"</p></>
            );
        }
        else return <></>
    }

    return (
        <>
            <Modal show={props.modalOpen} onHide={() => {props.setModalOpen(false)}} style = {{marginTop: 40}}>
                <Modal.Header closeButton>
                    {header}
                </Modal.Header>
                <Modal.Body>
                    {contactInfo}
                    <h5 id="regular-text-bold" style={{marginBottom: 3, marginTop: (props.modalMode === 1 ? 0 : 16)}}>Details:</h5>
                    <p id="regular-text-nomargin"> {props.currRequest.details}</p>
                    {adminDetails()}
                    <h5 id="regular-text-bold" style={{marginBottom: 3, marginTop: 16}}>Requesting support with:</h5>
                    {props.currRequest.resource_request ? 
                        props.currRequest.resource_request.map((task, i) => {
                            return <Badge key={i} id='task-info'>{task}</Badge>
                        }) : <></>
                    }

                    {timeSpecific}
                    {buttons}
                </Modal.Body>
            </Modal>
            <VolunteerActionConfirmationModal 
                showModal={showConfirmationModal} 
                setShowConfirmationModal={setShowConfirmationModal} 
                confirmation={confirmation} 
                title={title} 
                setOriginalModal={props.setModalOpen}
                action={action}
                complete={complete}
                reject={reject}
                buttonColor={buttonColor}
                currRequest={props.currRequest}
                />
        </>
    );
}