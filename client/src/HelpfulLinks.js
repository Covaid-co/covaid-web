import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ReactTinyLink } from 'react-tiny-link'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

export default function HelpfulLinks(props) {

    const [associationExists, setAssociationExists] = useState(false);
    const [associationCity, setAssociationCity] = useState('');
    const [associationLinks, setAssociationLinks] = useState([]);
    const [tabNum, setTabNum] = useState(1);

    useEffect(() => {
        if (props.associationCity) {
            setAssociationExists(true)
            setAssociationCity(props.associationCity)
            setAssociationLinks(props.associationLinks)
        }
    }, [props.associationCity, props.associationLinks])

    const defaultLinks = [
        {
            name: 'CDC',
            link: 'https://www.cdc.gov/coronavirus/2019-nCoV/index.html'
        },
        {
            name: 'WHO',
            link: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019'
        },
        {
            name: 'Mutual Aid Hub',
            link: 'https://www.mutualaidhub.org'
        },
        {
            name: 'Mental health in the face of uncertainty',
            link: 'https://afsp.org/taking-care-of-your-mental-health-in-the-face-of-uncertainty/'
        },
        {
            name: 'EPA List of disinfectants that kill coronavirus',
            link: 'https://www.epa.gov/pesticide-registration/list-n-disinfectants-use-against-sars-cov-2'
        },
        {
            name: 'Online support groups',
            link: 'https://www.healingjustice.org/podcast/corona'
        },
        {
            name: 'Live COVID-19 Statistics',
            link: 'https://coronavirus.jhu.edu/map.html'
        },
        {
            name: 'COVID-19 Prevention Information',
            link: 'https://docs.google.com/document/d/1y5ST-wUZ6ASh-j6pQ7zmdwEsJIHI0MjtL97aGb7awmM/edit?fbclid=IwAR17xA1fmLUY9faEhPFS5l5JyKN76vynIY-5SZh6e8Iz6Uqa69vAXdKeQcs'
        }
    ]

    const associationTab = () => {
        if (associationExists && associationLinks.length > 0) {
            return (
                <Button id={tabNum==2 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(2)}}>{associationCity}</Button>
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
                <Container className="shadow mb-5 bg-white rounded" id="requester-tab" 
                style={tabNum==2 ? {'display': 'block'} : {'display': 'none'}}>
                    {associationLinks.map((link, i) => {                
                        return (
                            <div style={{marginBottom: 20, textAlign: "center"}}>
                            <ReactTinyLink
                                cardSize="small"
                                showGraphic={true}
                                maxLine={2}
                                minLine={1}
                                style={{display: "inlineBlock"}}
                                url={link.link}
                                />
                                </div>
                        )  
                    })}
                </Container>
            )
        } else {
            return (
                <></>
            );
        } 
    }

    return (
        <>
         <Modal.Header closeButton>
                <Modal.Title>Useful resources</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container id="volunteer-info" style={{maxWidth: 2000, marginLeft: 0, marginRight: 0, color: 'black'}}>
                    <Row>
                        <Col xs="12">
                            <p>Below are curated resources sampled from national, state, and local goverments and health organizations. These links contain COVID-19 best practices, live statistics, and other useful resources to help through the pandemic. If you know of any other resources that you think would be useful, please let us know at covaidco@gmail.com.</p>
                        </Col>
                        <Col xs="12">
							<Container style={{padding: 0,  marginLeft: 0}}>
								<Button style={{"position": "relative"}}id={tabNum==1 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(1)}}>
									General
								</Button>
                                {associationTab()}
							</Container>
                            {associationResourceList()}
                            <Container className="shadow mb-5 bg-white rounded" id="requester-tab" 
                                        style={tabNum==1 ? {'display': 'block'} : {'display': 'none'}}>
                                {defaultLinks.map((link, i) => {                
                                    return (
                                        <div style={{marginBottom: 20, textAlign: "center"}}>
                                            <ReactTinyLink
                                                cardSize="small"
                                                showGraphic={true}
                                                maxLine={2}
                                                minLine={1}
                                                style={{display: "inlineBlock"}}
                                                url={link.link}
                                                />
                                        </div>
                                    )  
                                })}
							</Container>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </>
    );
}