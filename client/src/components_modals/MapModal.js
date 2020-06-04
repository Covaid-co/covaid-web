import React, { useState, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import NewMap from "../components_orgpage/NewMap";

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";

let translatedStrings = new LocalizedStrings({ translations });

export default function MapModal(props) {
  const [volunteers, setVolunteers] = useState([]);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (props.switchToLanguage === "Español") {
      setLanguage("es");
    } else {
      setLanguage("en");
    }
    if (volunteers.length === 0) {
      fetch("api/users/actual_all", {
        method: "get",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              var result = [];
              for (var i = 0; i < data.length; i++) {
                var temp = {};
                const randomNum = Math.random();
                const randomAdd = randomNum / 500;
                if (randomNum < 0.25) {
                  temp["latitude"] = data[i].latlong[1] + randomAdd;
                  temp["longitude"] = data[i].latlong[0] + randomAdd;
                } else if (randomNum > 0.25 && randomNum < 0.5) {
                  temp["latitude"] = data[i].latlong[1] + randomAdd;
                  temp["longitude"] = data[i].latlong[0] - randomAdd;
                } else if (randomNum > 0.5 && randomNum < 0.75) {
                  temp["latitude"] = data[i].latlong[1] - randomAdd;
                  temp["longitude"] = data[i].latlong[0] + randomAdd;
                } else {
                  temp["latitude"] = data[i].latlong[1] - randomAdd;
                  temp["longitude"] = data[i].latlong[0] - randomAdd;
                }
                temp["_id"] = data[i]._id;
                result.push(temp);
              }
              setVolunteers(result);
            });
          } else {
            console.log(response);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [volunteers, props.switchToLanguage]);

  return (
    <Modal
      show={props.showModal}
      size="lg"
      style={{ marginTop: 10 }}
      onHide={props.hideModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {props.mobile ? "Covaid Map" : "Covaid Volunteer Map"}{" "}
          <Badge id="volunteerBadge">
            {props.totalVolunteers} {translatedStrings[language].Volunteer}
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p id="regular-text">{translatedStrings[language].Volunteer_Text}</p>
        <NewMap volunteers={volunteers} public={true} />
      </Modal.Body>
    </Modal>
  );
}
