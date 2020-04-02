import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
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
                                    <h5 className="association-name">{user.association_name}</h5>
                                </div>
                                <p className="volunteer-location">{user.offer.neighborhoods.join(', ')}</p>
                                <div>
                                    {user.offer.tasks.map((task, i) => {
                                        return <Badge key={i} className='task-info'>{task}</Badge>
                                    })}
                                </div>
                            </ListGroup.Item>);
                        })}
            {displayedVolunteers.length === 0 ? 
                <div>
                    <p id="no-offers">
                        <strong style={{fontSize: 18}}>There seems to be no offers in your area. <br/></strong> 
                        Use the <strong>Request Help</strong> button and we will match you with a volunteer in your area!
                    </p>
                </div>
            : ''}
        </>
    );
};

export default Offer;