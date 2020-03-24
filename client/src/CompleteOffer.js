import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
const queryString = require('query-string');

export default function CompleteOffer(props) {
    function complete() {
        const ID = queryString.parse( props.location.search).ID;
        
        const response = fetch('/api/request/' + ID + '/update_completed/', {
            method: 'get'
        });
    }

    return (
        <div>
            <p> Redirecting... </p>
            {complete()}
            <Redirect to='/' />
        </div>
    );
}
