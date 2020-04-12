import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'

export default function HelpfulLinks(props) {

    const [associationExists, setAssociationExists] = useState(false);
    const [associationName, setAssociationName] = useState('');
    const [associationLinks, setAssociationLinks] = useState([]);
    const [tabNum, setTabNum] = useState(1);

    useEffect(() => {
        if (props.associationName) {
            setAssociationExists(true)
            setAssociationName(props.associationName)
            setAssociationLinks(props.associationLinks)
        }
    }, [props.associationName, props.associationLinks])

    const defaultLinks = [
        {
            name: 'Live COVID-19 Statistics',
            url: 'https://coronavirus.jhu.edu/map.html'
        },
        {
            name: 'Online support groups',
            url: 'https://www.healingjustice.org/podcast/corona'
        },
        {
            name: 'Safety Practices for Mutual Aid',
            url: 'https://mutualaiddisasterrelief.org/wp-content/uploads/2020/03/COVID-SupplyDistro-MASafetyPracticesZine-WEB.pdf'
        },
        {
            name: 'COVID-19 Prevention Information',
            url: 'https://docs.google.com/document/d/1y5ST-wUZ6ASh-j6pQ7zmdwEsJIHI0MjtL97aGb7awmM/edit?fbclid=IwAR17xA1fmLUY9faEhPFS5l5JyKN76vynIY-5SZh6e8Iz6Uqa69vAXdKeQcs'
        },
        {
            name: 'Accessible teaching',
            url: 'https://www.mapping-access.com/blog-1/2020/3/10/accessible-teaching-in-the-time-of-covid-19'
        },
        {
            name: 'Mental health in the face of uncertainty',
            url: 'https://afsp.org/taking-care-of-your-mental-health-in-the-face-of-uncertainty/'
        },
        {
            name: 'EPA List of disinfectants that kill coronavirus',
            url: 'https://www.epa.gov/pesticide-registration/list-n-disinfectants-use-against-sars-cov-2'
        }
    ]

    const associationTab = () => {
        if (associationExists && associationLinks.length > 0) {
            return (
                <Tab style={{"fontSize": 14}}>Resources from {associationName}</Tab>
            );
        } else {
            return (
                <></>
            );
        }
    }

    const associationResourceList = () => {
        if (associationExists && associationLinks.length > 0) {
            return(
                <TabPanel> 
                     <ListGroup variant="flush">
                    {associationLinks.map((link, i) => {                
                        return <ListGroup.Item key={i} style = {{fontSize: 12}}>
                                <Row>
                                    <Col><a target="_blank" 
                                            href={link.url}
                                            rel="noopener noreferrer">{link.name}</a></Col>
                                </Row>
                            </ListGroup.Item>      
                        })}
                        </ListGroup>
                </TabPanel>
            )
        } else {
            return (
                <></>
            );
        }
    }

    return (
        <>
        <Tabs>
            <TabList>
                {associationTab()}
                <Tab style={{"fontSize": 14}}>General resources</Tab>
            </TabList>

            {associationResourceList()}
            <TabPanel>
            <ListGroup variant="flush">
                {defaultLinks.map((link, i) => {                
                    return <ListGroup.Item key={i} style = {{fontSize: 12}}>
                            <Row>
                                <Col><a target="_blank" 
                                        href={link.url}
                                        rel="noopener noreferrer">{link.name}</a></Col>
                            </Row>
                        </ListGroup.Item>      
                    })}
                </ListGroup>
            </TabPanel>
        </Tabs>
        </>
    );
}