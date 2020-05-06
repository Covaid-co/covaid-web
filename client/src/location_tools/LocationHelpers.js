import Cookie from "js-cookie";
import Geocode from 'react-geocode';
import { generateURL } from '../Helpers';


export const setLatLongCookie = (lat, long) => {
    var date = new Date();
    date.setTime(date.getTime() + ((60 * 60 * 1) * 1000));
    Cookie.set('latitude', lat, { expires: date });
    Cookie.set('longitude', long, { expires: date });
}


export const findAssociations = async (lat, long) => {
    let params = {'latitude': lat, 'longitude': long};
    const url = generateURL("/api/association/get_assoc/lat_long?", params);
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export const setNeighborhood = async (latitude, longitude, googleApiKey) => {
    var foundNeighborhoods = [];
    var foundState = [];
    var foundZipCode = '';
    var prevLocality = '';
    var locality = '';
    
    Geocode.setApiKey(googleApiKey);

    const response = await Geocode.fromLatLng(latitude, longitude);
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
    Cookie.set('zipcode', foundZipCode, { expires: date });
    Cookie.set('neighborhoods', foundNeighborhoods, { expires: date });
    Cookie.set('locality', locality, { expires: date });
    Cookie.set('state', foundState, { expires: date });
    const neighborhoodObj = {
        neighborhoods: foundNeighborhoods,
        zipCode: foundZipCode,
        locality: locality,
        state: foundState
    }
    return neighborhoodObj;
}

var getPosition = function (options) {
    return new Promise(function (resolve, reject) {
        window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}


export const getMyLocation = async () =>  {
    const lat = Cookie.get('latitude');
    const long = Cookie.get('longitude');
    const zip = Cookie.get('zipcode');
    const neighborhoods = Cookie.get('neighborhoods');
    const locality = Cookie.get('locality');
    const foundState = Cookie.get('state');
    if (lat && long && zip && neighborhoods && locality && foundState) {
        const currStateObj = {
            latitude: lat,
            longitude: long,
            neighborhoods: JSON.parse(neighborhoods),
            locality: locality,
            zipCode: zip,
            state: JSON.parse(foundState)
        }
        return currStateObj;
    }

    const res = await getPosition();
    setLatLongCookie(res.coords.latitude, res.coords.longitude);
    return {latitude: res.coords.latitude, longitude: res.coords.longitude};
}