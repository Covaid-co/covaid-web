import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
 
const Offer = ({ displayedVolunteers, setModalInfo, setModalOfferOpen }) => {
  return (
    <>
        {displayedVolunteers.map((user, i) => {
                        return (<ListGroup.Item action onClick={() => {setModalInfo({...user}); setModalOfferOpen(true)}}>
                            <div >
                                <h5 className="volunteer-name">
                                    {user.first_name}
                                </h5>
                                <h5 className="association-name"> {user.association_name}</h5>
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
    </>
  );
};

export default Offer;