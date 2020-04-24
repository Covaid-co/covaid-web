import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal' 
import 'bootstrap/dist/css/bootstrap.min.css';
import fetch_a from '../util/fetch_auth';
const BeaconStatusEnum = {"active":1, "inactive":2, "complete":3, "delete": 4};

export default function BeaconConfirmation(props) {

    const deactivate = () => {
        let form = {
            beacon_id: props.beacon._id,
            updates: {
                beaconStatus: BeaconStatusEnum.inactive
            }
        };

        fetch_a('org_token', '/api/beacon/update', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                props.setShowConfirmationModal(false); 
                props.setOriginalModal(false)
                props.move(BeaconStatusEnum.active, BeaconStatusEnum.inactive);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const activate = () => {
        let form = {
            beacon_id: props.beacon._id,
            updates: {
                beaconStatus: BeaconStatusEnum.active
            }
        };

        fetch_a('org_token', '/api/beacon/update', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                props.setShowConfirmationModal(false); 
                props.setOriginalModal(false)
                props.move(BeaconStatusEnum.inactive, BeaconStatusEnum.active);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const activeComplete = () => {
        let form = {
            beacon_id: props.beacon._id,
            updates: {
                beaconStatus: BeaconStatusEnum.complete
            }
        };

        fetch_a('org_token', '/api/beacon/update', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                props.setShowConfirmationModal(false); 
                props.setOriginalModal(false)
                props.move(BeaconStatusEnum.active, BeaconStatusEnum.complete);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const inactiveComplete = () => {
        let form = {
            beacon_id: props.beacon._id,
            updates: {
                beaconStatus: BeaconStatusEnum.complete
            }
        };

        fetch_a('org_token', '/api/beacon/update', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                props.setShowConfirmationModal(false); 
                props.setOriginalModal(false)
                props.move(BeaconStatusEnum.inactive, BeaconStatusEnum.complete);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const formatEndDate = (endDate) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        var end = new Date(endDate);
        var endString = monthNames[end.getMonth()] + " " + end.getDate();
        return endString;
    }

    const action = (type) => {
        console.log(type);
        switch (type) {
            case 'deactivate':
                return deactivate;
            case 'reactivate':
                return activate;
            case 'active-complete':
                return activeComplete;
            case 'inactive-complete':
                return inactiveComplete;
            default:
                break;
        }
    }

    const color = (type) => {
        switch (type) {
            case 'deactivate':
                return '#DB4B4B';
            case 'reactivate':
                return '#28a745';
            case 'active-complete':
                return '#2670FF';
            case 'inactive-complete':
                return '#2670FF';
            default:
                break;
        }
    }

    const message = (type) => {
        switch (type) {
            case 'deactivate':
                return 'deactivate';
            case 'reactivate':
                return 'reactivate';
            case 'active-complete':
                return 'complete';
            case 'inactive-complete':
                return 'complete';
            default:
                break;
        }
    }

    return (
        <>
            <Modal size="sm" show={props.showModal} onHide={() => {props.setShowConfirmationModal(false); props.setOriginalModal(true)}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text" style={{color: "black"}}>Are you sure you would like to {message(props.confirmationType)} this beacon?</p>
                    <Button id="large-button" style={{backgroundColor: color(props.confirmationType), border: '1px solid ' + color(props.confirmationType)}} onClick={action(props.confirmationType)}>
                        Confirm
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    )
}