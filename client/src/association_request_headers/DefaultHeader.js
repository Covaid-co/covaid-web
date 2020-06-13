import React from "react";

export default function DefaultHeader(props) {
  return (
    <>
      <p id="regular-text">
        {props.translations[props.language].call}:
        <br />
        <span id="phoneNumber">
          (401) 526-8243
        </span>
      </p>
      <p id="regular-text">
        {props.translations[props.language].questions}:{" "}
        <strong>covaidco@gmail.com</strong>.
      </p>
    </>
  );
}
