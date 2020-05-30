import React, { useEffect, useState, setState } from "react";
import { generateURL } from "../Helpers";
import Container from 'react-bootstrap/Container';
import NewsCard from './NewsCard';
import Col from "react-bootstrap/Col";

import "./InformationSection.css";

export default function InformationSection(props) {
	const [resources, setResources] = useState([]);

	useEffect(() => {
		async function getResources() {
	      let params = { sectionID: props.sectionID };

	      var url = generateURL("/api/infohub/?", params);

	      const response = await fetch(url);

          const jsonData = await response.json()

          setResources(jsonData);
	  } 
      getResources();
	}, [props.sectionID]);

    return (
        <>
            <h5 id="section-headings">
                {props.sectionName}
            </h5>

            <Container id="grid-container">
                {resources.map((resource, i) => {
                    return (
                            <a href = {resource.url} target = "_blank" style = {{textDecoration: "none"}}>
                                <Container id="link-container">
                                    <p id="link-title">{resource.name}</p>
                                    <p id="link-description">{resource.description}</p>
                                </Container>
                            </a>
                        );
                    })
                }
            </Container>
        </>
    );
};