import React from 'react';
import Badge from 'react-bootstrap/Badge';

export default function VolunteerBadge(props) {
    return (
        // <OverlayTrigger
        //     key='bottom'
        //     placement='bottom'
        //     overlay={
        //     <Tooltip id={`tooltip-bottom`}>
        //         Number of active volunteers on Covaid!
        //     </Tooltip>}>
            <Badge aria-describedby='tooltip-bottom' variant="success" id='volunteerBadge'>{props.totalVolunteers} Volunteers</Badge>
        // {/* </OverlayTrigger> */}
    );
}