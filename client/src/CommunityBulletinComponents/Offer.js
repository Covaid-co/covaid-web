import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

const Offer = ({ displayedUsers, handleShow, setModal }) => {
  return (
    <>
        {displayedUsers.map((user, i) => {
            var name = user.first_name + " " + user.last_name;
            return <ListGroup.Item key={user._id + String(i * 19)} action 
                                            style = {{fontSize: 16}} 
                                            onClick={() => { handleShow(); setModal({...user});}}>
                            <Row>
                                <Col style={{whiteSpace: "normal"}}>
                                    <div style={{whiteSpace: "normal", wordWrap: "break-word"}}>{name}</div>
                                    <div style={{whiteSpace: "normal"}}>{user.offer.neighborhoods.map((neighborhood, i) => {
                                        return <>
                                            <Badge key={user._id + neighborhood + String(i * 14)} 
                                                            style = {{whiteSpace: "normal"}} 
                                                            pill 
                                                            variant="warning">
                                                            {neighborhood}
                                                    </Badge> </>
                                    })}</div>
                                </Col>
                                <Col style={{whiteSpace: "normal"}}>{user.offer.tasks.map((task, i) => {
                                        return <><Badge key={user._id + task + String((i + 1) * 23)} style = {{whiteSpace: "normal"}} pill variant="primary">{task}</Badge>{' '}</>
                                    })}</Col>
                            </Row>
                        </ListGroup.Item>
        })}
    </>
  );
};

export default Offer;