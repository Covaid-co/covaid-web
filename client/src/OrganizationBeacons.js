import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import OrganizationBeaconModal from './OrganizationBeaconModal';

export default function OrganizationBeacons(props) {

    const [beacons, setBeacons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [association, setAssociation] = useState({});

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBeacon, setSelectedBeacon] = useState({});


    useEffect(() => {
        setBeacons(props.beacons.reverse());
        setAssociation(props.association);
        setLoading(false);
    }, [props.beacons, props.association]);

    if (loading) {
        return <></>
    } else {

        if (beacons.length === 0) {
            return <>
                     <p id="regular-text" style={{color: 'black', textAlign: "center", marginTop: 20}}>
                            <strong style={{fontSize: 18}}>You have no active beacons from your group at the moment</strong> 
                    </p>
            </>
        }

        return (
            <>
                <Row>
                    <Col xs={12}>
                        <ListGroup variant="flush">
                            {beacons.map((beacon, i) => {
                                return (
                                    <ListGroup.Item key={i} action onClick={() => {setSelectedBeacon({...beacon}); setModalOpen(true);}}>
                                        <div >
                                            <h5 id="volunteer-name">
                                                {beacon.beaconName}
                                            </h5>
                                        </div>
                                        <div style={{display: 'inline-block', width: '100%', marginTop: 3, fontFamily: 'Inter'}}>
                                            <p style={{float: 'left', marginBottom: 0}}>
                                                "{beacon.beaconMessage}"
                                            </p>
                                        </div>
                                    </ListGroup.Item>);
                                })}
                        </ListGroup>
                    </Col>
                </Row>
                <OrganizationBeaconModal 
                    beacon={selectedBeacon}
                    showBeaconModal={modalOpen}
                    setModalOpen={setModalOpen}
                    association={association}
                    />
            </>
            );
        }
}