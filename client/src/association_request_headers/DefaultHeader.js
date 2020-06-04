import React from "react";

export default function DefaultHeader(props) {
  return (
    <>
      <p id="info">{props.translatedStrings[props.language].Step2Text1}</p>
      <p id="info">
        {props.translatedStrings[props.language].Step2Text2}
        <font style={{ color: "#2670FF" }}>(401) 526-8243</font>
      </p>
    </>
  );
}
