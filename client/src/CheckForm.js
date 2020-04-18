import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

export default function CheckForm(props) {

    const handleObjChange = (key) => {
        props.setObj(prev => ({ 
            ...prev,
            [key]: !props.obj[key],
        }));
    }

    return (
        <>
            {Object.keys(props.obj).map((key) => {
                return <Button key={key}
                               id={props.obj[key] ? "selected" : "notSelected"}
                               onClick = {() => handleObjChange(key)}>
                               {key}
                        </Button>
            })}
        </>
    );
}