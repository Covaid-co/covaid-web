import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function NewPaymentMethod(props) {
  const changeFormSelect = (e) => {
    e.persist();
    props.setSelectedIndex(e.target.selectedIndex);
  };

  return (
    <>
      <h5 id="regular-text-bold" style={{ marginTop: 20, marginBottom: 5 }}>
        Payment method (if necessary)
      </h5>
      <Row>
        <Col xs={12}>
          <Form.Group controlId="payment">
            <Form.Control as="select" onChange={changeFormSelect}>
              <option>Call ahead to store and pay (Best option)</option>
              <option>Have volunteer pay and reimburse when delivered</option>
              <option>N/A</option>
              <option>Donation (only if absolutely necessary)</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}
