import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { currURL } from '../constants';

export default function CitySupport(props) {

    const citySupportedBy = (screen) => {
        var float = "left";
        return <div style={{float: float}}>
                    <p id="regular-text" style={{marginBottom: 0}}>This city is supported by:</p>
                    {props.associations.map((association, i) => {                
                        return <div key={i}>
                                    <a href={association.homepage} target="_blank" rel="noopener noreferrer" 
                                        style={{paddingLeft: 0, marginBottom: 0, marginLeft: 0, fontSize: 16}} id="association-name">
                                        {association.name}</a><br /> 
                                </div>
                    })}
                    {props.associations.length === 0 ?
                    <><a href={currURL + '/organizationPortal'} rel="noopener noreferrer" style={{paddingLeft: 0, marginBottom: 0, marginLeft: 0, fontSize: 16}} id="association-name">
                        Include your Mutual Aid Initiative</a><br/></> : <></>}
                    {/* <p style={{paddingLeft: 0, marginBottom: 0, marginLeft: 0, fontSize: 16}} id="association-name">Covaid.co</p> */}
                </div>
    }

    return (
        <>
            <Row id="city-support-text-tablet">
                <Col lg={12} md={12}>
                    <p id="requestCall" style={{marginBottom: 15}}></p>
                </Col>
                <Col md={12} sm={12} style={{overflow: 'hidden'}}>
                    {citySupportedBy('tablet')}
                </Col>
            </Row>
            <Row id="web-separate">
                <Col lg={4} md={4}>
                    <p id="requestCall" style={{marginBottom: 15}}></p>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                    {citySupportedBy('web')}
                </Col>
            </Row>
        </>
    );
}