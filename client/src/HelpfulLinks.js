import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function HelpfulLinks() {

    return (
        <div className="shadow p-3 mb-5 bg-white rounded">
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Row>
                        <Col>Useful Resources in the Midst of COVID-19</Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup variant="flush">
                <ListGroup.Item key='0' style = {{fontSize: 12}} >
                    <Row>
                        <Col><a target="_blank" 
                                href="https://coronavirus.jhu.edu/map.html"
                                rel="noopener noreferrer">Live COVID-19 Statistics</a></Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item key='1' style = {{fontSize: 12}} >
                    <Row>
                        <Col><a target="_blank"  
                                href="https://www.healingjustice.org/podcast/corona"
                                rel="noopener noreferrer">Resources about online support groups</a></Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item key='2' style = {{fontSize: 12}} >
                    <Row>
                        <Col><a target="_blank" 
                                href="https://docs.google.com/document/d/1y5ST-wUZ6ASh-j6pQ7zmdwEsJIHI0MjtL97aGb7awmM/edit?fbclid=IwAR17xA1fmLUY9faEhPFS5l5JyKN76vynIY-5SZh6e8Iz6Uqa69vAXdKeQcs"
                                rel="noopener noreferrer">COVID-19 Prevention Information</a></Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item key='3' style = {{fontSize: 12}} >
                    <Row>
                        <Col><a target="_blank" 
                                rel="noopener noreferrer"
                                href="https://www.mapping-access.com/blog-1/2020/3/10/accessible-teaching-in-the-time-of-covid-19">Accessibe teaching</a></Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item key='4' style = {{fontSize: 12}} >
                    <Row>
                        <Col><a target="_blank" 
                                rel="noopener noreferrer"
                                href="https://afsp.org/taking-care-of-your-mental-health-in-the-face-of-uncertainty/">Mental health in the face of uncertainty</a></Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item key='5' style = {{fontSize: 12}} >
                    <Row>
                        <Col><a target="_blank" 
                                rel="noopener noreferrer"
                                href="https://www.epa.gov/pesticide-registration/list-n-disinfectants-use-against-sars-cov-2">EPA List of disinfectants that kill coronavirus</a></Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}