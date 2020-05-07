import { generateURL, convertTime } from '../Helpers';
import fetch_a from '../util/fetch_auth';

export const sortFn = (x, y, direction) => {
    if (direction) {
        if (x > y) {
            return -1;
        }
        if (y > x) {
            return 1;
        }
    } else {
        if (x < y) {
            return -1;
        }
        if (y < x) {
            return 1;
        }
    }
    return 0;
}

export const sortReq = (type, filteredRequests, name, need, updated, posted) => {
    var temp = JSON.parse(JSON.stringify(filteredRequests));
    if (type === 'name') {
        temp.sort(function(a, b) {
            const x = String(a.requester_first.toLowerCase())
            const y = String(b.requester_first.toLowerCase())
            return sortFn(x, y, name);
        });
    } else if (type === 'need') {
        temp.sort(function(a, b) {
            const x = new Date(a.date);
            const y = new Date(b.date);
            return sortFn(x, y, need);
        });
    } else if (type === 'updated') {
        for (var i = 0; i < temp.length; i++) {
            if (!temp[i].last_modified && temp[i].time_posted) {
                temp[i].last_modified = temp[i].time_posted;
            }
        }
        temp.sort(function(a, b) {
            var x = new Date();
            x.setFullYear(2000);
            if (a.last_modified) {
                x = new Date(a.last_modified);
            }
            var y = new Date();
            y.setFullYear(2000);
            if (b.last_modified) {
                y = new Date(b.last_modified);
            }
            return sortFn(x, y, updated);
        });
    } else {
        temp.sort(function(a, b) {
            var x = new Date();
            x.setFullYear(2000);
            if (a.time_posted) {
                x = new Date(a.time_posted);
            }
            var y = new Date();
            y.setFullYear(2000);
            if (b.time_posted) {
                y = new Date(b.time_posted);
            }
            return sortFn(x, y, posted);
        });
    }
    return temp;
}

// Volunteer filtering based on query from admin
export const filterVolunteers = (query, volunteers) => {
    var filtered = volunteers;
    if (!(!query || query === "")) {
        filtered = filtered.filter(volunteer => {
            var firstNameMatch = String(volunteer.first_name.toLowerCase()).startsWith(query);
            var lastNameMatch = volunteer.last_name ? String(volunteer.last_name.toLowerCase()).startsWith(query) : false;
            var emailMatch = String(volunteer.email.toLowerCase()).startsWith(query);
            var phoneMatch = volunteer.phone ? String(volunteer.phone.toLowerCase()).startsWith(query) : false;
            // for (var i = 0; i < volunteer.offer.tasks.length; i++) {
            //     if (String(volunteer.offer.tasks[i]).toLowerCase().startsWith(query)) {
            //         return true;
            //     }
            // }
            for (var i = 0; i < volunteer.offer.neighborhoods.length; i++) {
                if (String(volunteer.offer.neighborhoods[i]).toLowerCase().startsWith(query)) {
                    return true;
                }
            }
            return firstNameMatch || lastNameMatch || emailMatch || phoneMatch;
        });
    }
    filtered.sort(function(a, b) {
        const x = String(a.first_name.toLowerCase())
        const y = String(b.first_name.toLowerCase())
        return sortFn(x, y, false);
    });
    return filtered;
}

// Request filtering based on query from admin
export const filterReq = (query, unmatched) => {
    var filtered = unmatched;
    if (!(!query || query === "")) {
        filtered = unmatched.filter(p => {
            var dup = JSON.parse(JSON.stringify(p.resource_request));
            dup.push('groceries');
            var emailMatch = p.requester_email ? String(p.requester_email.toLowerCase()).startsWith(query): false;
            var firstNameMatch = String(p.requester_first.toLowerCase()).startsWith(query);
            var lastNameMatch = p.requester_last ? String(p.requester_last.toLowerCase()).startsWith(query) : false;
            var ass = (p.assignee) ? String(p.assignee.toLowerCase()).startsWith(query) : false;
            for (var i = 0; i < dup.length; i++) {
                if (String(dup[i]).toLowerCase().startsWith(query)) {
                    return true;
                }
            }
            return emailMatch || firstNameMatch || lastNameMatch || ass;
        });
    }
    filtered.sort(function(a, b) {
        const x = new Date(a.date);
        const y = new Date(b.date);
        return sortFn(x, y, true);
    });
    return filtered;
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

// Formatting requesters name 
export const formatName = (first, last) => {
    first = first !== undefined ? capitalize(String(first.toLowerCase())) : "";
    last = last !== undefined ? capitalize(String(last.toLowerCase())) : "";
    if (first !== undefined && last === "") {
        const split = first.split(' ');
        if (split.length > 1) {
            first = split[0];
            split.shift();
            last = split.join(' ');
            last = capitalize(String(last.toLowerCase()));
        }
    }
    return first + ' ' + last;
}

// Get organization or admin's first_name
export const getName = (admin, association) => {
    if (Object.keys(admin).length === 0 && admin.constructor === Object) {
        return association.name;
    } else {
        return admin.first_name;
    }
}


export const fetchBeacons = async () => {
    const response = await fetch_a('org_token', '/api/beacon/', {
        method: 'get',
    })
    const data = await response.json();
    return data;
}


// Return orgs volunteers
export const fetchOrgVolunteers = async (id) => {
    let params = {'association': id};
    var url = generateURL("/api/users/allFromAssoc?", params);
    const response = await fetch(url, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    });

    const data = await response.json();
    var resVolunteer = data.map((volunteer) => {
        volunteer.latitude = volunteer.latlong[1];
        volunteer.longitude = volunteer.latlong[0];
        return volunteer;
    });
    resVolunteer.sort(function(a, b) {
        const x = String(a.first_name.toLowerCase())
        const y = String(b.first_name.toLowerCase())
        return sortFn(x, y, false);
    });

    return resVolunteer;
}

// Return orgs requests
export const fetchOrgRequests = async (id) => {
    let params = {'association': id}
    var url = generateURL( "/api/request/allRequestsInAssoc?", params);
    const response = await fetch(url, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    });
    const data = await response.json();
    var res = {}
    data.forEach(function (result) {
        if (result.time_posted) {
            var day = convertTime(result.time_posted);
            if (!res[day]) {
                res[day] = 0;
            }
            res[day]++;
        }
    });
    return data;
}

// Split all requests in unmatched, matched and completed requests
export const splitRequests = (data) => {
    var unMatchedArr = [];
    var matchedArr = [];
    var completedArr = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].status) {
            if (data[i].status.current_status === 'in_progress') {
                matchedArr.push(data[i]);
            } else if (data[i].status.current_status === 'incomplete' || data[i].status.current_status === 'pending') {
                unMatchedArr.push(data[i]);
            } else {
                completedArr.push(data[i]);
            }
        } else {
            unMatchedArr.push(data[i]);
        }
    }
    return {
        unmatched: unMatchedArr,
        matched: matchedArr,
        completed: completedArr
    }
}