import Cookie from "js-cookie";
import Geocode from 'react-geocode'

Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");

function getMyLocation(setCurrentLocation, setViewableAssociation) {
    // If cookie is set, keep that lat and long with associated zip code
    if (Cookie.get('latitude') 
        && Cookie.get('longitude')
        && Cookie.get('zipcode')
        && Cookie.get('neighborhood')
        && Cookie.get('locality')) {
      const lat = Cookie.get('latitude');
      const long = Cookie.get('longitude');
      const zip = Cookie.get('zipcode');
      const neighborhood = Cookie.get('neighborhood');
      const locality = Cookie.get('locality');
      
      setCurrentLocation(
          {
              isLoaded: true,
              latitude: lat,
              longitude: long,
              zip: zip,
              neighborhood: neighborhood,
              locality: locality
          }
      )

      findAssociations(lat, long, setViewableAssociation);
      return;
    }
    // set actualLat and actualLong for the current users real location
    // only if cookie has been set already
    // ask user to confirm their current location now
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition((position) => {
        // Use actual current lat long to find zip and neighborhood
        setNeighborhood(position.coords.latitude, position.coords.longitude, '', setCurrentLocation);
        findAssociations(position.coords.latitude, position.coords.longitude, setViewableAssociation);
      }, (error) => {
        console.log(error)
      });
    }
}
  
function findAssociations(lat, long, setViewableAssociation) {
    var url = "/api/association/get_assoc/lat_long?";
    let params = {
        'latitude': lat,
        'longitude': long
    }
    let query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
    url += query;

    async function fetchData() {
        const response = await fetch(url);
        response.json().then((data) => {
            console.log(data)
            // currentComponent.setState({associations: data});
            // if (data.length > 0) {
            //   currentComponent.setState({currentAssoc: data[0]})
            // } else {
            //   currentComponent.setState({currentAssoc: {}})
            // }
        });
    }
    fetchData();
}

function setNeighborhood(latitude, longitude, zipCode, setCurrentLocation) {

    Geocode.fromLatLng(latitude, longitude).then(
        response => {
        var foundNeighborhood = '';
        var foundZipCode = '';
        var prevLocality = '';
        var locality = '';
        
        for (var i = 0; i < Math.min(4, response.results.length); i++) {
            const results = response.results[i]['address_components'];
            for (var j = 0; j < results.length; j++) {
            const types = results[j].types;
            // find neighborhood from current location

            if (types.includes('neighborhood') || types.includes('locality')) {
                if (foundNeighborhood === '') {
                foundNeighborhood = results[j]['long_name'];
                }
            }
            // find zip code from current location
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
            }
            prevLocality = results[j]['long_name'];
            }
        }

        if (zipCode !== '') {
            foundZipCode = zipCode;
        }

        var date = new Date();
        date.setTime(date.getTime() + ((60 * 60 * 1) * 1000));
        Cookie.set('latitude', latitude, { expires: date });
        Cookie.set('longitude', longitude, { expires: date });
        Cookie.set('zipcode', foundZipCode, { expires: date });
        Cookie.set('neighborhood', foundNeighborhood, { expires: date });
        Cookie.set('locality', locality, { expires: date })
        setCurrentLocation(
            {
                isLoaded: true,
                latitude: latitude,
                longitude: longitude,
                zip: foundZipCode,
                neighborhood: foundNeighborhood,
                locality: locality
            }
        )
        },
        error => {
        console.error(error);
        }
    );
}

  export default getMyLocation;