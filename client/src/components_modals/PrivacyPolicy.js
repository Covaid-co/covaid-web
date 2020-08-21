import React from "react";
import Modal from "react-bootstrap/Modal";

export default function PrivacyPolicy(props) {
  return (
    <Modal
      show={props.showModal}
      style={{ marginTop: 60 }}
      onHide={props.hideModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="small-header">Privacy Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 400, "overflow-y": "auto" }}>
        <p>
          Privacy is important at Covaid. We may collect, store and share
          addresses and contact information ("Personal Information") to more
          accurately match volunteers and requesters in a given area. This data
          is only shared upon an approved match and is otherwise only available
          to governing mutual aid groups. Prior to signup, we may collect and
          use technical data and related information, including but not limited
          to information about your device (e.g., manufacturer, service
          provider, IP address, operating system, browser type, mobile number)
          system and application software, peripherals and your interactions
          with Covaid’s Products and Services including automatically recording
          the dates and times of visits. This information is gathered
          periodically to facilitate the provision of software updates, product
          support, product enhancements and to estimate our audience size and
          usage patterns. We may also automatically receive and record
          information on our server logs from your browser or mobile device,
          which could include your IP address, cookie information, browser
          information and the pages you visit/request. Covaid does not consider
          nor intend Technical Information to constitute Personal Information.
          Covaid may use the Technical Information in any manner it deems
          appropriate and lawful. We employ measures designed to protect your
          data. For example, we use a secure protocol designed to protect the
          transmission of information about you. If Covaid updates the privacy
          policy, we will provide notice to you by email or a notification
          within Covaid. By continuing to use our platform after any changes
          come into effect, the revised privacy policy applies to you. If you
          have any questions about this privacy policy, please contact us at
          covaidco@gmail.com
        </p>
      </Modal.Body>
    </Modal>
  );
}
