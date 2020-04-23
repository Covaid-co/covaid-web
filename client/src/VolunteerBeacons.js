import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import VolunteerBeaconModal from './VolunteerBeaconModal';

export default function VolunteerBeacons(props) {

    const [beacons, setBeacons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [volunteer, setVolunteer] = useState({});

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBeacon, setSelectedBeacon] = useState({});

    useEffect(() => {
        setBeacons(props.beacons.reverse());
        setVolunteer(props.volunteer);
        setLoading(false);
    }, [props.beacons, props.volunteer]);

    const formatDate = (beacon) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        var start = new Date(beacon.beaconStartDate);
        var end = new Date(beacon.beaconEndDate);
        var startString = monthNames[start.getMonth()] + " " + start.getDate();
        var join = " - ";
        var endString = monthNames[end.getMonth()] + " " + end.getDate();

        if (startString === endString) {
            return startString;
        } else {
            return startString + join + endString;
        }
    }

    if (loading) {
        return <></>
    } else {

        if (beacons.length === 0) {
            return <>
                     <p id="regular-text" style={{color: 'black', textAlign: "center", marginTop: 20}}>
                            <strong style={{fontSize: 18}}>There are no active beacons from your group at the moment</strong> 
                    </p>
            </>
        }

        return (
            <>
                <Row>
                    <Col xs={12}>
                        <ListGroup variant="flush" style={{overflowY: "scroll", height: 300}}>
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
                                                {formatDate(beacon)}
                                            </p>
                                        </div>
                                    </ListGroup.Item>);
                                })}
                        </ListGroup>
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 15}}>&nbsp;</p>
                    </Col>
                </Row>
                <VolunteerBeaconModal 
                    beacon={selectedBeacon}
                    showBeaconModal={modalOpen}
                    setModalOpen={setModalOpen}
                    volunteer={volunteer}
                    />
            </>
            );
        }
}