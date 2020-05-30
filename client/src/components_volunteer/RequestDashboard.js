import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import RequestColumn from "./RequestColumn";
import { volunteer_status } from "../constants";

export default function RequestDashboard(props) {
  useEffect(() => {
    
  }, [props.user]);
  return (
        <Row>
            <Col style={{paddingRight: 35}}>
                <RequestColumn requests={props.pendingRequests} requestStatus={volunteer_status.PENDING}/>
            </Col>
            <Col style={{paddingRight: 35}}>
                <RequestColumn requests={props.acceptedRequests} requestStatus={volunteer_status.IN_PROGRESS} />
            </Col>
            <Col>
                <RequestColumn requests={props.completedRequests} requestStatus={volunteer_status.COMPLETE} />
            </Col>
        </Row>
  );
}
