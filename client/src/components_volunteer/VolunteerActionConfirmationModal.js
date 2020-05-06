import React, {useState} from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal' 
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Toast from 'react-bootstrap/Toast'
import { useFormFields } from "../libs/hooksLib";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VolunteerActionConfirmationModal(props) {
    const [showToast, setShowToast] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        comment: ""
    })

    const confirmComplete = () => {
        if (props.action !== 'complete') {
            return false;
        } else {
            if (fields.comment.length < 10) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    const complete = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currRequest.status.volunteer;
        const assoc_id = props.currRequest.association

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id,
            'reason': 'Volunteer Completed',
            'volunteer_comment': fields.comment,
            'assoc_id': assoc_id
        };

        fetch('/api/request/completeRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                props.setShowConfirmationModal(false); 
                props.setOriginalModal(false)
                props.complete();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const reject = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currRequest.status.volunteer;

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id,
            'assoc_id': props.currRequest.association
        };

        fetch('/api/request/removeVolunteerFromRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                props.setShowConfirmationModal(false); 
                props.setOriginalModal(false)
                props.reject();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const action = props.action === 'complete' ? complete : reject;

    const getCommentForm = (action) => {
        if (action === 'complete') {
            return <>
                <h5 id="regular-text-bold" style = {{marginTop: 0, marginBottom: 5}}>
                            How did you complete this request?
                        </h5>
                <Form.Group controlId="comment" bssize="large">
                    <Form.Control value={fields.comment} onChange={handleFieldChange} as="textarea" rows="2" placeholder="Ex: I delivered groceries to this person's front door! (min. 10 characters)" />
                </Form.Group>
            </>
        } else {
            return <></>;
        }
    }

    return (
        <>
            <Modal size="md" show={props.showModal} onHide={() => {props.setShowConfirmationModal(false); props.setOriginalModal(true)}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text">{props.confirmation}</p>
                    {getCommentForm(props.action)}
                    <Button id="large-button" disabled={confirmComplete()} style={{backgroundColor: props.buttonColor, border: '1px solid ' + props.buttonColor}} onClick={action}>
                        Confirm
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    )
}