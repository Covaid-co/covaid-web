import Cookie from "js-cookie";
import Geocode from 'react-geocode';
import { generateURL } from '../Helpers';
Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");


export const findAssociations = (lat, long, currentComponent) => {
    let params = {'latitude': lat, 'longitude': long};
    const url = generateURL("/api/association/byLatitudeLongitude?", params);
    async function fetchData() {
        const response = await fetch(url);
        response.json().then((data) => {
            currentComponent.setState({'associations': data});
            if (data.length > 0) {
                currentComponent.setState({'currentAssoc': data[0]})
            } else {
                currentComponent.setState({'currentAssoc': {}})
            }
        });
    }
    fetchData();
}

export const setNeighborhood = (latitude, longitude, currentComponent) => {
    currentComponent.setState({
        latitude: latitude,
        longitude: longitude
    });

    Geocode.fromLatLng(latitude, longitude).then(
        response => {
            var foundNeighborhoods = [];
            var foundState = [];
            var foundZipCode = '';
            var prevLocality = '';
            var locality = '';
            for (var i = 0; i < Math.min(5, response.results.length); i++) {
                const results = response.results[i]['address_components'];
                for (var j = 0; j < results.length; j++) {
                    const types = results[j].types;
                    if (types.includes('neighborhood') || types.includes('locality')) {
                        const currNeighborhoodName = results[j]['long_name'];
                        if (foundNeighborhoods.includes(currNeighborhoodName) === false) {
                            foundNeighborhoods.push(currNeighborhoodName);
                        }
                    }

                    if (types.includes('postal_code')) {
                        if (foundZipCode === '') {
                            foundZipCode = results[j]['long_name'];
                        }
                    }

                    for (var k = 0; k < types.length; k++) {
                        const type = types[k];
                        if (type.includes('administrative_area_level')) {
                            if (locality === '') {
                            locality = prevLocality;
                            }
                        }
                        if (foundState.length === 0 && type === "administrative_area_level_1") {
                            foundState = [results[j]['long_name'], results[j]['short_name']];
                        }
                    }
                    prevLocality = results[j]['long_name'];
                }
            }

            var date = new Date();
            date.setTime(date.getTime() + ((60 * 60 * 1) * 1000));
            Cookie.set('latitude', latitude, { expires: date });
            Cookie.set('longitude', longitude, { expires: date });
            Cookie.set('zipcode', foundZipCode, { expires: date });
            Cookie.set('neighborhoods', foundNeighborhoods, { expires: date });
            Cookie.set('locality', locality, { expires: date });
            Cookie.set('state', foundState, { expires: date });
            currentComponent.setState({
                isLoaded: true,
                neighborhoods: foundNeighborhoods,
                zipCode: foundZipCode,
                locality: locality,
                state: foundState
            });
            currentComponent.handleHideModal();
        },
        error => {
            console.error(error);
        }
    );
}

export const getMyLocation = (currentComponent) =>  {
    const lat = Cookie.get('latitude');
    const long = Cookie.get('longitude');
    const zip = Cookie.get('zipcode');
    const neighborhoods = Cookie.get('neighborhoods');
    const locality = Cookie.get('locality');
    const foundState = Cookie.get('state');
    if (lat && long && zip && neighborhoods && locality && foundState) {
        currentComponent.setState({
            isLoaded: true,
            latitude: lat,
            longitude: long,
            neighborhoods: JSON.parse(neighborhoods),
            locality: locality,
            zipCode: zip,
            state: JSON.parse(foundState)
        });
        findAssociations(lat, long, currentComponent);
        return;
    }

    // set actualLat and actualLong for the current users real location
    // only if cookie has been set already
    // ask user to confirm their current location now
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
        location.getCurrentPosition((position) => {
            setNeighborhood(position.coords.latitude, position.coords.longitude, currentComponent);
            findAssociations(position.coords.latitude, position.coords.longitude, currentComponent);
        }, (error) => {
            console.log(error);
        });
    }
  }