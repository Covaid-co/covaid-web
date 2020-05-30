import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { volunteer_status, defaultResources } from "../constants";

export default function RequestCard(props) {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        setLoaded(true);
    }, [props.request])

    if (!loaded) {
        return <></>;
    }
    if (props.empty) {
        return (
            <div style={{
                height: "90px", 
                border: "1px dashed #CECECE",
                boxSizing: "border-box",
                borderRadius: "0px 0px 6px 6px",
                marginBottom: 16,
                marginRight: 10,
                marginLeft: 10
            }}>
                <p id="regular-text" style={{ fontSize: 16, color: '#CECECE', fontWeight: 600, textAlign: "center", paddingTop: '30px', paddingBottom: '30px' }}>
                    No requests
                </p>
            </div>
          );
    }
    function getFormattedDate(date) {
        var month = (1 + date.getMonth()).toString();
        var day = date.getDate().toString();
        return month + '/' + day;
    }
    const name = () => {
        if (props.requestStatus === volunteer_status.PENDING) {
            return "New request"
        } else {
            return props.request.personal_info.requester_name;
        }
    }
    const resources = () => {
       return props.request.request_info.resource_request.join(", ");
    }
    const date = () => {
        if (props.requestStatus === volunteer_status.COMPLETE) {
            return "Completed: " + getFormattedDate(new Date(props.request.status.completed_date));
        } else {
            return "Due: " + getFormattedDate(new Date(props.request.request_info.date));
        }
    }
    const statusBubble = () => {
        switch (props.requestStatus) {
            case volunteer_status.PENDING:
                return (
                    <span style={{height: 17, width: 17, borderRadius: '50%', marginLeft: 5, backgroundColor: props.color}}>
                        hi
                    </span>
                );
            case volunteer_status.IN_PROGRESS:
                return (
                    <span style={{height: 17, width: 17, borderRadius: '50%', marginLeft: 5, backgroundColor: props.color}}>
                        hi
                    </span>
                );
            case volunteer_status.COMPLETE:
                return (
                    <span style={{height: 17, width: 17, borderRadius: '50%', marginLeft: 5, backgroundColor: props.color}}>
                        hi
                    </span>

                );
            default:
                return <></>;
        }
    }
    return (
        <div style={{
            height: "90px", 
            border: "1px solid #CECECE",
            boxSizing: "border-box",
            borderRadius: "0px 0px 6px 6px",
            borderTop: "2px solid " + props.color,
            marginBottom: 16,
            marginRight: 10,
            marginLeft: 10
        }}>
            <div style={{marginTop: 20, marginLeft: 25, marginRight: 19 }}>
                <h1 id="volunteer-name" style={{fontSize: 16, color: "#4F4F4F"}}>
                    {name()}
                </h1>
                <p id="regular-text" style={{ fontSize: 14, float: "right" }}>
                    {date()}
                    {statusBubble()}
                </p>
            </div>
            <p id="regular-text" style={{ fontSize: 14, marginLeft: 25 }}>
                {resources()}
            </p>
        </div>
    );
}
