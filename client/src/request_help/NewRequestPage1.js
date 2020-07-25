import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Select from "react-select";

import NewDetails from "../components_homepage/NewDetails";
import NewPaymentMethod from "../components_homepage/NewPaymentMethod";
import CheckForm from "../components/CheckForm";
import {
  defaultResources,
  toastTime,
  resource_popups,
  languages,
} from "../constants";
import { setFalseObj, extractTrueObj } from "../Helpers";

/**
 * Request support (Page 1)
 */

export default function NewRequestPage1(props) {
  const [isCovaid, setIsCovaid] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedPayment, setSelectedIndex] = useState(2);
  const [resources, setResources] = useState({});
  const [resource_popup, setPopup] = useState({});
  const [time, setTime] = useState("Morning");
  const [high_priority, setPriority] = useState(false);
  const language_options = languages.map((lang) => {
    return { value: lang, label: lang };
  });
  const [selectedLanguages, setLanguages] = useState({
    selectedOptions: [{ value: "English", label: "English" }],
  });
  const [date, setDate] = useState(
    new Date(Date.now()).toLocaleString().split(",")[0]
  );
  const [fields, handleFieldChange] = useFormFields({
    details: "",
  });

  useEffect(() => {
    var resourcesFromAssoc = defaultResources;
    if (
      props.currentAssoc &&
      Object.keys(props.currentAssoc).length > 0 &&
      props.currentAssoc.resources
    ) {
      resourcesFromAssoc = props.currentAssoc.resources;
    } else {
      setIsCovaid(true);
    }
    var temp_resources = setFalseObj(resourcesFromAssoc);

    if (
      props.currentAssoc &&
      Object.keys(props.currentAssoc).length > 0 &&
      props.currentAssoc.resource_popup
    ) {
      var temp = {};
      for (var i = 0; i < props.currentAssoc.resource_popup.length; i++) {
        temp[props.currentAssoc.resource_popup[i][0]] =
          props.currentAssoc.resource_popup[i][1];
      }
      setPopup(temp);
    } else {
      setPopup(resource_popups);
    }

    var lang_temp = [];
    if (Object.keys(props.first_page).length !== 0) {
      fields.details = props.first_page.details;
      setSelectedIndex(props.first_page.payment);
      setPriority(props.first_page.high_priority);
      setTime(props.first_page.time);
      setDate(props.first_page.date);
      for (var i = 0; i < props.first_page.resources.length; i++) {
        temp_resources[props.first_page.resources[i]] = true;
      }
      for (var i = 0; i < props.first_page.languages.length; i++) {
        const lang = props.first_page.languages[i];
        lang_temp.push({ value: lang, label: lang });
      }
    }
    setLanguages({ selectedOptions: lang_temp });
    setResources(temp_resources);
  }, [props.first_page, props.currentAssoc]);

  if (isCovaid) {
    return (
      <>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
        We are currently only processing requests in Baltimore, Pittsburgh, Charlotte, Newark, Chicago, Athens, Austin, and Evanston.
      </h5>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
        If you are located in one of these locations, make sure to set your location correctly on the previous page.
      </h5>
      </>
    );
  }

  const goToSecondPage = () => {
    const valid = checkPage();
    if (valid) {
      setShowToast(false);
      const resource_request = extractTrueObj(resources);
      const languages = [];
      for (var i = 0; i < selectedLanguages.selectedOptions.length; i++) {
        languages.push(selectedLanguages.selectedOptions[i].value);
      }
      if (languages.length === 0) {
        languages.push("English");
      }
      const result = {
        details: fields.details,
        payment: selectedPayment,
        resources: resource_request,
        time: time,
        date: date,
        languages: languages,
        high_priority: high_priority,
      };
      props.setStepNum(2);
      props.setFirstPage(result);
    } else {
      setShowToast(true);
    }
  };

  const checkPage = () => {
    if (Object.values(resources).every((v) => v === false)) {
      setToastMessage("No task selected");
      return false;
    }

    if (fields.details.length === 0) {
      setToastMessage("Enter details about your request");
      return false;
    }

    if (Object.values(selectedLanguages).every((v) => v === false)) {
      setToastMessage("Please select a language");
      return false;
    }

    return true;
  };

  const handleChangeLanguage = (selectedOptions) => {
    setLanguages({ selectedOptions });
  };

  const displayResourcePopup = () => {
    const text = Object.keys(resources).map((key) => {
      if (resources[key] && resource_popup[key]) {
        return (
          <p style={{ marginBottom: 3 }} key={key}>
            <font style={{ fontWeight: "bold" }}>{key + ": "}</font>
            <font style={{ fontStyle: "italic" }}>{resource_popup[key]}</font>
          </p>
        );
      }
    });

    var found = false;
    for (const key in resources) {
      if (resources[key] && resource_popup[key]) {
        found = true;
      }
    }

    if (found) {
      return (
        <Alert
          style={{ marginTop: 10, marginBottom: 0, fontSize: 14 }}
          variant={"warning"}
        >
          {text}
        </Alert>
      );
    }
    return <></>;
  };

  const paymentMethod = () => {
    var payment = <NewPaymentMethod setSelectedIndex={setSelectedIndex} />;
    if (
      props.currentAssoc &&
      (props.currentAssoc._id === "5e843ab29ad8d24834c8edbf" ||
        props.currentAssoc._id === "5ec59c04bcb4d4389861d588")
    ) {
      payment = <></>;
    }
    payment = <></>;
    return payment;
  };

  var paymentAgreement = <></>;
  if (
    props.currentAssoc &&
    props.currentAssoc.name === "Baltimore Mutual Aid"
  ) {
    paymentAgreement = (
      <p id="regular-text" style={{ fontSize: 14 }}>
        Baltimore Mutual Aid is not able to provide financial assistance at this
        time. Any purchases made by volunteers must be reimbursed.
      </p>
    );
  } 

  return (
    <>
      <h5 id="title-light" style={{ marginBottom: 5 }}>
        {props.translations[props.language].RequestDetails}
      </h5>
      <CheckForm
        obj={resources}
        setObj={setResources}
        translations={props.translations}
        language={props.language}
      />
      {displayResourcePopup()}
      <NewDetails
        fields={fields}
        handleFieldChange={handleFieldChange}
        translations={props.translations}
        language={props.language}
      />
      {paymentMethod()}
      {paymentAgreement}
      <h5 id="subtitle-light" style={{ marginTop: 15, marginBottom: 5 }}>
        {props.translations[props.language].PreferredLangs}
      </h5>
      <Select
        closeMenuOnSelect={true}
        defaultValue={selectedLanguages.selectedOptions}
        isMulti
        options={language_options}
        onChange={handleChangeLanguage}
      />
      {/* <div style={{ display: "table", marginBottom: 0, marginTop: 10 }}>
        <Form.Check
          type="checkbox"
          style={{ marginTop: 0, marginRight: 5, display: "inline" }}
          id="default-checkbox"
          checked={high_priority}
          onChange={() => {
            setPriority(!high_priority);
          }}
        />
        <p
          id="behalf-text"
          style={{ fontSize: 14 }}
          onClick={() => {
            setPriority(!high_priority);
          }}
        >
          {props.translations[props.language].Prioritize1}{" "}
          <font style={{ fontWeight: "bold" }}>
            {props.translations[props.language].Prioritize2}
          </font>{" "}
          {props.translations[props.language].Prioritize3}
        </p>
      </div> */}
      <Button
        id="large-button"
        style={{ marginTop: 20 }}
        onClick={goToSecondPage}
      >
        {props.translations[props.language].Next}
      </Button>
      <Toast
        show={showToast}
        delay={toastTime}
        onClose={() => setShowToast(false)}
        autohide
        style={{ marginBottom: 80, marginRight: 15 }}
        id="toastError"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
}

NewRequestPage1.propTypes = {
  setFirstPage: PropTypes.func,
  setStepNum: PropTypes.func,
  first_page: PropTypes.object,
  currentAssoc: PropTypes.object,
};
