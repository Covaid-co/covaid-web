import React from "react";
import Form from "react-bootstrap/Form";

export default function Details(props) {
  return (
    <Form.Group
      controlId="details"
      bssize="large"
      style={{ marginBottom: 0, marginTop: 30 }}
    >
      <h5 id="regular-text-bold" style={{ marginBottom: 5 }}>
        Details?
      </h5>
      <p style={{ fontSize: 14 }} id="regular-text">
        Let us know more about you and how you can help (Please be specific)!
        For example: If you're offering food, please let us know if you're
        offering to cook food, donate food, or need to be reimbursed, etc. No
        pressure, but any information helps us match you more quickly!
      </p>
      <Form.Control
        as="textarea"
        rows="3"
        value={props.fields}
        onChange={props.handleFieldChange}
        placeholder="I am a college student, and am happy to deliver food from stores or food banks in St. Louis County!"
      />
    </Form.Group>
  );
}
