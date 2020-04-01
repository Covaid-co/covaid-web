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
import Pagination from './CommunityBulletinComponents/Pagination'
import Offer from './CommunityBulletinComponents/Offer'
import Container from 'react-bootstrap/Container'

import NewFilterButton from './NewFilterButton'
import OfferDetails from './OfferDetails'

export default function NewOffers(props) {

    const [volunteers, setVolunteers] = useState([]);
    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
    const [resources, setResources] = useState([]);
    const [taskSelect, setTaskSelect] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(7);

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
                console.log(data);
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

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentDisplayedUsers = displayedVolunteers.slice(indexOfFirstPost, indexOfLastPost)

    const paginate = pageNumber => setCurrentPage(pageNumber);


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
                <Offer displayedVolunteers={currentDisplayedUsers}
                        setModalInfo={setModalInfo}
                        setModalOfferOpen={setModalOfferOpen} 
                />
                <Pagination
                    className='justfiy-content-center'
                    style = {{paddingTop: 15, marginTop: 50}}
                    postsPerPage={postsPerPage}
                    totalPosts={displayedVolunteers.length}
                    paginate={paginate}
                />
                </ListGroup>
                
            </Container>
        </>
    );
}