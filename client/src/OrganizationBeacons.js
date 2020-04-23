import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

import OrganizationBeaconModal from './OrganizationBeaconModal';
const BeaconStatusEnum = {"active":1, "inactive":2, "complete":3, "delete": 4};

export default function OrganizationBeacons(props) {

    const [beacons, setBeacons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [association, setAssociation] = useState({});

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBeacon, setSelectedBeacon] = useState({});

    const move = (beacon, to, from) => {
        props.move(beacon, to, from);
    }

    useEffect(() => {
        setBeacons(props.beacons.reverse());
        setAssociation(props.association);
        setLoading(false);
    }, [props.beacons, props.association]);

    const statusBadge = (type) => {
        switch (type) {
            case BeaconStatusEnum.active:
                return <Badge style={{float: "right", marginTop: 2}} className='active-beacon'>Active</Badge>;
            case BeaconStatusEnum.inactive:
                return <Badge style={{float: "right", marginTop: 2}} className='pending-task'>Inactive</Badge>;
            case BeaconStatusEnum.complete:
                return <Badge style={{float: "right", marginTop: 2, borderColor: '#28a745', color: '#28a745'}} className='pending-task'>Inactive</Badge>;
            default:
                return <></>;
        }
    };

    const getMode = (type) => {
        switch (type) {
            case BeaconStatusEnum.active:
                return "active";
            case BeaconStatusEnum.inactive:
                return "inactive";
            case BeaconStatusEnum.complete:
                return "complete";
            default:
                break;
        }
    }

    const getVolunteerStat = (beacon) => {
        const totalVolunteers = beacon.volunteers;
        const respondedVolunteers = totalVolunteers.filter(function (volunteer) {
            return volunteer.response;
        });

        return `${respondedVolunteers.length}/${totalVolunteers.length}`;
    }

    if (loading) {
        return <></>
    } else {

        if (beacons.length === 0) {
            return <>
                     <p id="regular-text" style={{color: 'black', textAlign: "center", marginTop: 20}}>
                            <strong style={{fontSize: 18}}>You have no {getMode(props.type)} beacons</strong> 
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
                                            {statusBadge(props.type)}
                                        </div>
                                        <div style={{display: 'inline-block', width: '100%', marginTop: 3, fontFamily: 'Inter'}}>
                                            <p style={{float: 'left', marginBottom: 0, color: "#2670FF"}}>
                                                Volunteers Responded: {getVolunteerStat(beacon)}
                                            </p>
                                        </div>
                                    </ListGroup.Item>);
                                })}
                        </ListGroup>
                    </Col>
                </Row>
                <OrganizationBeaconModal 
                    beacon={selectedBeacon}
                    volunteers={selectedBeacon.volunteers}
                    showBeaconModal={modalOpen}
                    setModalOpen={setModalOpen}
                    association={association}
                    type={props.type}
                    move={move}
                    />
            </>
            );
        }
}