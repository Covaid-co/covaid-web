import React from "react";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
const queryString = require("querystring");

export default function Verify(props) {
  function verify() {
    const ID = queryString.parse(props.location.search).ID;
    fetch("/api/users/verify?ID=" + ID, {
      method: "post",
    });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Spinner animation="border" role="status" style={{ marginTop: 100 }}>
        <span className="sr-only">Loading...</span>
      </Spinner>
      <p style={{ marginTop: 30 }}> Redirecting... </p>
      {verify()}
      <Redirect
        to={{
          pathname: "/",
          verified: true,
        }}
      />
    </div>
  );
}
