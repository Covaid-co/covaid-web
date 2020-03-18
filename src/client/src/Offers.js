import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


export const Offers = () => {
    return (
        <div class="shadow p-3 mb-5 bg-white rounded">
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Row>
                        <Col>Task</Col>
                        <Col>Neighborhood</Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup variant="flush">
                <ListGroup.Item action href = '#' style = {{fontSize: 12}}>
                    <Row>
                        <Col>Groceries</Col>
                        <Col>Crown Heights</Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item action href = '#1' style = {{fontSize: 12}}>
                    <Row>
                        <Col>Groceries, Health Products</Col>
                        <Col>Squirrel Hill</Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item action href = '#2' style = {{fontSize: 12}}>
                    <Row>
                        <Col>Groceries</Col>
                        <Col>Shadyside</Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}