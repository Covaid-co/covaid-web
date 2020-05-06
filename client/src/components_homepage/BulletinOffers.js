import React from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
 
/**
 * Offers on the community bulletin
 */
 
export default function BulletinOffers({ displayedVolunteers, setModalInfo, setModalOfferOpen }) {
    return (
        <>
            {displayedVolunteers.map((user, i) => {
                return (<ListGroup.Item key={i} action onClick={() => {setModalInfo({...user}); setModalOfferOpen(true)}}>
                    <div>
                        <h5 id="volunteer-name">
                            {user.first_name}
                        </h5>
                        <h5 id="association-name">
                            {user.association_name === '' || user.association_name === 'Covaid' ? '' : user.association_name}
                        </h5>
                    </div>
                    <p id="volunteer-location">
                        {user.offer.neighborhoods.join(', ')}
                    </p>
                    <div>
                        {user.offer.tasks.map((task, i) => {
                            return <Badge key={i} id='task-info'>{task}</Badge>
                        })}
                    </div>
                </ListGroup.Item>);
            })}
            {displayedVolunteers.length === 0 ? 
                <div>
                    <p id="regular-text" style={{color: 'black'}}>
                        <strong style={{fontSize: 18}}>There seems to be no offers in your area. <br/></strong> 
                        Use the <strong>Request support</strong> button and we will match you with a volunteer in your area!
                    </p>
                </div>
            : ''}
        </>
    );
}

BulletinOffers.propTypes = {
    displayedVolunteers: PropTypes.array,
    setModalInfo: PropTypes.func,
    setModalOfferOpen: PropTypes.func
};