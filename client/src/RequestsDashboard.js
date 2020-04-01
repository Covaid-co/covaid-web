import React, { useEffect, useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

export default function RequestsDashboard(props) {

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        var url = "/api/request/allRequestsInAssoc?";
        let params = {
            'association': "5e7f9badc80c292245264ebe"
        }
        let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
        url += query;

        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    setRequests(data)
                    setFilteredRequests(data)
                });
            } else {
                console.log("Error")
            }
        }).catch((e) => {
            console.log(e)
        });
    }, [])

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        if (!query || query == "") {
            setFilteredRequests(requests)
        }

        var filtered = requests.filter(p => {
            var emailMatch = String(p.requester_email).startsWith(query)
            for (var i = 0; i < p.resource_request.length; i++) {
                if (String(p.resource_request[i]).toLowerCase().startsWith(query)) {
                    return true
                }
            }
            return emailMatch
        });
        setFilteredRequests(filtered)

    }

    return (
        <>
            <ListGroup variant="flush">
                    <ListGroup.Item>
                    <InputGroup>
                        <FormControl
                        placeholder="Search through requests"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        onChange={filterRequests}
                        />
                    </InputGroup>
                    </ListGroup.Item>
            </ListGroup>
            <ListGroup variant="flush">
                {filteredRequests.map((request, i) => {
                    return (<ListGroup.Item>
                        <div >
                            <h5 className="volunteer-name">
                                {request.requester_email}
                            </h5>
                        </div>
                        <div>
                            {request.resource_request.map((task, i) => {
                                return <Badge key={i} className='task-info'>{task}</Badge>
                            })}
                        </div>
                    </ListGroup.Item>);
                    })}
            </ListGroup>
        </>
    );
}