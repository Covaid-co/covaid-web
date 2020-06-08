import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import NewDetails from "../components_homepage/NewDetails";
import NewPaymentMethod from "../components_homepage/NewPaymentMethod";
import CheckForm from "../components/CheckForm";
import { defaultResources, toastTime } from "../constants";
import { setFalseObj, extractTrueObj } from "../Helpers";

/**
 * Request support (Page 1)
 */

export default function NewRequestPage1(props) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedPayment, setSelectedIndex] = useState(0);
  const [resources, setResources] = useState({});
  const [resource_popup, setPopup] = useState({});
  const [time, setTime] = useState("Morning");
  const [high_priority, setPriority] = useState(false);
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
    }

    if (Object.keys(props.first_page).length !== 0) {
      fields.details = props.first_page.details;
      setSelectedIndex(props.first_page.payment);
      setPriority(props.first_page.high_priority);
      setTime(props.first_page.time);
      setDate(props.first_page.date);
      for (var i = 0; i < props.first_page.resources.length; i++) {
        temp_resources[props.first_page.resources[i]] = true;
      }
    }
    setResources(temp_resources);
  }, [props.first_page, props.currentAssoc]);

  const goToSecondPage = () => {
    const valid = checkPage();
    if (valid) {
      setShowToast(false);
      const resource_request = extractTrueObj(resources);
      const result = {
        details: fields.details,
        payment: selectedPayment,
        resources: resource_request,
        time: time,
        date: date,
        high_priority: high_priority,
      };
      props.setStepNum(3);
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
    return true;
  };

  const displayResourcePopup = () => {
    return Object.keys(resources).map((key) => {
      if (resources[key] && resource_popup[key]) {
        return (
          <Alert
            style={{ marginTop: 10, marginBottom: 0, fontSize: 14 }}
            key={key}
            variant={"warning"}
          >
            {resource_popup[key]}
          </Alert>
        );
      }
    });
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
      <h5 id="title-light">
        {props.translations[props.language].RequestDetails}
      </h5>
      {props.currentAssoc === null ? (
        <></>
      ) : (
        <CheckForm
          obj={resources}
          setObj={setResources}
          translations={props.translations}
          language={props.language}
        />
      )}
      {displayResourcePopup()}
      <NewDetails
        fields={fields}
        handleFieldChange={handleFieldChange}
        translations={props.translations}
        language={props.language}
      />
      {paymentMethod()}
      {paymentAgreement}
      <div style={{ display: "table", marginBottom: 0, marginTop: 10 }}>
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
          style={{
            display: "table-cell",
            verticalAlign: "middle",
            fontSize: 14,
          }}
          id="behalf-text"
          onClick={() => {
            setPriority(!high_priority);
          }}
        >
          We aim to prioritize requests from individuals and families that
          identify as{" "}
          <font style={{ fontWeight: "bold" }}>
            POC, elderly, immunocompromised, or of veteran status
          </font>
          . Please check here if you identify with any of these so we can
          prioritize your request.
        </p>
      </div>
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
        style={{ marginBottom: 60 }}
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
