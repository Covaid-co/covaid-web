import React from "react";
import { Redirect } from 'react-router-dom';

export default function OrgReset(props) {
    return (
        <div style = {{textAlign: 'center'}}>
            <p style = {{marginTop: 30}}> Redirecting... </p>
            <Redirect to={{
                pathname: '/organizationPortal',
                orgReset: true
            }} />
        </div>
    );
}
