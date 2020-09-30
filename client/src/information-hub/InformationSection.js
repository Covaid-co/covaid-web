import React, { useEffect, useState, setState } from "react";
import { generateURL } from "../Helpers";
import Container from "react-bootstrap/Container";
import NewsCard from "./NewsCard";
import Col from "react-bootstrap/Col";

import "./InformationSection.css";

export default function InformationSection(props) {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    async function getResources() {
      let params =
        props.mode === "assoc"
          ? { associationID: props.sectionID }
          : { sectionID: props.sectionID };

      var url = generateURL("/api/infohub/?", params);

      const response = await fetch(url);

      const jsonData = await response.json();

      setResources(jsonData);
    }
    getResources();
  }, [props.sectionID]);

  if (resources.length === 0) {
    return <>
       <h5 id="section-headings">{props.sectionName}</h5>
       <h6>As of now, there have been no resources shared by {props.sectionName}</h6>
    </>;
  }

  return (
    <>
      <h5 id="section-headings">{props.sectionName}</h5>

      <Container id="grid-container">
        {resources.map((resource, i) => {
          return (
            <a
              href={resource.url}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <Container id="link-container">
                <p id="link-title">{resource.name}</p>
                {(() => {
                  if (resource.name.length < 21) {
                    return (
                      <div id="link-description-box1">
                        <p id="link-description">{resource.description}</p>
                      </div>
                    );
                  } else {
                    return (
                      <div id="link-description-box2">
                        <p id="link-description">{resource.description}</p>
                      </div>
                    );
                  }
                })()}
              </Container>
            </a>
          );
        })}
      </Container>
    </>
  );
}
