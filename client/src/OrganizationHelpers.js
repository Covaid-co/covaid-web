
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

export const sortReq = (type, filteredRequests, name, need) => {
    var temp = JSON.parse(JSON.stringify(filteredRequests));
    if (type === 'name') {
        temp.sort(function(a, b) {
            const x = String(a.requester_first.toLowerCase())
            const y = String(b.requester_first.toLowerCase())
            return sortFn(x, y, name);
        });
    } else {
        temp.sort(function(a, b) {
            const x = new Date(a.date);
            const y = new Date(b.date);
            return sortFn(x, y, need);
        });
    }
    return temp;
}

export const filterReq = (query, unmatched) => {
    var filtered = unmatched;
    if (!(!query || query === "")) {
        filtered = unmatched.filter(p => {
            var dup = JSON.parse(JSON.stringify(p.resource_request));
            dup.push('groceries');
            var emailMatch = String(p.requester_email.toLowerCase()).startsWith(query);
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


export const formatName = (request) => {
    var first = request.requester_first;
    first = capitalize(String(first.toLowerCase()));
    var last = request.requester_last ? capitalize(String(request.requester_last.toLowerCase())) : "";
    return first + ' ' + last;
}