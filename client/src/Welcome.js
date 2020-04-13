import React from "react";
import { Redirect } from 'react-router-dom';

export default function Welcome(props) {
    return (
        <div style = {{textAlign: 'center'}}>
            <p style = {{marginTop: 30}}> Redirecting... </p>
            <Redirect to={{
                pathname: '/',
                verified: true
            }} />
        </div>
    );
}
