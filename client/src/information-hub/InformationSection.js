import React, { useEffect, useState, setState } from "react";
import { generateURL } from "../Helpers";
import Container from 'react-bootstrap/Container';
import NewsCard from './NewsCard';
import Col from "react-bootstrap/Col";

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
            <h5
                id="section-headings"
                style={{ fontSize: 28, fontWeight: "bold", color: "black"}}
            >
                {props.sectionName}
            </h5>

            <Container style = {{display: "grid", gridTemplateColumns: "33.33% 33.33% 33.33%", marginLeft: 0, paddingLeft: 0, marginRight: 0, paddingRight: 0, maxWidth: 2500}}>
                {resources.map((resource, i) => {
                    return (
                            <a href = {resource.url} target = "_blank" style = {{textDecoration: "none"}}>
                                <Container
                                    id="newOfferContainer"
                                    style={{ display: "block", margin: 10, overflowY: "auto", height: 150, width: "auto"}}
                                >
                                    <p style = {{fontSize: 20, fontWeight: "bold", color: "black", marginBottom: 8, lineHeight: 1.3}}>{resource.name}</p>
                                    <p style = {{fontSize: 15, color: "#7F7F7F", marginTop: 8, lineHeight: 1.2}}>{resource.description}</p>
                                </Container>
                            </a>
                        );
                    })
                }
            </Container>
        </>
    );
};