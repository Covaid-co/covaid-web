import React from 'react';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function VolunteerBadge(props) {
    return (
        <OverlayTrigger
            key='bottom'
            placement='bottom'
            overlay={
            <Tooltip id={`tooltip-bottom`}>
                Number of active volunteers on COVAID!
            </Tooltip>}>
            <Badge variant="success" id='volunteerBadge'>{props.totalVolunteers} Volunteers</Badge>
        </OverlayTrigger>
    );
}