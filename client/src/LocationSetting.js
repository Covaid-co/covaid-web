import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

export default function LocationSetting(props) {

    const [locationString, setLocationString] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        e.stopPropagation();
        // console.log(locationString)
        props.handleLocationChange(locationString);
        props.locationSubmit(e, locationString);
    }

    return (
        <>
            <h1 id="enter-location">Enter your location</h1>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col lg={4} md={6} sm={6} xs={12}>
                        <InputGroup controlId="locationString" className="mb-3">
                            <FormControl
                                placeholder="City or Zip" 
                                aria-label="City or Zip"
                                aria-describedby="basic-addon2"
                                value={locationString}
                                onChange={e => setLocationString(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" type="submit">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <Button variant="link" 
                                id="refresh-location"
                                onClick={props.refreshLocation} >
                            <u>Return to Original Location 
                                <i className="fa fa-refresh" style={{marginLeft: 10}} aria-hidden="true"></i>
                            </u>
                        </Button>
                    </Col>
                    <Col md={6} sm={6} id="city-support-text-tablet">
                        <a style={{marginTop: -8, float: 'right', color: '#797979'}} className="volunteer-location">
                            This city is supported by:<br/> 
                            {props.associations.map((association, i) => {                
                                return <p key={i} style={{float: 'left', color: '#194bd3'}} className="volunteer-location">{association.name}</p>   
                            })}
                        </a>
                    </Col>
                </Row>
                <Row id="web-separate">
                    <Col lg={4} md={6} sm={6} xs={12}>
                        <p id="requestCall" style={{marginTop: 20, marginBottom: 20}}></p>
                        <a style={{marginTop: -8, float: 'left', color: '#797979'}}className="volunteer-location">
                            This city is supported by:<br/> 
                            <p style={{float: 'left', color: '#194bd3'}} className="volunteer-location">Covaid.co</p> <br />
                            {props.associations.map((association, i) => {                
                                return <><p key={i} style={{float: 'left', color: '#194bd3'}} className="volunteer-location">{association.name}</p><br /> </>
                            })}
                        </a>
                    </Col>
                </Row>
                <Row id="mobile-tablet-separate">
                    <Col lg={12} md={12}>
                        <p id="requestCall" style={{marginTop: 20, marginBottom: 20}}></p>
                    </Col>
                </Row>
                <Row id="mobile-org">
                    <Col md={12}>
                        <a style={{marginTop: -8, float: 'left', color: '#797979'}}className="volunteer-location">
                            This city is supported by:<br/> 
                            {props.associations.map((association, i) => {                
                                return <p key={i} style={{float: 'left', color: '#194bd3'}} className="volunteer-location">{association.name}</p>   
                            })}
                        </a>
                    </Col>
                </Row>
            </Form>
        </>
    );
}