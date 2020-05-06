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
					<p id="regular-text-nomargin" onClick={() => viewVolunteer(info)} style={{fontWeight: 'bold', color: '#2670FF'}}>
					View Volunteer</p>
				</div>
			);
		} else {
			return (
				<div>
					<p id="regular-text" style={{marginRight: 15, marginBottom: 0, fontWeight: 'bold'}}>{info.requester_first}</p>
					<p onClick={() => viewRequest(info)} id="regular-text-nomargin" style={{fontWeight: 'bold', color: '#2670FF'}}>
					View Request</p>
				</div>
			);
		}
	}
}