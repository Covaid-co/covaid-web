import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Pagination from './CommunityBulletinComponents/Pagination'
import Offer from './components_homepage/Offer'
import Container from 'react-bootstrap/Container'

import NewFilterButton from './NewFilterButton'
import OfferDetails from './components_homepage/OfferDetails'
import { setFalseObj } from './Helpers';

export default function NewOffers(props) {

    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
    const [taskSelect, setTaskSelect] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const volunteersPerPage = 4;

    const [modalOfferOpen, setModalOfferOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({
        'personal_info': {
            'first_name': '',
            'last_name': '',
        },
        'email': '',
        'offer': {
            'tasks': [''],
            'details': '',
        },
        'location_info': {
            'neighborhoods': ['']
        }
    });

    useEffect(() => {
        setCurrentPage(1);
        setDisplayedVolunteers(props.volunteers.slice(0, volunteersPerPage));
        setTaskSelect(setFalseObj(props.resources));
    }, [props.resources, props.volunteers]);

    const paginatePage = (pageNumber) => {
        setCurrentPage(pageNumber);
        const lastIndex = pageNumber * volunteersPerPage;
        const firstIndex = lastIndex - volunteersPerPage;
        const slicedVolunteers = props.volunteers.slice(firstIndex, lastIndex);
        setDisplayedVolunteers(slicedVolunteers);
    }

    return (
        <>
            <OfferDetails modalOfferOpen={modalOfferOpen} 
                          setModalOfferOpen={setModalOfferOpen} 
                          modalInfo={modalInfo}
                          handleShowRequestHelp={() => props.handleShowRequestHelp(modalInfo)}/>
            <NewFilterButton resources={props.resources}
                             taskSelect={taskSelect} 
                             setTaskSelect={setTaskSelect} 
                             setDisplayedVolunteers={setDisplayedVolunteers}
                             volunteers={props.volunteers}
                             mobile={props.mobile}/>
            <Container id="newOfferContainer">
                <ListGroup variant="flush">
                    <Offer displayedVolunteers={displayedVolunteers}
                            setModalInfo={setModalInfo}
                            setModalOfferOpen={setModalOfferOpen} />
                    <Pagination
                        className='justfiy-content-center'
                        style = {{paddingTop: 15, marginTop: 50}}
                        postsPerPage={volunteersPerPage}
                        currPage={currentPage}
                        totalPosts={props.volunteers.length}
                        paginate={paginatePage}/>
                </ListGroup>
                
            </Container>
        </>
    );
}