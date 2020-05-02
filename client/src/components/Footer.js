import React, {useState} from "react";
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

import HowItWorks from '../components_modals/HowItWorks'
import Feedback from '../components_modals/Feedback'

export default function Footer() {

    const [showModal, setShowModal] = useState(false);
    const [modalName, setModalName] = useState('');

    const getCurrentModal = () => {
        var modal = <></>;
        if (modalName === 'faq') {
            modal = <HowItWorks showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if  (modalName === 'feedback') {
            modal = <Feedback showModal={showModal} hideModal={() => setShowModal(false)}/>;
        }
        return modal;
    }

    const setCurrModal = (name) => {
        setShowModal(true);
        setModalName(name);
    }
    
    return (
        <footer className="footer">
            <Container>
            <Row style={{textAlign: 'left',paddingBottom: 30}}>
                <Col xs={2} style={{padding: 20, paddingRight: 0}}>
                    <Navbar style={{paddingLeft: 0, paddingBottom: 0}}>
                        <Navbar.Brand id="navbar-brand" style={{paddingLeft: 0, color: '#7B7B7B', marginLeft: 0}}>
                            covaid
                        </Navbar.Brand>
                    </Navbar>
                    <a id="regular-text" style={{color: '#2670FF'}} target="_blank" rel="noopener noreferrer" href="https://github.com/debanik1997/covaid">Github</a><br/>
                    <a id="regular-text" style={{color: '#2670FF'}} target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/covaidco">Facebook</a><br/>
                    <a id="regular-text" style={{color: '#2670FF'}} target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/covaidmutualaid/">Instagram</a><br/>
                </Col>
                <Col xs={2} style={{padding: 20, paddingLeft: 0, paddingTop: 80,  paddingRight: 0}}>
                    {/* <a target="_blank" rel="noopener noreferrer" href="github.com">Donate</a><br/> */}
                    <Button variant="link" id="regular-text" style={{color: '#2670FF', padding: 0}} onClick={() => setCurrModal('faq')}>FAQ</Button><br/>
                    <Button variant="link" id="regular-text" style={{color: '#2670FF', padding: 0, marginTop: -8}} onClick={() => setCurrModal('feedback')}>Send feedback</Button>
                </Col>
                <Col xs={4} style={{padding: 20,  paddingLeft: 100, paddingTop: 37}}>
                    <p id="regular-text" style={{color: '#7B7B7B', fontWeight: 'bold'}}>Current Partners</p>
                    <p id="regular-text" style={{marginBottom: 0}}>Delaware Mutual Aid</p>
                    <p id="regular-text" style={{marginBottom: 0}}>Indy COVID-19 Neighbor Response Team</p>
                </Col>
                <Col xs={4} style={{padding: 20,  paddingLeft: 20, paddingTop: 78}}>
                    <p id="regular-text" style={{marginBottom: 0}}>Baltimore Mutual Aid</p>
                    <p id="regular-text" style={{marginBottom: 0}}>Greater Charlotte Area Mutual Aid</p>
                </Col>
            </Row>
            </Container>
            {getCurrentModal()}
        </footer>
    );
}