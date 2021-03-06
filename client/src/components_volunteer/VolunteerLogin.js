/*
 * Volunteer Login Page
 */

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormFields } from "../libs/hooksLib";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Cookie from "js-cookie";
import orgImg from "../assets/orgNew.png";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function OrgLogin(props) {
  const [fields, handleFieldChange] = useFormFields({
    emailOrg: "",
    passOrg: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = {
      user: {
        email: fields.emailOrg,
        password: fields.passOrg,
      },
    };
    fetch("/api/users/login/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            Cookie.set("token", data.user.token);
            window.location.reload(true);
          });
        } else {
          if (response.status === 403) {
            alert(
              "Check your email for a verification link prior to logging in."
            );
          } else {
            alert("Incorrect password.");
          }
        }
      })
      .catch((e) => {
        alert("Seems to be some issues on our end, please try again later.");
      });
  };

  return (
    <>
      {/* <NavBar
        setLanguage={props.setLanguage}
        language={props.language}
        pageLoaded={true}
        isLoggedIn={false}
        simplified={true}
      /> */}
      <Container
        style={{ marginTop: "7.5%", maxWidth: 1500, marginBottom: "5%" }}
      >
        <Row>
          <Col md={6} id="login-container">
            <h1 id="home-heading">Covaid for Volunteers</h1>
            <p
              id="home-subheading"
              style={{ fontSize: 16, marginBottom: 20, marginLeft: 1 }}
            >
              Manage your offer and handle requests through Covaid
            </p>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12}>
                  <Form.Group
                    controlId="emailOrg"
                    bssize="large"
                    style={{ marginBottom: 12 }}
                  >
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={fields.emailOrg}
                      onChange={handleFieldChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="passOrg" bssize="large">
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      value={fields.passOrg}
                      onChange={handleFieldChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                style={{ marginTop: 10, width: 150 }}
                id="large-button"
                type="submit"
              >
                Sign In
              </Button>
            </Form>
          </Col>
          <Col md={6} style={{ paddingLeft: 50 }}>
            <img
              src={orgImg}
              alt="Covaid Logo"
              style={{ width: 480, marginTop: 50 }}
            ></img>
          </Col>
        </Row>
      </Container>
      <Footer key="2" handleShowModal={() => {}} />
    </>
  );
}
