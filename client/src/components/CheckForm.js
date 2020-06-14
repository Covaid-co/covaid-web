import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

export default function CheckForm(props) {
  const handleObjChange = (key) => {
    props.setObj((prev) => ({
      ...prev,
      [key]: !props.obj[key],
    }));
  };

  const sortedObj = Object.keys(props.obj);
  if (props.sort === undefined || props.sort === true) {
    sortedObj.sort();
  }

  return (
    <>
      {sortedObj.map((key) => {
        const isTranslated = props.translations ? true : false;
        const taskString =
          isTranslated && props.translations[props.language][key]
            ? props.translations[props.language][key]
            : key;
        return (
          <Button
            key={key}
            disabled={props.disabled}
            id={props.obj[key] ? "selected" : "notSelected"}
            onClick={() => handleObjChange(key)}
          >
            {taskString}
          </Button>
        );
      })}
    </>
  );
}
