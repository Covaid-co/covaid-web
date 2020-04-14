import React, {PureComponent} from 'react';

export default class InfoMarker extends PureComponent {
  render() {
    const {info} = this.props;

    const viewRequest = (x) => {
      console.log(x);
    }

    // volunteer
    if (info.first_name) {
      return (
        <div style={{color: 'black', fontFamily: 'SF Pro Text'}}>
          <p style={{marginRight: 15, marginBottom: 0, fontWeight: 'bold'}}>{info.first_name} (Volunteer)</p>
          <p style={{marginRight: 15, color: '#7F7F7F'}}>Tasks: {info.offer.tasks.join(', ')}</p>
          <div><a href="#" onClick={() => viewRequest(info)} style={{fontWeight: 'bold', color: '#314CCE'}}>View Volunteer</a>
          </div>
          
        </div>
      );
    } else {
      return (
        <div style={{color: 'black'}}>
          <p>{info.requester_first} (Requester)</p>
        </div>
      );
    }
  }
}