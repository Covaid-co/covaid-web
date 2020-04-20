import React, {useState} from "react";
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import AboutUs from './components_modals/AboutUs'
import HowItWorks from './components_modals/HowItWorks'
import Feedback from './components_modals/Feedback'

export default function Footer(props) {

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(0);

    const getCurrentModal = () => {
        var modal = <></>;
        if (modalType === 2) {
            modal = <HowItWorks showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if  (modalType === 4) {
            modal = <Feedback showModal={showModal} hideModal={() => setShowModal(false)}/>;
        }
        return modal;
    }
    
    return (
        <footer className="footer">
            <Row style={{textAlign: 'left', marginLeft: '6%', paddingBottom: 30}}>
                <Col xs={2} style={{padding: 20, paddingRight: 0}}>
                    <Navbar style={{paddingLeft: 0, paddingBottom: 0}}>
                        <Navbar.Brand id="navbar-brand" style={{paddingLeft: 0, color: '#7B7B7B', marginLeft: 0}}>
                            covaid
                        </Navbar.Brand>
                    </Navbar>
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/debanik1997/corona-aid">Github</a><br/>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/covaidco">Facebook</a><br/>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/covaidmutualaid/">Instagram</a><br/>
                </Col>
                <Col xs={2} style={{padding: 20, paddingLeft: 30, paddingTop: 80,  paddingRight: 0}}>
                    {/* <a target="_blank" rel="noopener noreferrer" href="github.com">Donate</a><br/> */}
                    <a onClick={() => props.handleShowModal(2)} href="#">FAQ</a><br/>
                    <a onClick={() => props.handleShowModal(4)} href="#">Send feedback</a><br/>
                </Col>
                <Col xs={4} style={{padding: 20,  paddingLeft: 100, paddingTop: 39}}>
                    <p id="regular-text" style={{color: '#7B7B7B', fontWeight: 'bold'}}>Current Partners</p>
                    <p id="regular-text" style={{marginBottom: 0}}>Pittsburgh Mutual Aid</p>
                    <p id="regular-text" style={{marginBottom: 0}}>Delaware Mutual Aid</p>
                    <p id="regular-text" style={{marginBottom: 0}}>Indianapolis Mutual Aid</p>
                </Col>
                <Col xs={4} style={{padding: 20,  paddingLeft: 20, paddingTop: 78}}>
                    <p id="regular-text" style={{marginBottom: 0}}>Baltimore Mutual Aid</p>
                    <p id="regular-text" style={{marginBottom: 0}}>Athens Mutual Aid</p>
                    <p id="regular-text" style={{marginBottom: 0}}>Charlotte Mutual Aid</p>
                </Col>
            </Row>
            {getCurrentModal()}
        </footer>
    );
}