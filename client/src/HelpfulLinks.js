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
            link: 'https://coronavirus.jhu.edu/map.html'
        },
        {
            name: 'Online support groups',
            link: 'https://www.healingjustice.org/podcast/corona'
        },
        {
            name: 'Safety Practices for Mutual Aid',
            link: 'https://mutualaiddisasterrelief.org/wp-content/uploads/2020/03/COVID-SupplyDistro-MASafetyPracticesZine-WEB.pdf'
        },
        {
            name: 'COVID-19 Prevention Information',
            link: 'https://docs.google.com/document/d/1y5ST-wUZ6ASh-j6pQ7zmdwEsJIHI0MjtL97aGb7awmM/edit?fbclid=IwAR17xA1fmLUY9faEhPFS5l5JyKN76vynIY-5SZh6e8Iz6Uqa69vAXdKeQcs'
        },
        {
            name: 'Accessible teaching',
            link: 'https://www.mapping-access.com/blog-1/2020/3/10/accessible-teaching-in-the-time-of-covid-19'
        },
        {
            name: 'Mental health in the face of uncertainty',
            link: 'https://afsp.org/taking-care-of-your-mental-health-in-the-face-of-uncertainty/'
        },
        {
            name: 'EPA List of disinfectants that kill coronavirus',
            link: 'https://www.epa.gov/pesticide-registration/list-n-disinfectants-use-against-sars-cov-2'
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
                                            href={link.link}
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
        {/* <Tabs>
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
                                        href={link.link}
                                        rel="noopener noreferrer">{link.name}</a></Col>
                            </Row>
                        </ListGroup.Item>      
                    })}
                </ListGroup>
            </TabPanel>
        </Tabs> */}

                <Container id="volunteer-info">
					<Row className="justify-content-md-center">
						<Col lg={12} md={12} sm={12}>
							<Container style={{padding: 0, marginLeft: 0}}> 
								<Button id={tabNum==1 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(1)}}>Baltimore specific</Button>
								<Button style={{"position": "relative"}}id={tabNum==2 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(2)}}>
									General
								</Button>
							</Container>
							<Container className="shadow mb-5 bg-white rounded" id="yourOffer"
								style={tabNum==1 ? {'display': 'block'} : {'display': 'none'}}>
								{defaultLinks.map((link, i) => {                
                                return <ListGroup.Item key={i} style = {{fontSize: 12}}>
                                        <Row>
                                            <Col><a target="_blank" 
                                                    href={link.link}
                                                    rel="noopener noreferrer">{link.name}</a></Col>
                                        </Row>
                                    </ListGroup.Item>      
                                })}
							</Container>
							<Container className="shadow mb-5 bg-white rounded" id="request-view"
								style={tabNum==2 ? {'display': 'block'} : {'display': 'none'}}>
								{defaultLinks.map((link, i) => {                
                                return <ListGroup.Item key={i} style = {{fontSize: 12}}>
                                        <Row>
                                            <Col><a target="_blank" 
                                                    href={link.link}
                                                    rel="noopener noreferrer">{link.name}</a></Col>
                                        </Row>
                                    </ListGroup.Item>      
                                })}
							</Container>
						</Col>
					</Row>
				</Container>
        </>
    );
}