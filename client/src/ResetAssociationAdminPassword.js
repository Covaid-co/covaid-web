import React, { useState, useEffect } from "react";
import { useFormFields } from "./libs/hooksLib";
import { Button, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";

const queryString = require("query-string");

const VERIFICATION_STATUS = {
  LOADING: "loading",
  VERIFIED: "verified",
  EXPIRED: "expired",
};

export default function ResetAssociationAdminPassword(props) {
  const [fields, handleFieldChange] = useFormFields({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [verified, setVerified] = useState(VERIFICATION_STATUS.LOADING);
  const [id, setID] = useState();
  const [redirect, setRedirect] = useState(false);

  const verify = async () => {
    const ID = queryString.parse(props.location.search).ID;
    const token = queryString.parse(props.location.search).Token;
    setID(ID);

    const response = await fetch(
      "/api/association/verifyresetlink/" + ID + "/" + token
    );
    if (response.ok) {
      setVerified(VERIFICATION_STATUS.VERIFIED);
    } else {
      setVerified(VERIFICATION_STATUS.EXPIRED);
    }
  };

  function validateForm() {
    return (
      fields.newPassword.length > 0 &&
      fields.confirmNewPassword.length > 0 &&
      fields.newPassword === fields.confirmNewPassword
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let form = {
      id: id,
      newPassword: fields.newPassword,
    };
    const response = await fetch("/api/association/resetpassword", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setRedirect("/organizationPortal");
    } else {
      alert("Reset password link has expired");
    }
  }

  useEffect(() => {
    verify();
  }, []);

  if (redirect === "/organizationPortal") {
    return <Redirect to={redirect} />;
  }

  if (verified === VERIFICATION_STATUS.VERIFIED) {
    return (
      <div className="Login">
        <h1>Reset your password</h1>
        <form onSubmit={handleSubmit}>
          <Form.Group controlId="newPassword" bssize="large">
            <Form.Label>Enter new password</Form.Label>
            <Form.Control
              autoFocus
              type="password"
              value={fields.newPassword}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="confirmNewPassword" bssize="large">
            <Form.Label>Confirm new password</Form.Label>
            <Form.Control
              autoFocus
              type="password"
              value={fields.confirmNewPassword}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Button block bssize="large" disabled={!validateForm()} type="submit">
            Update Password
          </Button>
        </form>
      </div>
    );
  } else if (verified === VERIFICATION_STATUS.EXPIRED) {
    return (
      <div className="Login">
        <h1>Link has expired</h1>
      </div>
    );
  } else {
    return <></>;
  }
}
