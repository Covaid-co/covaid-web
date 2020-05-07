import React, {useState} from "react";
import Select from 'react-select';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
const options = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' }
  ];
export default function DefaultHeader(props) {
    const [selectedOption, setSelectedOption] = useState({value: 'en', label: 'English'});

    const handleLanguageChange = (selectedDropdownOption) => {
        setSelectedOption(selectedDropdownOption);
        props.changeLanguage(selectedDropdownOption.value);
    }

    if (props.modal) {
        return <>
            <p id="regular-text">
                {props.requestHeaderText}
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}> For those who would rather call in a request, 
                please call <br /><span id="phoneNumber">(401) 526-8243</span></p>
        </>
    }

    return (
        <>
            <Row>
                <Col xs={8}>
                    <h1 id="small-header" style={{marginTop: 5}}>{props.translations[props.language].RequestSupport} 
                    </h1>
                </Col>
                <Col xs={4}>
                    <Select
                        value={selectedOption}
                        onChange={handleLanguageChange}
                        placeholder={'Translate...'}
                        options={options}
                    />
                </Col>
            </Row>
            <p id="requestCall" style={{marginTop: 15, marginBottom: 10}}></p>
            <p id="regular-text">
                {props.requestHeaderText}
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}>{props.translations[props.language].call}:<br /><span id="phoneNumber">(401) 526-8243</span></p>
        </>
    );
}