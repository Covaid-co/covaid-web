/**
 * Active beacons tied to a volunteer
 */

import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

import VolunteerBeaconModal from './VolunteerBeaconModal';

export default function VolunteerBeacons(props) {

    const [beacons, setBeacons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [volunteer, setVolunteer] = useState({});

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBeacon, setSelectedBeacon] = useState({});

    const refetchBeacons = () => {
        props.fetchBeacons();
    }

    useEffect(() => {
        setBeacons(props.beacons.reverse());
        setVolunteer(props.volunteer);
        setLoading(false);
    }, [props.beacons, props.volunteer]);

    // Render the date for when a beacon will expire
    const formatDate = (beacon) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        var end = new Date(beacon.beaconEndDate);
        var endString = monthNames[end.getMonth()] + " " + end.getDate();

        return "Expires on " + endString;
    }

    // Render badge depending on whether beacon has been accepted by user
    const getBadge = (beacon) => {
        var volunteerData = beacon.volunteers.find(b => {
            return b.volunteer_id === volunteer._id;
        })
        if (volunteerData.response) {
            return <Badge className='in-progress-task' style={{marginTop: 0, color: "#28a745", border: "1px solid #28a745"}}>Accepted</Badge>;
        } else {
            return <Badge className='in-progress-task' style={{marginTop: 0}}>Not Accepted</Badge>;
        }
    }

    if (loading) {
        return <></>
    } else {

        // Default text is there are no beacons
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
                                            <p style={{float: 'right', marginBottom: 0}}>
                                                {getBadge(beacon)}
                                            </p>
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
                    refetchBeacons={refetchBeacons}
                    />
            </>
            );
        }
}