import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function NeededBy(props) {
  const handleChangeTime = (event) => {
    event.persist();
    var result = event.target.value;
    props.setTime(result);
  };
  const handleChangeDate = (event) => {
    event.persist();
    var result = event.target.value;
    props.setDate(result);
  };

  return (
    <>
      <h5 id="regular-text-bold" style={{ marginTop: "26px", marginBottom: 5 }}>
        {props.translations[props.language].WhenNeeded}?
      </h5>
      <Row>
        <Col xs={6} style={{ paddingRight: "4px" }}>
          <Form.Group controlId="time" onChange={handleChangeTime}>
            <Form.Control as="select">
              <option value="Morning">
                {props.translations[props.language].Morning}
              </option>
              <option value="Afternoon">
                {props.translations[props.language].Afternoon}
              </option>
              <option value="Evening">
                {props.translations[props.language].Evening}
              </option>
              <option value="Night">
                {props.translations[props.language].Night}
              </option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={6} style={{ paddingLeft: "4px" }}>
          <Form.Group controlId="date" bssize="large">
            <Form.Control as="select" onChange={handleChangeDate}>
              <option>
                {new Date(Date.now()).toLocaleString().split(",")[0]}
              </option>
              <option>
                {new Date(Date.now() + 86400000).toLocaleString().split(",")[0]}
              </option>
              <option>
                {
                  new Date(Date.now() + 2 * 86400000)
                    .toLocaleString()
                    .split(",")[0]
                }
              </option>
              <option>
                {
                  new Date(Date.now() + 3 * 86400000)
                    .toLocaleString()
                    .split(",")[0]
                }
              </option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}
