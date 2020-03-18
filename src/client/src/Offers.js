import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


export default function Offers() {
    const [offers, setOffers] = useState([]);
    
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/offers');
            response.json().then((data) => {
                setOffers(data);
            });
        }
        fetchData();
      }, []);

    return (
        <div className="shadow p-3 mb-5 bg-white rounded">
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Row>
                        <Col>Task</Col>
                        <Col>Neighborhood</Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup variant="flush">
                {offers.map((offer) => {
                    return <ListGroup.Item  key={offer._id} action href = {offer._id} style = {{fontSize: 12}}>
                            <Row>
                                <Col>{offer.task}</Col>
                                <Col>{offer.neighborhood_name}</Col>
                            </Row>
                        </ListGroup.Item>
                })}
            </ListGroup>
        </div>
    );
}