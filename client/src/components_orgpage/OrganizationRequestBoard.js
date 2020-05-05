import React from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import UnmatchedRequests from '../UnmatchedRequests';

/*
 * Organization bulletin of requests
 */

export default function OrganizationRequestBoard(props) {

    const tabID = (tabNumber) => {
        return (tabNumber === props.currTabNumber) ? 'tab-button-selected' : 'tab-button';
    }

    const displayTab = (tabNumber) => {
		if (tabNumber === props.currTabNumber) {
			return {'display': 'block', paddingLeft: 15, paddingTop: 15};
		} else {
			return {'display': 'none', paddingLeft: 15, paddingTop: 15};
		}
    }

    const requestsCol = (mode, requests) => {
        return (
            <Container id="newOfferContainer" style={displayTab(mode)}>
            <UnmatchedRequests setCurrRequest={props.setCurrRequest} 
                               setRequestDetailsModal={props.setRequestDetailsModal}
                               setInRequest={props.setInRequest}
                               mode={mode} requests={requests}/>
        </Container>
        )
    }

    return (<>
        <Container style={{padding: 0,  marginLeft: 0}}>
            <Button id={tabID(1)} onClick={() => {props.setCurrTab(1)}}>
                Unmatched ({props.unmatched.length})</Button>
            <Button id={tabID(2)} onClick={() => {props.setCurrTab(2)}}>
                Matched ({props.matched.length})</Button>
            <Button id={tabID(3)} onClick={() => {props.setCurrTab(3)}}>
                Completed ({props.completed.length})</Button>
        </Container>
        {requestsCol(1, props.unmatched)}
        {requestsCol(2, props.matched)}
        {requestsCol(3, props.completed)}
    </>)
}

OrganizationRequestBoard.propTypes = {
    currTabNumber: PropTypes.number,
    setCurrRequest: PropTypes.func,
    setRequestDetailsModal: PropTypes.func,
    setInRequest: PropTypes.func,
    setCurrTab: PropTypes.func,
    unmatched: PropTypes.array,
    matched: PropTypes.array,
    completed: PropTypes.array
};