import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import { generateURL } from "../Helpers";
import ImageUploader from "react-images-upload";
import fetch_a from "../util/fetch_auth";
import Form from "react-bootstrap/Form";

export default function ProfileHeader(props) {
  const [association, setAssociation] = useState("");
  const [image, setImage] = useState(
    "https://www.csfences.com/wp-content/uploads/2016/08/profile-placeholder.jpg"
  );
  const [uploadingImage, setUploadingImage] = useState({});
  const [isUploaded, setIsUploaded] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [imageUrl, setImageUrl] = useState("/api/image/" + props.user._id);
  const [allowSMS, setAllowSMS] = useState(false);


  const handleChangeSMSPreference = (event) => {
    event.persist();
    setAllowSMS(!allowSMS);

    let form = {
      allowSMS: !allowSMS,
    };

    fetch_a("token", "/api/users/update", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Text preferences successfully changed");
          window.location.reload(true);
        } else {
          console.log("Text preferences not successfully changed");
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  };

  const SMSNotificationSwitch = (
    <Form.Group
      controlId="preverify"
      bssize="large"
      style={{ marginTop: 8, marginBottom: -18}}
    >
      <Row>
      <Form.Check
        type="switch"
        id="large-switch"
        style={{ color: "#7F7F7F", marginLeft: 15, marginTop: 2, fontSize: 16 }}
        label={
          allowSMS
            ? ""
            : ""
        }
        checked={allowSMS}
        onChange={handleChangeSMSPreference}
      />
      <div style={{ color: "#7F7F7F", marginTop: 1, fontSize: 17 }}>
      {allowSMS
            ? "Covaid will text you when you receive new requests"
            : "You will NOT be receiving texts from Covaid"}
      </div>
     
      </Row>
      
    </Form.Group>
  );
  const onDrop = (pictureFiles, pictureDataURLs) => {
    setUploadingImage(pictureFiles[0]);
    setIsUploaded(true);
  };

  const upload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadingImage);

    fetch_a("token", "/api/image", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        response.json().then((data) => {
          window.location.reload(false);
        });
      })
      .catch((err) => alert("Error: " + err));
  };

  const fetchProfilePic = (id) => {
    fetch("/api/image/" + id).then((response) => {
      if (response.ok) {
        setImageUrl("/api/image/" + props.user._id);
      } else {
        setImageUrl(
          "https://www.csfences.com/wp-content/uploads/2016/08/profile-placeholder.jpg"
        );
      }
    });
  };

  useEffect(() => {
    if (props.user.association_name && props.user.association_name.length > 0) {
      setAssociation(props.user.association_name);
    }
    setAllowSMS(props.user.allowSMS)
    fetchProfilePic(props.user._id);
  }, [props.user]);

  return (
    <>
      <div style={{ marginLeft: "5%", maxWidth: 2000 }}>
        <Row>
          <Col>
            <Image
              src={imageUrl}
              id="profile-pic"
              style={{
                marginRight: 20,
                boxShadow:
                  "0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={() => setShowUploader(true)}
            />
            <Row>
              <h1
                id="home-heading"
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  display: "inline-block",
                  fontSize: 24,
                  color: "#4F4F4F",
                  textAlign: "left",
                }}
              >
                {props.user.first_name} {props.user.last_name}
              </h1>
            </Row>
            <Row>
              <p
                id="regular-text"
                style={{
                  marginLeft: 1,
                  marginTop: 4,
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                {association && association.length > 0
                  ? association
                  : "Covaid Volunteer"}{" "}
              </p>
            </Row>
            <Row>
              <Button
                id="small-button"
                onClick={() => {
                  props.setShowAccountModal(true);
                }}
              >
                Edit Profile
              </Button>
            </Row>
            <Row>
            {SMSNotificationSwitch}
            </Row>
          </Col>
        </Row>
      </div>
      <Modal
        show={showUploader}
        onHide={() => {
          setShowUploader(false);
          setIsUploaded(false);
          setUploadingImage({});
        }}
        style={{ marginTop: 10, paddingBottom: 50 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload a new profile picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageUploader
            withIcon={true}
            buttonText="Choose an image"
            onChange={onDrop}
            imgExtension={[".jpg", ".png"]}
            maxFileSize={5242880}
            singleImage={true}
            withPreview={true}
          />
          <Button disabled={!isUploaded} id="large-button" onClick={upload}>
            Upload
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
