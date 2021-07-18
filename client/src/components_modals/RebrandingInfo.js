import React from "react";
import Modal from "react-bootstrap/Modal";

export default function RebrandingInfo(props) {
    return (
        <Modal
            show={props.showModal}
            style={{ marginTop: 60 }}
            onHide={props.hideModal}
        >
            <Modal.Header closeButton>
                <Modal.Title id="small-header">Rebranding Updates</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: 400, "overflow-y": "auto" }}>
                <p>
                    First, thank you for using our platform, Covaid.
                    We are extremely grateful for your contribution in helping our platform grow.

                    Our team is currently working on incorporating as a 501(c)3 non-profit.
                    Completing this process would allow us to access more funding and growth opportunities.
                    We will continue to offer the Covaid service, while our organization will be named 'HelpGram'.

                    Over the next 1-2 months, we will be rolling out these changes -
                    the most important one being that Covaid will be available at www.helpgram.org/covaid instead of at www.covaid.co.

                    We hope that you continue to use Covaid as we grow the platform to expand our impact globally.
                </p>
            </Modal.Body>
        </Modal>
    );
}
