import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function OrgHeader(props) {
  const createFormName = (assocName, assocCity) => {
    switch (props.language) {
      case "en":
        return assocName + " " + props.translations[props.language].formTitle;
      case "es":
        return "Formulario de Ayuda Mutua en " + assocCity;
      default:
        break;
    }
  };

  return (
    <>
      <p id="regular-text">
        {props.translations[props.language].intro}
        <a
          href={props.assoc.homepage}
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          {props.assoc.name}
        </a>
        .
      </p>
      <p id="regular-text">
        {props.translations[props.language].prioritizing} {props.assoc.city}{" "}
        {props.translations[props.language].areas}.
      </p>
      <p id="regular-text">
        {props.translations[props.language].formManage} {props.assoc.city}{" "}
        {props.translations[props.language].managedBy}.
      </p>
      <p id="regular-text">
        {props.translations[props.language].questions}:<br />
        <strong>{props.assoc.email}</strong>.
      </p>
      <p id="regular-text">{props.translations[props.language].motto}</p>
      <p
        id="request-calling"
        style={{ borderBottom: "0px solid", marginBottom: 0 }}
      >
        {props.translations[props.language].call}:
        <br />
        <span id="phoneNumber">
          {props.assoc.phone ? props.assoc.phone : "(401) 526-8243"}
        </span>
      </p>
    </>
  );
}
