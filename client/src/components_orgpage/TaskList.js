import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

export default function TaskList(props) {
  const [resources, setResources] = useState(props.association.resources);

  return (
	<>
	  <Modal.Header>
        <Modal.Title style={{ marginLeft: 5 }}> Available Resources </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ paddingTop: 0 }}>
      	<ListGroup 
      	  variant="flush"
          style={{ overflowY: "scroll", height: 200}} >

	 	{resources.map(resource => 
	 	  <ListGroupItem> {resource} </ListGroupItem>
	 	)}
	 	</ListGroup>
	  </Modal.Body>
	</>
	);
}

TaskList.propTypes = {
  association: PropTypes.object
};