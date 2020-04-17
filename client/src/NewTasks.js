import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
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
            <h5 className="titleHeadings" style = {{marginTop: 10, marginBottom: 5}}>
                What support do you need?
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