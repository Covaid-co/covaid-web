import React, { useState, useEffect } from "react";
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'
import NewMap from '../components_orgpage/NewMap';

export default function MapModal(props) {

    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        if (volunteers.length === 0) {
            fetch('api/users/actual_all', {
                method: 'get',
                headers: {'Content-Type': 'application/json'},
            }).then((response) => {
                if (response.ok) {
                    response.json().then(data => {
                        var result = [];
                        for (var i = 0; i < data.length; i++) {
                            var temp = {};
                            const randomNum = Math.random();
                            const randomAdd = randomNum / 500;
                            if (randomNum < 0.25) {
                                temp['latitude'] = data[i].latlong[1] + randomAdd;
                                temp['longitude'] = data[i].latlong[0] + randomAdd;
                            } else if (randomNum > 0.25 && randomNum < 0.5) {
                                temp['latitude'] = data[i].latlong[1] + randomAdd;
                                temp['longitude'] = data[i].latlong[0] - randomAdd;
                            } else if (randomNum > 0.5 && randomNum < 0.75) {
                                temp['latitude'] = data[i].latlong[1] - randomAdd;
                                temp['longitude'] = data[i].latlong[0] + randomAdd;
                            } else {
                                temp['latitude'] = data[i].latlong[1] - randomAdd;
                                temp['longitude'] = data[i].latlong[0] - randomAdd;
                            }
                            temp['_id'] = data[i]._id;
                            result.push(temp);
                        }
                        setVolunteers(result);
                    });
                } else {
                    console.log(response);
                }
            }).catch((e) => {
                console.log(e);
            });
        }
    }, [volunteers]);

    return (
        <Modal show={props.showModal} size="lg" style={{marginTop: 10}} onHide={props.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{props.mobile ? 'Covaid Map' : 'Covaid Volunteer Map'} <Badge id='volunteerBadge'>{props.totalVolunteers} Volunteers</Badge></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p id="regular-text">Covaid volunteers are nationwide! Spread the word so more people can get support!</p>
                <NewMap volunteers={volunteers} public={true}/>
            </Modal.Body>
        </Modal>
    );
}
