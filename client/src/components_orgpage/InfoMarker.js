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
      this.props.setInRequest(true);
    }

    // volunteer
    if (info.first_name) {
      return (
        <div>
          <p id="regular-text" style={{marginRight: 15, marginBottom: 0, fontWeight: 'bold'}}>{info.first_name}</p>
          <div>
            <a onClick={() => viewVolunteer(info)} id="regular-text" style={{fontWeight: 'bold', color: '#2670FF'}}>View Volunteer</a>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <p id="regular-text" style={{marginRight: 15, marginBottom: 0, fontWeight: 'bold'}}>{info.requester_first}</p>
          <div>
            <a onClick={() => viewRequest(info)} id="regular-text" style={{fontWeight: 'bold', color: '#2670FF'}}>View Request</a>
          </div>
        </div>
      );
    }
  }
}