import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Donate(props) {
  return (
    <Modal
      show={props.showModal}
      style={{ marginTop: 10 }}
      onHide={props.hideModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Donate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p id="regular-text">
          Though some people simply need help shopping for groceries or running
          an errand, others also need help paying for basic necessities such as
          food, toilet paper, and other simple home goods. Accordingly, we
          intend to use donated funds to defray the cost of such essential items
          for those who are most in need.
        </p>
        <p id="regular-text">
          We are constantly impressed by the kindness and generosity shown by
          people around the nation and are grateful for donations of any amount.
          All unused funds will be donated to food banks and other organizations
          that directly benefit local communities. Thank you for your support!
        </p>
        <Button
          id="large-button"
          style={{ marginTop: 15 }}
          onClick={() =>
            window.open("https://www.gofundme.com/f/25wj3-covaid", "_blank")
          }
        >
          Donate
        </Button>
      </Modal.Body>
    </Modal>
  );
}
