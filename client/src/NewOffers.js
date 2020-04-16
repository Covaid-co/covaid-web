import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Pagination from './CommunityBulletinComponents/Pagination'
import Offer from './CommunityBulletinComponents/Offer'
import Container from 'react-bootstrap/Container'

import NewFilterButton from './NewFilterButton'
import OfferDetails from './OfferDetails'
import { generateURL } from './Helpers'
import { defaultResources } from './constants'

export default function NewOffers(props) {

    const [volunteers, setVolunteers] = useState([]);
    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
    const [resources, setResources] = useState([]);
    const [taskSelect, setTaskSelect] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const volunteersPerPage = 4;

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
        setCurrentPage(1);
        if (Object.keys(props.state.currentAssoc).length > 0) {
            setResources(props.state.currentAssoc.resources);
        } else {
            setResources(defaultResources);
        }

        let params = {'latitude': props.state.latitude, 'longitude': props.state.longitude}
        var url = generateURL("/api/users/all?", params);
        async function fetchData() {
            const response = await fetch(url);
            response.json().then((data) => {
                setVolunteers(data.slice(0, Math.min(data.length, 20)));
                setDisplayedVolunteers(data.slice(0, volunteersPerPage));
            });
        }
        if (props.state.latitude && props.state.longitude){
            fetchData();
        }

        for (var i = 0; i < resources.length; i++) {
            const taskName = resources[i];
            setTaskSelect(prev => ({ 
                ...prev,
                [taskName]: false,
            }));
        }
    }, [props.state.currentAssoc, props.state.latitude, props.state.longitude]);

    const paginatePage = (pageNumber) => {
        setCurrentPage(pageNumber);
        const lastIndex = pageNumber * volunteersPerPage;
        const firstIndex = lastIndex - volunteersPerPage;
        const slicedVolunteers = volunteers.slice(firstIndex, lastIndex);
        setDisplayedVolunteers(slicedVolunteers);
    }

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
                    <Offer displayedVolunteers={displayedVolunteers}
                            setModalInfo={setModalInfo}
                            setModalOfferOpen={setModalOfferOpen} />
                    <Pagination
                        className='justfiy-content-center'
                        style = {{paddingTop: 15, marginTop: 50}}
                        postsPerPage={volunteersPerPage}
                        currPage={currentPage}
                        totalPosts={volunteers.length}
                        paginate={paginatePage}/>
                </ListGroup>
                
            </Container>
        </>
    );
}