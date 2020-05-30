import React, { useState, useEffect } from "react";
import { useFormFields } from "../libs/hooksLib";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import Form from "react-bootstrap/Form";

import NeededBy from "../components_homepage/NeededBy";
import NewDetails from "../components_homepage/NewDetails";
import NewPaymentMethod from "../components_homepage/NewPaymentMethod";
import CheckForm from "../components/CheckForm";
import { defaultResources, toastTime } from "../constants";
import { setFalseObj, extractTrueObj } from "../Helpers";

/**
 * Request support (Page 2)
 */

export default function RequestPage2(props) {
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedPayment, setSelectedIndex] = useState(0);
  const [resources, setResources] = useState({});
  const [time, setTime] = useState("Morning");
  const [date, setDate] = useState(
    new Date(Date.now()).toLocaleString().split(",")[0]
  );
  const [fields, handleFieldChange] = useFormFields({
    details: "",
  });

  useEffect(() => {
    var resourcesFromAssoc = defaultResources;
    if (props.currentAssoc && Object.keys(props.currentAssoc).length > 0) {
      resourcesFromAssoc = props.currentAssoc.resources;
    }
    var temp_resources = setFalseObj(resourcesFromAssoc);

    if (Object.keys(props.second_page).length !== 0) {
      fields.details = props.second_page.details;
      setSelectedIndex(props.second_page.payment);
      setTime(props.second_page.time);
      setDate(props.second_page.date);
      for (var i = 0; i < props.second_page.resources.length; i++) {
        temp_resources[props.second_page.resources[i]] = true;
      }
    }
    setResources(temp_resources);
  }, [props.second_page]);

  const goToSubmit = () => {
    const valid = checkPage();
    if (valid) {
      setShowToast(false);
      setPendingSubmit(true);
      const resource_request = extractTrueObj(resources);
      const result = {
        details: fields.details,
        payment: selectedPayment,
        resources: resource_request,
        time: time,
        date: date,
      };
      props.setStepNum(4);
      props.setSecondPage(result);
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

  const paymentMethod = () => {
    var payment = <NewPaymentMethod setSelectedIndex={setSelectedIndex} />;
    if (
      props.currentAssoc &&
      props.currentAssoc._id === "5e843ab29ad8d24834c8edbf"
    ) {
      payment = <></>;
    }
    return payment;
  };

  var agreement = <></>;
  var paymentAgreement = <></>;
  if (
    props.currentAssoc &&
    props.currentAssoc.name === "Baltimore Mutual Aid"
  ) {
    agreement = (
      <>
        <Form.Check
          type="checkbox"
          id="regular-text"
          label="This match program is being organized by private citizens for the 
                                benefit of those in our community. By completing the sign up form to be 
                                matched, you agree to accept all risk and responsibility and further 
                                hold any facilitator associated with Baltimore Mutual Aid Network and/or 
                                Covaid.co harmless. For any additional questions, please contact bmoremutualaid@gmail.com."
          style={{ fontSize: 12, marginTop: 2 }}
        />
      </>
    );
    paymentAgreement = (
      <p id="regular-text" style={{ fontSize: 14 }}>
        Baltimore Mutual Aid is not able to provide financial assistance at this
        time. Any purchases made by volunteers must be reimbursed.
      </p>
    );
  }

  return (
    <>
      <h5 id="title-light">Request Details</h5>
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
      <NeededBy
        setTime={setTime}
        setDate={setDate}
        translations={props.translations}
        language={props.language}
      />
      {paymentMethod()}
      {paymentAgreement}
      <NewDetails
        fields={fields}
        handleFieldChange={handleFieldChange}
        translations={props.translations}
        language={props.language}
      />
      {agreement}
      <Button
        id="large-button"
        disabled={pendingSubmit}
        style={{ marginTop: 15 }}
        onClick={goToSubmit}
      >
        {props.translations[props.language].SubmitRequest}
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

RequestPage2.propTypes = {
  setSecondPage: PropTypes.func,
  setStepNum: PropTypes.func,
  second_page: PropTypes.object,
  currentAssoc: PropTypes.object,
};
