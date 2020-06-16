import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import {Pencil , Trash} from "react-bootstrap-icons";

export default function TaskList(props) {
  const [resources, setResources] = useState(props.association.resources);
  const [hasChanged, setHasChanged] = useState(false);

  const handleChange = (event, key) => {
    event.persist();
    var newResource = event.target.value;
    let newResources = [...resources];
    newResources[key] = newResource;
    setResources(newResources);
    setHasChanged(true);
  };

  const handleDelete = (event, key) => {
  	event.persist();
  	let newResources = [...resources];
  	newResources.splice(key, 1);
 

  	setResources(newResources);
  	setHasChanged(true);
  }

  const updateResources = async (e) => {
    e.preventDefault();
    
    let form = {
      associationID: props.association._id,
      resources: resources.filter(resource => resource.trim().length > 0),
      //check to remove empty resources
    };

    fetch("/api/association/update_resources", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          setHasChanged(false);
          props.setAssociation({
            ...props.association,
            resources: resources.filter(resource => resource.trim().length > 0),
          });
        } else {
          alert("unable to attach");
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const addResource = () => {
    let newResources = [...resources];
    newResources.unshift("");

    setResources(newResources);
  }

  const _addResourceButton = () => {
    return (
      <Button variant="primary" 
                size="sm"
                onClick={addResource}
               
                
        >
          <b>Add</b>
        </Button>
    );
  };

  const _saveButton = () => {
    return (
      
        <Button variant="primary" 
                size="sm"
                onClick={hasChanged ? updateResources : null}
                disabled={!hasChanged}
                
        >
          <b>Save</b>
        </Button>
     
    );
  };

  return (
	<>
	  <Modal.Header>
        <Modal.Title style={{ marginLeft: 5 }}> 
          <Row>
            <Col xl={8}>
              Available Resources 
            </Col>
            <Col lg={2}>
              {_addResourceButton()} 
            </Col>
            <Col lg={1}>
              {_saveButton()} 
            </Col>
          </Row> 
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ paddingTop: 0 }}>
      	<ListGroup 
          id="resourceList"
      	  variant="flush"
          style={{ overflowY: "scroll", height: 200}} >

	 	{resources.map((resource, key) => 
	 	  <ListGroupItem
	 	  				 style={{padding: 0, margin: 0}}> 

	 	  	<InputGroup className="mb-3">

		      <FormControl
		        value={resource}
		        aria-describedby="basic-addon2"
		        key={key}
		        id={key}
		        onChange={(evt) => handleChange(evt, key)}
		        
		      />
		      <InputGroup.Append>
		        <Button variant="outline-secondary"
		        		onClick={(evt) => handleDelete(evt, key)}> <Trash /> </Button>
		      </InputGroup.Append>
		    </InputGroup>

	 	  	
	 	  </ListGroupItem>
	 	)}
	 	</ListGroup>
	  </Modal.Body>
	</>
	);
}

TaskList.propTypes = {
  association: PropTypes.object
};