import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup'
import Pagination from './CommunityBulletinComponents/Pagination'
import Offer from './components_homepage/Offer'
import Container from 'react-bootstrap/Container'

import NewFilterButton from './NewFilterButton'
import OfferDetails from './components_homepage/OfferDetails'
import { setFalseObj } from './Helpers';

/**
 * Community Bulletin of volunteers for the homepage
 */

export default function CommunityBulletin(props) {
    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
    const [currentVolunteers, setCurrentVolunteers] = useState([]);
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
        setCurrentVolunteers(props.volunteers);
        setDisplayedVolunteers(props.volunteers.slice(0, volunteersPerPage));
        setTaskSelect(setFalseObj(props.resources));
    }, [props.resources, props.volunteers]);

    const paginatePage = (pageNumber) => {
        setCurrentPage(pageNumber);
        const lastIndex = pageNumber * volunteersPerPage;
        const firstIndex = lastIndex - volunteersPerPage;
        const slicedVolunteers = currentVolunteers.slice(firstIndex, lastIndex);
        setDisplayedVolunteers(slicedVolunteers);
    }

    const reloadPagination = (volunteers) => {
        setCurrentPage(1);
        setCurrentVolunteers(volunteers);
        setDisplayedVolunteers(volunteers.slice(0, volunteersPerPage));
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
                             reloadPagination={reloadPagination}
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
                        totalPosts={currentVolunteers.length}
                        paginate={paginatePage}/>
                </ListGroup>
            </Container>
        </>
    );
}

CommunityBulletin.propTypes = {
    handleShowRequestHelp: PropTypes.func,
    volunteers: PropTypes.array,
    resources: PropTypes.array,
    mobile: PropTypes.bool
};