import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ReactTinyLink } from 'react-tiny-link'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { defaultLinks } from './constants'

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
                        var tempLink = link.link;
                        if (tempLink.substring(0, 7) !== 'http://' || tempLink.substring(0, 8) !== 'https://') {
                            tempLink = 'http://' + tempLink;
                        }
                        return (
                            <div key={i} style={{marginBottom: 20, textAlign: "center"}}>
                                <ReactTinyLink
                                    cardSize="small"
                                    showGraphic={true}
                                    maxLine={2}
                                    minLine={1}
                                    style={{display: "inlineBlock"}}
                                    url={tempLink}/>
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
                                        <div key={i} style={{marginBottom: 20, textAlign: "center"}}>
                                            <ReactTinyLink
                                                cardSize="small"
                                                showGraphic={true}
                                                maxLine={2}
                                                minLine={1}
                                                className='react-link'
                                                url={link.link}/>
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