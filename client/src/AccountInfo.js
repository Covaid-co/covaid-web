import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import EditAccountInfoModal from "./EditAccountInfoModal"
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function AccountInfo(props) {

    const [isLoaded, setIsLoaded] = useState(false)
    const [user, setUser] = useState({})
    const [showEditModal, setShowEditModal] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
        setUser(props.user)
    }, [props.user])

    var assocName = <></>
    if (user.association && user.association.length > 0) {
        assocName = <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Mutual Aid Group:</b> {user.association_name}</h5>
    }

    var phoneNum = <></>
    if (user.phone && user.phone.length > 0) {
        phoneNum = <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Phone:</b> {user.phone}</h5>
    }

    if (isLoaded) {
        return (
            <>
            <Row>
            <Col>
            <h3 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontSize: 20}}>Your Profile</h3>
            <p id="requestCall" style={{marginTop: 0, marginBottom: 20}}></p>
            <div style={{marginTop: 0, marginBottom: 20}}>
                <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Name:</b> {user.first_name + " " + user.last_name}</h5>
                {phoneNum}
                <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Email:</b> {user.email}</h5>
            </div>
            <div style={{marginTop: 0, marginBottom: 20}}>
                {assocName}
                <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Location:</b> {user.offer.neighborhoods.join(", ")} <FontAwesomeIcon style={{color: "red"}} icon={faMapMarkerAlt} /> </h5>
            </div>
            <div style={{marginTop: 0, marginBottom: 20}}>
                <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Languages:</b> {user.languages.join(", ")}</h5>
                <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Car:</b> {user.offer.car ? "Yes" : "No"}</h5>
                <h5 className="volunteerName" style={{marginTop: 0, marginBottom: 10, fontWeight: "normal"}}><b>Availability:</b> {user.offer.timesAvailable.join(", ")}</h5>
            </div>
            <p id="requestCall" style={{marginTop: 0, marginBottom: 10}}></p>
            <Button onClick={() => {setShowEditModal(true);}} style={{margin: "auto", display: "block"}}variant="link">Edit Info</Button>
            <Modal size={"lg"} show={showEditModal} onHide={() => {setShowEditModal(false);}}  style = {{marginTop: 10, paddingBottom: 50}} id="general-modal">
                <EditAccountInfoModal user={user} />
            </Modal>
            </Col>
            </Row>
            </>
        )
    } else {
        return (
            <></>
        )
    }

}