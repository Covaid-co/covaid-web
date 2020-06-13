import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import fetch_a from "../util/fetch_auth";

import { useFormFields } from "../libs/hooksLib";
import { generateURL, validateEmail, extractTrueObj } from "../Helpers";

import CheckForm from "../components/CheckForm";
import PhoneNumber from "../components/PhoneNumber";

import Geocode from "react-geocode";

export default function EditAccountInfoModal(props) {
  const [showChangeAssocModal, setShowChangeAssocModal] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    first_name: "",
    last_name: "",
    email: "",
    zip: "",
  });
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [initialZip, setInitialZip] = useState("");

  const [zipUpdated, setZipUpdated] = useState(false);

  const [latlong, setLatLong] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [user, setUser] = useState({});
  const [defaultResources, setDefaultResources] = useState([
    "Food/Groceries",
    "Medication",
    "Donate",
    "Emotional Support",
    "Academic/Professional",
    "Misc.",
  ]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [times, setTimes] = useState({});
  const [languageChecked, setLanguageChecked] = useState({});
  const [resources, setResources] = useState({});
  const [hasCar, setHasCar] = useState(false);
  const [association, setAssociation] = useState("");
  const [associationName, setAssociationName] = useState("");
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [state, setFoundState] = useState([]);

  const defaultTaskList = [
    "Food/Groceries",
    "Medication",
    "Donate",
    "Emotional Support",
    "Academic/Professional",
    "Misc.",
  ];
  const timeNames = ["Morning", "Afternoon", "Evening", "Weekdays", "Weekends"];
  const languages = ["English", "Spanish", "Mandarin", "Cantonese", "Other"];

  const setCurrentUserObject = (userList, fullList, setFunction) => {
    for (var i = 0; i < fullList.length; i++) {
      const curr = fullList[i];
      const include = userList.includes(curr) ? true : false;
      setFunction((prev) => ({
        ...prev,
        [curr]: include,
      }));
    }
  };

  function getZip(location) {
    var latlng = { lat: parseFloat(location[1]), lng: parseFloat(location[0]) };
    var latitude = latlng.lat;
    var longitude = latlng.lng;

    Geocode.fromLatLng(latitude, longitude).then((response) => {
      if (response.status === "OK") {
        for (var i = 0; i < response.results.length; i++) {
          for (
            var j = 0;
            j < response.results[i].address_components.length;
            j++
          ) {
            if (
              response.results[i].address_components[j].types.indexOf(
                "postal_code"
              ) > -1
            ) {
              setInitialZip(
                response.results[i].address_components[j].long_name
              );
              setZip(response.results[i].address_components[j].long_name);
              break;
            }
          }
        }
      }
    });
  }

  const handleNoAssociations = () => {
    setDefaultResources(defaultTaskList);
    setCurrentUserObject([], defaultTaskList, setResources);
    var temp_resources = {};
    for (var i = 0; i < defaultTaskList.length; i++) {
      temp_resources[defaultTaskList[i]] = false;
    }
    setAssociation("");
    setAssociationName("");
    setResources(temp_resources);
    setShowChangeAssocModal(true);
  };

  const handleNewAssociation = (association) => {
    setDefaultResources(association.resources);
    setCurrentUserObject([], association.resources, setResources);
    var temp_resources = {};
    for (var i = 0; i < association.resources.length; i++) {
      temp_resources[association.resources[i]] = false;
    }
    setResources(temp_resources);
    setAssociation(association._id);
    setAssociationName(association.name);
    setShowChangeAssocModal(true);
  };

  async function getLatLng(zip) {
    try {
      if (zip.length !== 5 || !/^\d+$/.test(zip)) {
        throw Error("Invalid zip");
      }
      var response = await Geocode.fromAddress(zip);
      var new_neighborhoods = [];
      var foundState = [];
      for (var i = 0; i < Math.min(5, response.results.length); i++) {
        const results = response.results[i]["address_components"];
        for (var j = 0; j < results.length; j++) {
          const types = results[j].types;
          if (types.includes("neighborhood") || types.includes("locality")) {
            const currNeighborhoodName = results[j]["long_name"];
            if (new_neighborhoods.includes(currNeighborhoodName) === false) {
              new_neighborhoods.push(currNeighborhoodName);
            }
          }
          for (var k = 0; k < types.length; k++) {
            const type = types[k];
            if (
              foundState.length === 0 &&
              type === "administrative_area_level_1"
            ) {
              foundState = [results[j]["long_name"], results[j]["short_name"]];
            }
          }
        }
      }
      const { lat, lng } = response.results[0].geometry.location;
      setLatLong([lng, lat]);
      let params = { latitude: lat, longitude: lng };
      const url = generateURL("/api/association/get_assoc/lat_long?", params);
      const response_assoc = await fetch(url);
      const data = await response_assoc.json();
      setZipUpdated(true);
      if (user.association !== "" && data.length === 0) {
        setNeighborhoods(new_neighborhoods);
        setFoundState(foundState);
        handleNoAssociations();
      } else if (data.length > 0 && user.association !== data[0]["_id"]) {
        setNeighborhoods(new_neighborhoods);
        setFoundState(foundState);
        handleNewAssociation(data[0]);
      } else {
        setNeighborhoods(new_neighborhoods);
        setFoundState(foundState);
        setAssociation(user.association);
        setAssociationName(user.association_name);
        setShowChangeAssocModal(false);
        setCurrentUserObject(
          props.user.offer.tasks,
          defaultResources,
          setResources
        );
      }
      return true;
    } catch (err) {
      alert("Invalid zip");
    }
  }

  const handleChangedZip = () => {
    if (getLatLng(zip)) {
      return true;
    } else {
      return false;
    }
  };

  const checkInputs = () => {
    var valid = true;

    if (Object.values(languageChecked).every((v) => v === false)) {
      setToastMessage("Need to select a language");
      valid = false;
    }
    if (Object.values(times).every((v) => v === false)) {
      setToastMessage("No general availability selected");
      valid = false;
    }
    if (fields.first_name.length === 0) {
      setToastMessage("Enter a first name");
      valid = false;
    } else if (fields.last_name.length === 0) {
      setToastMessage("Enter a last name");
      valid = false;
    } else if (
      /^\d+$/.test(phone) &&
      phone.length !== 10 &&
      phone.length !== 0
    ) {
      setToastMessage("Enter a valid phone number");
      valid = false;
    } else if (
      fields.email.length === 0 ||
      validateEmail(fields.email) === false
    ) {
      setToastMessage("Enter a valid email");
      valid = false;
    }
    if (zip !== initialZip && !zipUpdated) {
      setToastMessage("Click the Update Zipcode button");
      valid = false;
    }

    if (valid === false) {
      setShowToast(true);
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkInputs() === false) {
      return;
    }

    var selectedLanguages = extractTrueObj(languageChecked);
    var selectedTimes = extractTrueObj(times);

    let form = {
      first_name: fields.first_name,
      last_name: fields.last_name,
      email: fields.email,
      phone,
      "offer.timesAvailable": selectedTimes,
      "offer.car": hasCar,
      "offer.neighborhoods": neighborhoods,
      "offer.state": state,
      location: {
        type: "Point",
        coordinates: latlong,
      },
      languages: selectedLanguages,
    };

    if (showChangeAssocModal) {
      if (Object.values(resources).every((v) => v === false)) {
        setToastMessage("Make sure you update your new tasks");
        setShowToast(true);
        return;
      }

      var resourceList = extractTrueObj(resources);
      form = {
        first_name: fields.first_name,
        last_name: fields.last_name,
        email: fields.email,
        phone,
        "offer.timesAvailable": selectedTimes,
        "offer.car": hasCar,
        languages: selectedLanguages,
        "offer.tasks": resourceList,
        association: association,
        association_name: associationName,
        "offer.neighborhoods": neighborhoods,
        "offer.state": state,
        location: {
          type: "Point",
          coordinates: latlong,
        },
      };
    }

    fetch_a("token", "/api/users/update", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Offer successfully created");
          window.location.reload(true);
        } else {
          console.log("Offer not successful");
        }
      })
      .catch((e) => {
        console.log("Error");
      });
  };

  useEffect(() => {
    fetch("/api/apikey/google").then((response) => {
      if (response.ok) {
        response.json().then((key) => {
          Geocode.setApiKey(key["google"]);
          setIsLoaded(true);
          setUser(props.user);
          fields.first_name = props.user.first_name;
          fields.last_name = props.user.last_name;
          fields.email = props.user.email;
          setPhone(props.user.phone);
          setLatLong(props.user.latlong);
          getZip(props.user.latlong);
          setAssociation(props.user.association);
          setAssociationName(props.user.association_name);
          setHasCar(props.user.offer.car);
          setCurrentUserObject(
            props.user.offer.timesAvailable,
            timeNames,
            setTimes
          );
          setCurrentUserObject(
            props.user.languages,
            languages,
            setLanguageChecked
          );

          async function getResources() {
            var url = "/api/association/get_assoc/?";
            if (!props.user.association) {
              setCurrentUserObject(
                props.user.offer.tasks,
                defaultResources,
                setResources
              );

              return;
            }
            let params = {
              associationID: props.user.association,
            };
            let query = Object.keys(params)
              .map(
                (k) =>
                  encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
              )
              .join("&");
            url += query;

            const response = await fetch(url);
            response.json().then((data) => {
              setDefaultResources(data.resources);
              setCurrentUserObject(
                props.user.offer.tasks,
                data.resources,
                setResources
              );
            });
          }
          getResources();
        });
      } else {
        console.log("Error");
      }
    });
  }, [props.user]);

  const updateLocation = async (e) => {
    if (zip.length !== 5 || !/^\d+$/.test(zip)) {
      setToastMessage("Invalid zip");
      setShowToast(true);
      return;
    }
    if (initialZip !== zip) {
      await handleChangedZip();
    } else {
      setNeighborhoods(user.offer.neighborhoods);
      setAssociation(user.association);
      setAssociationName(user.association_name);
      setLatLong(props.user.latlong);
      setShowChangeAssocModal(false);
      setCurrentUserObject(
        props.user.offer.tasks,
        defaultResources,
        setResources
      );
    }
  };

  if (isLoaded) {
    return (
      <>
        <Modal.Header
          style={{
            paddingTop: 16,
            paddingBottom: 12,
            marginLeft: 26,
            marginRight: 26,
          }}
        >
          <Modal.Title id="small-header">Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            paddingLeft: 26,
            paddingRight: 26,
            paddingTop: 20,
            paddingBottom: 34,
          }}
        >
          <Container style={{ padding: 0, margin: 0 }}>
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group controlId="first_name" bssize="large">
                    <Form.Label id="regular-text-bold">
                      {props.translations[props.language].FirstName}
                    </Form.Label>
                    <Form.Control
                      style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                      }}
                      value={fields.first_name}
                      onChange={handleFieldChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group controlId="last_name" bssize="large">
                    <Form.Label id="regular-text-bold">
                      {props.translations[props.language].LastName}
                    </Form.Label>
                    <Form.Control
                      style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginBottom: 16,
                      }}
                      value={fields.last_name}
                      onChange={handleFieldChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="email" bssize="large">
                    <Form.Label id="regular-text-bold">
                      {props.translations[props.language].email}
                    </Form.Label>
                    <Form.Control
                      style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginBottom: 16,
                      }}
                      value={fields.email}
                      onChange={handleFieldChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <PhoneNumber
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      marginBottom: 16,
                    }}
                    label={props.translations[props.language].phone}
                    labelID="regular-text-bold"
                    phoneNumber={phone}
                    setPhoneNumber={setPhone}
                  />
                </Col>
                <Col xs={12}>
                  <Form.Label id="regular-text-bold">
                    Current zipcode
                  </Form.Label>
                  <InputGroup
                    style={{
                      marginBottom: 16,
                    }}
                    controlid="locationString"
                    className="mb-3"
                  >
                    <Form.Control
                      placeholder="Zip code"
                      onChange={(e) => setZip(e.target.value)}
                      value={zip}
                    />
                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        style={{ fontSize: 14 }}
                        onClick={updateLocation}
                      >
                        Update Zipcode
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>

                <Col
                  xs={12}
                  style={{
                    marginLeft: 4,
                    marginRight: 4,
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  <h5 id="regular-text-bold">
                    {props.translations[props.language].WhatLanguageDoYouSpeak}
                  </h5>
                  <h5
                    id="regular-text"
                    style={{
                      fontSize: 14,
                      marginLeft: 1,
                      lineHeight: "19px",
                      marginBottom: 8,
                    }}
                  >
                    Please specify other languages in the details section of
                    your offer
                  </h5>
                  <CheckForm
                    sort={false}
                    obj={languageChecked}
                    setObj={setLanguageChecked}
                  />
                </Col>
              </Row>
              <Button
                onClick={handleSubmit}
                id="large-button"
                style={{ width: "100%", marginTop: 20 }}
              >
                Save Changes
              </Button>
              {/* <div
                style={
                  showChangeAssocModal
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                <h5
                  id="regular-text-bold"
                  style={{ marginBottom: 5, marginTop: 20 }}
                >
                  Your location has changed, please update your tasks here!
                </h5>
                <CheckForm obj={resources} setObj={setResources} />
              </div> */}
            </Form>
          </Container>
        </Modal.Body>

        <Toast
          show={showToast}
          delay={1500}
          onClose={() => setShowToast(false)}
          autohide
          id="toastError"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </>
    );
  } else {
    return <></>;
  }
}
