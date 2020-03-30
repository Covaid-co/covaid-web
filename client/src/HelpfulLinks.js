import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function HelpfulLinks() {

    const links = [
        ['https://coronavirus.jhu.edu/map.html', 'Live COVID-19 Statistics'],
        ['https://www.healingjustice.org/podcast/corona', 'Online support groups'],
        ['https://docs.google.com/document/u/0/d/1uP49OQGhosfBN4BOYQvyy_Mu3mpCSOYzip13LksC-S8/mobilebasic#h.33akvwi9gyu2', 'Collective Care is our Best Weapon'],
        ['https://mutualaiddisasterrelief.org/wp-content/uploads/2020/03/COVID-SupplyDistro-MASafetyPracticesZine-WEB.pdf', 'Safety Practices for Mutual Aid'],
        ['https://www.mutualaidhub.org/', 'Mutual Aid Hub'],
        ['https://docs.google.com/document/d/1y5ST-wUZ6ASh-j6pQ7zmdwEsJIHI0MjtL97aGb7awmM/edit?fbclid=IwAR17xA1fmLUY9faEhPFS5l5JyKN76vynIY-5SZh6e8Iz6Uqa69vAXdKeQcs', 'COVID-19 Prevention Information'],
        ['https://www.mapping-access.com/blog-1/2020/3/10/accessible-teaching-in-the-time-of-covid-19', 'Accessible teaching'],
        ['https://afsp.org/taking-care-of-your-mental-health-in-the-face-of-uncertainty/', 'Mental health in the face of uncertainty'],
        ['https://www.epa.gov/pesticide-registration/list-n-disinfectants-use-against-sars-cov-2', 'EPA List of disinfectants that kill coronavirus'],

    ]

    return (

            <ListGroup variant="flush">
            {links.map((link, i) => {                
                return <ListGroup.Item key={i} style = {{fontSize: 12}}>
                        <Row>
                            <Col><a target="_blank" 
                                    href={link[0]}
                                    rel="noopener noreferrer">{link[1]}</a></Col>
                        </Row>
                    </ListGroup.Item>      
                })}
            </ListGroup>
    );
}