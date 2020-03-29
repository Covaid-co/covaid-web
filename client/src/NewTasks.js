import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function NewTasks(props) {

    const handleResourceChange = (resource) => {
        props.setResources(prev => ({ 
            ...prev,
            [resource]: !props.resources[resource],
        }));
    }

    return (
        <>
            <h5 className="titleHeadings" style = {{marginTop: '24px', marginBottom: '8px'}}>
                Tasks you need help with
            </h5>
            {Object.keys(props.resources).map((resource) => {
                return <Button key={resource}
                               id={props.resources[resource] ? "selected" : "notSelected"}
                               onClick = {() => handleResourceChange(resource)}>
                               {resource}
                        </Button>
            })}
        </>
    );
}