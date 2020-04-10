
export const generateURL = (baseURL, params) => {
    let query = Object.keys(params)
					.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
					.join('&');
    baseURL += query;
    return baseURL;
}

export const generateMapsURL = (lat, long) => {
    var tempURL = "https://www.google.com/maps/@";
    tempURL += lat + ',';
    tempURL += long + ',15z';
    return tempURL;
}

export const moveFromToArr = (curr, x, setX, y, setY) => {
    var dup = [...x];
    for (var i = 0; i < dup.length; i++) {
        if (curr._id === dup[i]._id) {
            dup.splice(i, 1);
        }
    }
    setX(dup);

    var dup1 = [...y];
    const currDupped = JSON.parse(JSON.stringify(curr));
    dup1.push(currDupped);
    setY(dup1);
}

export const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

var rad = function(x) {
    return x * Math.PI / 180;
};

export const calcDistance = (latA, longA, latB, longB) => {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(latB - latA);
    var dLong = rad(longB - longA);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(latA)) * Math.cos(rad(latB)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
}