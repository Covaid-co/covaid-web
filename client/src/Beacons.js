import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Beacons(props) {

    const [beacons, setBeacons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setBeacons(props.beacons);
        setLoading(false);
    }, [props.beacons]);

    if (loading) {
        return <></>
    } else {

    
    return (
        <>
            <Row>
                <Col xs={12}>
                    <ListGroup variant="flush">
                        {beacons.map((beacon, i) => {
                            return (
                                <ListGroup.Item key={i}>
                                    <h5 id="volunteer-name">
                                        {beacon.beaconName}
                                    </h5>
                                </ListGroup.Item>);
                            })}
                    </ListGroup>
                </Col>
            </Row>
        </>
        );
    }
}