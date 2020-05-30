import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";

import NewHasCar from "../components_homepage/NewHasCar";
import CheckForm from "../components/CheckForm";
import Details from "../components_homepage/Details";
import { defaultResources, toastTime, availability } from "../constants";
import { setFalseObj, extractTrueObj } from "../Helpers";

import LocalizedStrings from "react-localization";
import { translations } from "../translations/translations";
let translatedStrings = new LocalizedStrings({ translations });

/**
 * Volunteer Registration (Page 2)
 */

export default function RegisterPage2(props) {
  const [taskChecked, setTaskChecked] = useState({});
  const [availabilityChecked, setAvailabilityChecked] = useState({});
  const [hasCar, setHasCar] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [fields, handleFieldChange] = useFormFields({
    details: "",
  });

  useEffect(() => {
    if (props.currentAssoc && props.currentAssoc.resources) {
      var tempResources = setFalseObj(props.currentAssoc.resources);
      setTaskChecked(tempResources);
    } else {
      setTaskChecked(setFalseObj(defaultResources));
    }
    setAvailabilityChecked(setFalseObj(availability));
  }, [props.currentAssoc]);

  const goToThirdPage = () => {
    const valid = checkPage();
    if (valid) {
      setShowToast(false);
      const selectedTimes = extractTrueObj(availabilityChecked);
      const selectedTasks = extractTrueObj(taskChecked);
      const result = {
        details: fields.details,
        tasks: selectedTasks,
        car: hasCar,
        timesAvailable: selectedTimes,
      };
      props.setSecondPage(result);
    } else {
      setShowToast(true);
    }
  };

  const checkPage = () => {
    var valid = true;
    if (Object.values(taskChecked).every((v) => v === false)) {
      setToastMessage("No task selected");
      valid = false;
    } else if (Object.values(availabilityChecked).every((v) => v === false)) {
      setToastMessage("No availability selected");
      valid = false;
    } else if (fields.details.length === 0) {
      setToastMessage("Please enter some details");
      valid = false;
    }

    if (valid === false) {
      setShowToast(true);
    }
    return valid;
  };

  return (
    <>
      <h5 id="regular-text-bold" style={{ marginTop: 0, marginBottom: 5 }}>
        {translatedStrings[props.language].RequestPage2_Text1}
      </h5>
      <CheckForm obj={taskChecked} setObj={setTaskChecked} />
      <h5
        id="regular-text-bold"
        style={{ marginTop: "24px", marginBottom: "4px" }}
      >
        {translatedStrings[props.language].RequestPage2_Text2}
      </h5>
      <NewHasCar hasCar={hasCar} setHasCar={setHasCar} />
      <h5 id="regular-text-bold" style={{ marginTop: "24px", marginBottom: 5 }}>
        {translatedStrings[props.language].RequestPage2_Text3}
      </h5>
      <CheckForm obj={availabilityChecked} setObj={setAvailabilityChecked} />
      <Details
        language={props.language}
        fields={fields.details}
        handleFieldChange={handleFieldChange}
      />
      <Button
        style={{ marginTop: 30 }}
        id="large-button-empty"
        onClick={goToThirdPage}
      >
        {translatedStrings[props.language].Next}
      </Button>
      <p id="pagenum-text">{translatedStrings[props.language].Page2of3}</p>
      <Toast
        show={showToast}
        delay={toastTime}
        onClose={() => setShowToast(false)}
        autohide
        id="toastError"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
}

RegisterPage2.propTypes = {
  setSecondPage: PropTypes.func,
  currentAssoc: PropTypes.object,
  setLanguage: PropTypes.func,
  language: PropTypes.string,
};
