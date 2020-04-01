import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'

import NewFilterButton from './NewFilterButton'
import OfferDetails from './OfferDetails'

export default function NewOffers(props) {

    const [volunteers, setVolunteers] = useState([]);
    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
    const [resources, setResources] = useState([]);
    const [taskSelect, setTaskSelect] = useState({});

    const [modalOfferOpen, setModalOfferOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({
        'first_name': '',
        'last_name': '',
        'email': '',
        'offer': {
            'tasks': [''],
            'details': '',
            'neighborhoods': ['']
        }
    });

    useEffect(() => {
        if (Object.keys(props.state.currentAssoc).length > 0) {
            setResources(props.state.currentAssoc.resources);
        } else {
            setResources(['Food/Groceries', 'Medication', 'Emotional Support', 'Donate', 'Academic/Professional', 'Misc.']);
        }
        var url = "/api/users/all?";
        let params = {
            'latitude': props.state.latitude,
            'longitude': props.state.longitude
        }
        let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
        url += query;

        async function fetchData() {
            const response = await fetch(url);
            response.json().then((data) => {
                setVolunteers(data);
                setDisplayedVolunteers(data);
            });
        }

        for (var i = 0; i < resources.length; i++) {
            const taskName = resources[i];
            setTaskSelect(prev => ({ 
                ...prev,
                [taskName]: false,
            }));
        }
        if (props.state.latitude && props.state.longitude){
            fetchData();
        }
    }, [props.state.currentAssoc, props.state.latitude, props.state.longitude]);


    return (
        <>
            <OfferDetails modalOfferOpen={modalOfferOpen} 
                          setModalOfferOpen={setModalOfferOpen} 
                          modalInfo={modalInfo}
                          handleShowRequestHelp={() => props.handleShowRequestHelp(modalInfo)}/>
            <NewFilterButton resources={resources}
                             taskSelect={taskSelect} 
                             setTaskSelect={setTaskSelect} 
                             setDisplayedVolunteers={setDisplayedVolunteers}
                             volunteers={volunteers}/>
            <Container className="shadow mb-5 bg-white rounded" id="offerContainer">
                <ListGroup variant="flush">
                    {displayedVolunteers.map((user, i) => {
                        return (<ListGroup.Item action onClick={() => {setModalInfo({...user}); setModalOfferOpen(true)}}>
                            <div >
                                <h5 className="volunteer-name">
                                    {user.first_name}
                                </h5>
                                <h5 className="association-name"> Pittsburgh Mutual Aid</h5>
                            </div>
                            <p className="volunteer-location">{user.offer.neighborhoods.join(', ')}</p>
                            <div>
                                {user.offer.tasks.map((task, i) => {
                                    return <Badge key={i} className='task-info'>{task}</Badge>
                                })}
                            </div>
                        </ListGroup.Item>);
                    })}
                    {displayedVolunteers.length === 0 ? <p id="no-offers">Seems to be no offers in your area. Make sure to spread the word to get your community involved!</p> : ''}
                </ListGroup>
            </Container>
        </>
    );
}