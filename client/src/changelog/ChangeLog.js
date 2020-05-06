import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Container from 'react-bootstrap/Container'

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { sortFn } from '../components_orgpage/OrganizationHelpers';

/**
 * Changelog/updates page for keeping track of covaid updates
 */

export default function ChangeLog() {
    const [changeLog, setChangeLog] = useState([])

    useEffect(() => {
        fetch('/api/changelog/')
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                res.sort(function(a, b) {
                    const x = new Date(a.date);
                    const y = new Date(b.date);
                    return sortFn(x, y, true);
                });
                setChangeLog(res);
            });
    }, []);

    const displayInfo = (log, category) => {
        if (log[category].length === 0) {
            return <></>
        }
        return (
            <>
                <Badge id={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>
                <ul id="changelog-list">
                    {log[category].map((item, i) => {
                        if (item === "") {
                            return <></>
                        }
                        return <li key={i} id="changelog-listitem">{item}</li>
                    })}
                </ul>
            </>
        )
    }
    
    return ([
        <div className="App" key="1">
            <NavBar isLoggedIn={false} totalVolunteers={0} orgPortal={true}/>
            <Container style={{maxWidth: 1500}}>
                <Row>
                    <Col lg={3} md={2} sm={0}></Col>
                    <Col lg={6} md={8} sm={12}>
                        <h1 id="changelog-heading" style={{fontSize: 40}}>Changelog <span role="img" aria-label="mailbox">📬</span></h1>
                        <p id="regular-text" style={{marginBottom: 5}}>
                            Changes and updates made to Covaid sorted by date.
                        </p>
                        <p id="requestCall" style={{marginTop: 15, marginBottom: 10}}></p>

                        {changeLog.map((log, i) => {
                            return <div key={i}>
                                <p id="date-heading">{log.date}</p>
                                {displayInfo(log, 'features')}
                                {displayInfo(log, 'improvements')}
                                {displayInfo(log, 'fixes')}
                                <p id="requestCall" style={{marginTop: 45, marginBottom: 0}}></p>
                            </div>
                        })}
                    </Col>
                    <Col lg={3} md={2} sm={0}></Col>
                </Row>
            </Container>
        </div>,
        <Footer key="2"/>
    ]);
}