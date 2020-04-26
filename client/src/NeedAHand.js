import React from "react";
import { Redirect } from 'react-router-dom';

export default function NeedAHand(props) {
    return (
        <div style = {{textAlign: 'center'}}>
            <p style = {{marginTop: 30}}> Redirecting... </p>
            <Redirect to={{
                pathname: '/',
                requestHelp: true
            }} />
        </div>
    );
}
