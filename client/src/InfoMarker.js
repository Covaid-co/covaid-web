import React, {PureComponent} from 'react';

export default class InfoMarker extends PureComponent {
  render() {
    const {info} = this.props;

    const viewVolunteer = () => {
      this.props.setVolunteerDetailsModal(true);
      this.props.setCurrVolunteer(info);
      this.props.setPopupInfo(null);
    }

    const viewRequest = () => {
      this.props.setRequestDetailsModal(true);
      this.props.setCurrRequest(info);
      this.props.setPopupInfo(null);
    }

    // volunteer
    if (info.first_name) {
      return (
        <div style={{color: 'black', fontFamily: 'SF Text'}}>
          <p style={{marginRight: 15, marginBottom: 0, fontWeight: 'bold'}}>{info.first_name}</p>
          {/* <p style={{marginRight: 15, color: '#7F7F7F'}}>Tasks: {info.offer.tasks.join(', ')}</p> */}
          <div>
            <a onClick={() => viewVolunteer(info)} style={{fontWeight: 'bold', color: '#314CCE'}}>View Volunteer</a>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{color: 'black', fontFamily: 'SF Text'}}>
          <p style={{marginRight: 15, marginBottom: 0, fontWeight: 'bold'}}>{info.requester_first}</p>
          {/* <p style={{marginRight: 15, color: '#7F7F7F'}}>Tasks: {info.offer.tasks.join(', ')}</p> */}
          <div>
            <a onClick={() => viewRequest(info)} style={{fontWeight: 'bold', color: '#314CCE'}}>View Request</a>
          </div>
        </div>
      );
    }
  }
}