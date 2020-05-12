import React, {useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import OrgRequests from './OrgRequests';
import { current_tab } from '../constants';
import { filter_requests } from './/OrganizationHelpers';

/*
 * Organization bulletin of requests
 */

export default function OrganizationRequestBoard(props) {
    const [unmatchedRequests, setUnmatchedRequests] = useState([]);
    const [matchedRequests, setMatchedRequests] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [loaded, setIsLoaded] = useState(false);

    const enumToRequests = (type) => {
        switch (type) {
            case current_tab.UNMATCHED:
                return unmatchedRequests;
            case current_tab.MATCHED:
                return matchedRequests;
            case current_tab.COMPLETED:
                return completedRequests;
            default:
                return [];
        }
    }

    useEffect(() => {
        setUnmatchedRequests(filter_requests(props.allRequests, current_tab.UNMATCHED));
        setMatchedRequests(filter_requests(props.allRequests, current_tab.MATCHED));
        setCompletedRequests(filter_requests(props.allRequests, current_tab.COMPLETED));
        setIsLoaded(true);
    }, [props.allRequests]);
    
    if (!loaded) {
        return false;
    }

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

    // Requests List based on current mode
    const requestsCol = (mode) => {
        const requests = enumToRequests(mode);
        return (
            <Container id="newOfferContainer" style={displayTab(mode)}>
                <OrgRequests setCurrRequest={props.setCurrRequest} setRequestDetailsModal={props.setRequestDetailsModal}
                             setInRequest={props.setInRequest} mode={mode} requests={requests}/>
            </Container>
        )
    }

    // Current mode tab
    const displaySelectedButton = (text, mode) => {
        const requests = enumToRequests(mode);
        return <Button id={tabID(mode)} 
                       onClick={() => {props.setCurrTab(mode)}}>
                {text} ({requests.length})
            </Button>
    }

    return (<>
        <Container style={{padding: 0,  marginLeft: 0}}>
            {displaySelectedButton('Unmatched', current_tab.UNMATCHED)}
            {displaySelectedButton('Matched', current_tab.MATCHED)}
            {displaySelectedButton('Completed', current_tab.COMPLETED)}
        </Container>
        {requestsCol(current_tab.UNMATCHED)}
        {requestsCol(current_tab.MATCHED)}
        {requestsCol(current_tab.COMPLETED)}
    </>)
}

OrganizationRequestBoard.propTypes = {
    currTabNumber: PropTypes.number,
    setCurrRequest: PropTypes.func,
    setRequestDetailsModal: PropTypes.func,
    setInRequest: PropTypes.func,
    setCurrTab: PropTypes.func,
    allRequests: PropTypes.array
};