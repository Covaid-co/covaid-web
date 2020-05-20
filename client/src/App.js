import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {ToastProvider} from 'react-toast-notifications';
import Geocode from "react-geocode";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './Home.css'
import './changelog/ChangeLog.css'
import './styling/NewHomePage.css';

import Verify from './components_homepage/Verify'
import RequestPage from './request_help/RequestPage'
import ResetPassword from './ResetPassword'
import ResetAssociationPassword from './ResetAssociationPassword'
import OrganizationPortal from './OrganizationPortal'
import VolunteerPortal from './VolunteerPortal'
import OrgAdminRegister from './components_orgpage/OrgAdminRegister'
import OrgReset from './components_orgpage/OrgReset';
import RegisterPage from './volunteer_registration/RegisterPage';
import ChangeLog from './changelog/ChangeLog';
import SubmitChangeLog from './changelog/SubmitChangeLog';
import HomePage from './HomePage';

import { defaultResources } from './constants'
import { generateURL, clearCookies } from './Helpers';
import { findAssociations, getMyLocation, setNeighborhood, setLatLongCookie } from './location_tools/LocationHelpers'


function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [latitude, setLatitude] = useState(40.4379259);
    const [longitude, setLongitude] = useState(-79.9556424);
    const [totalVolunteers, setTotalVolunteers] = useState(0);
    const [associations, setAssociations] = useState([]);
    const [currentAssoc, setCurrentAssoc] = useState(null);
    const [locality, setLocality] = useState('');
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [resources, setResources] = useState(defaultResources);
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

        fetch('/api/users/totalUsers')
        .then((res) => res.json())
        .then((res) => {
            setTotalVolunteers(res.count);
        });
    }, []);


    const setLocationVariables = (neighborObj) => {
        setLocality(neighborObj['locality']);
        setNeighborhoods(neighborObj['neighborhoods']);
        setState(neighborObj['state']);
        setZipcode(neighborObj['zipCode']);
    }

    // Find locality/neighborhood by lat long
    const findLocality = (lat, long, stateObj, googleApiKey) => {
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
                setResources(associations[0].resources);
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
                    setResources(association.resources);
                    setCurrentAssoc(association);
                });
            }
        }).catch((e) => {
            alert(e);
        });
    }

    // Find location attributes when page loads
    const setLocationState = (key) => {
        getMyLocation().then((stateObj) => {
            setIsLoaded(true);
            const lat = parseFloat(stateObj['latitude']);
            const long = parseFloat(stateObj['longitude']);
            setLatitude(lat);
            setLongitude(long);
            findLocality(lat, long, stateObj, key);
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

                setLatitude(parseFloat(lat));
                setLongitude(parseFloat(lng));

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
            } else if (org === 'ccom') {
                setAssocByOrg('5eac6be7bd9e0369f78a0f28');
            } else if (org === 'charlotte') {
                setAssocByOrg('5e909963a4141a039a6fc1e5');
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
            } else if (org === 'ccom') {
                setAssocByOrg('5eac6be7bd9e0369f78a0f28');
            } else if (org === 'charlotte') {
                setAssocByOrg('5e909963a4141a039a6fc1e5');
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

    const homePageComp = (props, login) => {
        return <HomePage { ...props }
                        refreshLocation={refreshLocation}
                        onLocationSubmit={onLocationSubmit}
                        latitude={latitude}
                        longitude={longitude}
                        currentAssoc={currentAssoc}
                        neighborhoods={neighborhoods}
                        locality={locality}
                        state={state}
                        isLoaded={isLoaded}
                        zipcode={zipcode}
                        resources={resources}
                        login={login}/>
    }

    return (
        <ToastProvider>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <link href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap" rel="stylesheet"></link>
        <Router>
            <Switch>
                <Route exact path="/organizationPortal" component={OrganizationPortal}/>
                <Route exact path="/volunteerPortal" component={VolunteerPortal}/>
                <Route exact path="/verify" component={Verify}/>
                <Route exact path="/pgh-request" render={(props) => requestPage(props, 'pitt')}/>
                <Route exact path="/ccom-request" render={(props) => requestPage(props, 'ccom')}/>
                <Route exact path="/charlotte-request" render={(props) => requestPage(props, 'charlotte')}/>
                <Route exact path="/request" render={(props) => requestPage(props, '')}/>
                <Route exact path="/pgh-volunteer" render={(props) => registerPage(props, 'pitt')}/>
                <Route exact path="/ccom-volunteer" render={(props) => registerPage(props, 'ccom')}/>
                <Route exact path="/charlotte-volunteer" render={(props) => registerPage(props, 'charlotte')}/>
                <Route exact path="/volunteer" render={(props) => registerPage(props, '')}/>
                <Route exact path="/resetPassword" component={ResetPassword}/>
                <Route exact path="/resetAssociationPassword" component={ResetAssociationPassword}/>
                <Route exact path="/orgAdmin" component={OrgAdminRegister} />
                <Route exact path="/orgPasswordReset" component={OrgReset} />
                <Route exact path="/updates" component={ChangeLog}/>
                <Route exact path="/submit-updates" component={SubmitChangeLog}/>
                <Route exact path="/volunteer-signin" component={(props) => homePageComp(props, true)}/>
                <Route path="/" component={homePageComp}/>
                <Route path="*" component={homePageComp}/>
            </Switch>
        </Router>
        </ToastProvider>
    );
}

export default App;