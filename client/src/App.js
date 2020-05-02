import React, { useState, useEffect, useRef } from 'react';
import {ToastProvider} from 'react-toast-notifications'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './Home'
import CompleteOffer from './CompleteOffer'
import InternalRequests from './InternalRequests'
import Verify from './Verify'
import Welcome from './Welcome'
import RequestPage from './RequestPage'
import ResetPassword from './ResetPassword'
import ResetAssociationPassword from './ResetAssociationPassword'
import OrganizationPortal from './OrganizationPortal'
import VolunteerPortal from './VolunteerPortal'
import OrgAdminRegister from './OrgAdminRegister'
import OrgReset from './OrgReset';
import RegisterPage from './RegisterPage';
import ChangeLog from './ChangeLog';
import SubmitChangeLog from './SubmitChangeLog';
import { generateURL, clearCookies } from './Helpers';
import { findAssociations, getMyLocation, setNeighborhood, setLatLongCookie } from './location_tools/LocationHelpers'

import Geocode from "react-geocode";

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [associations, setAssociations] = useState([]);
    const [currentAssoc, setCurrentAssoc] = useState(null);
    const [locality, setLocality] = useState('');
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [googleApiKey, setGoogleApiKey] = useState('');
    const stateRef = useRef('');

    useEffect(() => {
        fetch('/api/apikey/google').then((response) => {
            if (response.ok) {
				response.json().then(key => {
                    setGoogleApiKey(key['google']);
                    Geocode.setApiKey(key['google']);
                    setLocationState(key['google']);
				});
			} else {
				console.log("Error");
			}
        });
    }, []);


    const setLocationVariables = (neighborObj) => {
        setLocality(neighborObj['locality']);
        setNeighborhoods(neighborObj['neighborhoods']);
        setState(neighborObj['state']);
        setZipcode(neighborObj['zipCode']);
    }

    // Find locality/neighborhood by lat long
    const findLocality = (lat, long, stateObj) => {
        if (!('neighborhoods' in stateObj)) {
            setNeighborhood(lat, long, googleApiKey).then((neighborObj) => {
                setLocationVariables(neighborObj);
            })
        } else {
            setLocationVariables(stateObj);
        }
    }

    // Find association by lat long
    const findAssociation = (lat, long) => {
        findAssociations(lat, long).then((associations) => {
            setAssociations(associations);
            if (associations.length > 0) {
                setCurrentAssoc(associations[0]);
            } else {
                setCurrentAssoc({});
            }
        });
    }

    // Find association by id
    const setAssocByOrg = (id) => {
        let params = {'associationID': id}
        var url = generateURL("/api/association/get_assoc/?", params);
        fetch(url).then((response) => {
            if (response.ok) {
                response.json().then(association => {
                    setCurrentAssoc(association);
                });
            }
        }).catch((e) => {
            alert(e);
        });
    }

    // Find location attributes when page loads
    const setLocationState = () => {
        getMyLocation().then((stateObj) => {
            setIsLoaded(true);
            const lat = stateObj['latitude'];
            const long = stateObj['longitude'];
            setLatitude(lat);
            setLongitude(long);
            findLocality(lat, long, stateObj);
            if (stateRef.current === '') {
                findAssociation(lat, long);
            }
		});
    }

    // Find location attributes based on string
    const onLocationSubmit = (e, locationString) => {
		e.preventDefault();
		e.stopPropagation();
		return Geocode.fromAddress(locationString).then(
			response => {
                const { lat, lng } = response.results[0].geometry.location;
				clearCookies();
				setLatLongCookie(lat, lng);
                setIsLoaded(true);

                setLatitude(lat);
                setLongitude(lng);

				setNeighborhood(lat, lng, googleApiKey).then((neighborObj) => {
                    setLocationVariables(neighborObj);

                    // Only update org if it is not in a org specific page
                    if (stateRef.current === '') {
                        findAssociation(lat, lng);
                    }
				});
				return true;
			}, () => {
				return false;
			}
		);
    }

    // Refresh location (to current location)
    const refreshLocation = () => {
		clearCookies();
		setIsLoaded(false);
		setLocationState(googleApiKey);
    }

    const registerPage = (props, org) => {
        if (stateRef.current === '' && org !== '') {
            stateRef.current = org;
            if (org === 'pitt') {
                setAssocByOrg('5e843ab29ad8d24834c8edbf');
            }
        }
        const locationProps = {
            'latitude': latitude,
            'longitude': longitude,
            'currentAssoc': currentAssoc,
            'neighborhoods': neighborhoods,
            'locality': locality,
            'state': state,
            'zipcode': zipcode
        }
        return <RegisterPage { ...props } org={org} locationProps={locationProps} isLoaded={isLoaded}
                            onLocationSubmit={onLocationSubmit} refreshLocation={refreshLocation}/>
    }

    const requestPage = (props, org) => {
        if (stateRef.current === '' && org !== '') {
            stateRef.current = org;
            if (org === 'pitt') {
                setAssocByOrg('5e843ab29ad8d24834c8edbf');
            }
        }
        const locationProps = {
            'latitude': latitude,
            'longitude': longitude,
            'currentAssoc': currentAssoc,
            'neighborhoods': neighborhoods,
            'locality': locality,
            'state': state,
            'zipcode': zipcode
        }
        return <RequestPage { ...props } org={org} locationProps={locationProps} isLoaded={isLoaded}
                            onLocationSubmit={onLocationSubmit} refreshLocation={refreshLocation}/>
    }

    return (
        <ToastProvider>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <link href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap" rel="stylesheet"></link>
        <Router>
            <Switch>
                <Route exact path="/completeOffer" component={CompleteOffer}/>
                <Route exact path="/internal/requests" component={InternalRequests}/>
                <Route exact path="/organizationPortal" component={OrganizationPortal}/>
                <Route exact path="/volunteerPortal" component={VolunteerPortal}/>
                <Route exact path="/verify" component={Verify}/>
                <Route exact path="/welcome" component={Welcome}/>
                <Route exact path="/pitt-request" render={(props) => requestPage(props, 'pitt')}/>
                <Route exact path="/request" render={(props) => requestPage(props, '')}/>
                <Route exact path="/pitt-volunteer" render={(props) => registerPage(props, 'pitt')}/>
                <Route exact path="/volunteer" render={(props) => registerPage(props, '')}/>
                <Route exact path="/resetPassword" component={ResetPassword}/>
                <Route exact path="/resetAssociationPassword" component={ResetAssociationPassword}/>
                <Route exact path="/orgAdmin" component={OrgAdminRegister} />
                <Route exact path="/orgPasswordReset" component={OrgReset} />
                <Route exact path="/updates" component={ChangeLog}/>
                <Route exact path="/submit-updates" component={SubmitChangeLog}/>
                <Route path="/" component={Home}/>
                <Route path="*" component={Home}/>
            </Switch>
        </Router>
        </ToastProvider>
    );
}

export default App;