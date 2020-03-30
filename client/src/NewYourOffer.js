import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import YourOffer from './YourOffer';

export default function NewYourOffer(props) {
    return (
        <>
            <Container className="shadow mb-5 bg-white rounded" id="offerContainer" style={
                {alignItems: "center",
                display: "flex",
                justifyContent: "center",
                margin: "auto"
            }
            }>
                <YourOffer state = {props.state} />
            </Container>
        </>
    );
}