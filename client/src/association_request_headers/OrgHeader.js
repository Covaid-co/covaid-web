import React from "react";

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
      <p id="regular-text" style={{ fontSize: 15 }}>
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
      {/* <p id="regular-text" style={{ fontSize: 15 }}>
        {props.translations[props.language].prioritizing} {props.assoc.city}{" "}
        {props.translations[props.language].areas}.
      </p> */}
      <p id="regular-text" style={{ fontSize: 15 }}>
        {props.translations[props.language].formManage} {props.assoc.city}{" "}
        {props.translations[props.language].managedBy}.
      </p>
      <p
        id="request-calling"
        style={{ borderBottom: "0px solid", marginBottom: 0, fontSize: 15 }}
      >
        {props.translations[props.language].call}:
        <br />
        <span id="phoneNumber">
          {props.assoc.phone ? props.assoc.phone : "(401) 526-8243"}
        </span>
      </p>
      <p id="regular-text" style={{ fontSize: 15 }}>
        {props.translations[props.language].questions}:{" "}
        <strong>{props.assoc.email}</strong>.
      </p>
      <p id="regular-text" style={{ fontSize: 15 }}>
        {props.translations[props.language].motto}
      </p>
    </>
  );
}
