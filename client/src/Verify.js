import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
const queryString = require('query-string');

export default function Verify(props) {
    function verify() {
        const ID = queryString.parse( props.location.search).ID;
        const response = fetch('/api/users/verify?ID=' + ID, {
            method: 'post'
        });
    }

    return (
        <div>
            <p> Redirecting... </p>
            {verify()}
            <Redirect to={{
                pathname: '/',
                verified: true
            }} />
        </div>
    );
}
