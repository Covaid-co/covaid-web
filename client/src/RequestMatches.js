import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import BestMatches from './BestMatches'

export default function RequestMatches(props) {
    return (
        <Modal show={props.topMatchesModal} onHide={() => props.setTopMatchesModal(false)} style = {{marginTop: 30}}>
            <Modal.Header closeButton>
                <Modal.Title> {props.currRequest.requester_first}'s Top Matches</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BestMatches association={props.association} 
                             currRequest={props.currRequest} 
                             setTopMatchesModal={props.setTopMatchesModal}
                             setRequestDetailsModal={props.setRequestDetailsModal}/>
            </Modal.Body>
        </Modal>
    );
}