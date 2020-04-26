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

    const sortedObj = Object.keys(props.obj);
    sortedObj.sort();

    return (
        <>
            {sortedObj.map((key) => {
                return <Button key={key} disabled={props.disabled}
                               id={props.obj[key] ? "selected" : "notSelected"}
                               onClick = {() => handleObjChange(key)}>
                               {key}
                        </Button>
            })}
        </>
    );
}