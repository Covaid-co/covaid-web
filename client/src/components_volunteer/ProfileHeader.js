import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

export default function ProfileHeader(props) {
  const [association, setAssociation] = useState("");
  const [image, setImage] = useState(
    "https://www.csfences.com/wp-content/uploads/2016/08/profile-placeholder.jpg"
  );

  useEffect(() => {
    if (props.user.association_name && props.user.association_name.length > 0) {
      setAssociation(props.user.association_name);
    }
    if (props.user.img) {
      // setImage(props.user.img);
      // fetch user profile pic from user/images api given props.user._id
    }
  }, [props.user]);
  return (
    <Container style={{ maxWidth: 2000 }}>
      <Row>
        <Col lg={1} md={1} sm={0}></Col>
        <Col>
          <Image src={image} id="profile-pic" style={{ marginRight: 30, boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.1)" }} />
          <div style={{ marginTop: 15 }}>
            <h1
              id="home-heading"
              style={{ marginTop: 0, fontSize: 28, color: "#4F4F4F" }}
            >
              {props.user.first_name} {props.user.last_name}
            </h1>
            <p id="regular-text" style={{ fontSize: 16 }}>
              {association}
            </p>
          </div>
          <Button
            id="medium-button"
            style={{
              paddingLeft: 34,
              paddingRight: 34,
              paddingTop: 10,
              paddingBottom: 10,
            }}
            onClick={() => {
              props.setShowAccountModal(true);
            }}
          >
            Edit Profile
          </Button>{" "}
        </Col>
      </Row>
    </Container>
  );
}
