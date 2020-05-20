import React, { useState } from "react";
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import NewMap from './NewMap';
import { current_tab } from '../constants';

/*
 * Map that displays requesters/volunteers for and organization
 */

export default function OrganizationMap(props) {
	const [requesterMap, setRequesterMap] = useState(true);
    const [volunteerMap, setVolunteerMap] = useState(false);
    
    const requesterStyle = () => {
		if (!requesterMap) {
			if (props.mode === current_tab.UNMATCHED) {
				return {border: '1px solid #DB4B4B', color: '#DB4B4B'}
			} else if (props.mode === current_tab.MATCHED) {
				return {border: '1px solid #DB9327', color: '#DB9327'}
			} else if (props.mode === current_tab.COMPLETED) {
				return {border: '1px solid #28A745', color: '#28A745'}
			}
		} else {
			if (props.mode === current_tab.UNMATCHED) {
				return {border: '1px solid #DB4B4B', background: '#DB4B4B', color: 'white'}
			} else if (props.mode === current_tab.MATCHED) {
				return {border: '1px solid #DB9327', background: '#DB9327', color: 'white'}
			} else if (props.mode === current_tab.COMPLETED) {
				return {border: '1px solid #28A745', background: '#28A745', color: 'white'}
			}
		}
	}

    return (
        <Container id="newOfferContainer" style={{'display': 'block', marginTop: 0}}>
            <Col xs={12} style={{padding: 0, marginBottom: 10}}>
                <p id="small-header" style={{display: 'inline'}}>{props.width < 600 ? 'Map' : 'Organization Map'}</p>
                <Button id={!volunteerMap ? "volunteer-not-selected" : "volunteer-selected"} onClick={() => setVolunteerMap(!volunteerMap)}>
                    Volunteers
                </Button>
                <Button id={!requesterMap ? "requester-not-selected" : "requester-selected"} 
                    onClick={() => setRequesterMap(!requesterMap)}
                    style={requesterStyle()}>
                    Requesters
                </Button>
            </Col>
            <NewMap { ...props } requesterMap={requesterMap} volunteerMap={volunteerMap}/>
        </Container>
    )
}

OrganizationMap.propTypes = {
    mode: PropTypes.number,
    width: PropTypes.number
};