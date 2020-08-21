import { generateURL, convertTime } from "../Helpers";
import { request_status, volunteer_status } from "../constants";
import fetch_a from "../util/fetch_auth";
import { calcDistance } from "../Helpers";

export const distance = (volunteer, request) => {
  const latA = volunteer.latitude;
  const longA = volunteer.longitude;
  const latB = request.location_info.coordinates[1];
  const longB = request.location_info.coordinates[0];
  const meters = calcDistance(latA, longA, latB, longB);
  const miles = meters * 0.00062137;
  return Math.round(miles * 100) / 100;
};

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
};

const parseByType = (type, request) => {
  if (type === "Name") {
    return request.personal_info.requester_name.toLowerCase();
  } else if (type === "Date created") {
    return new Date(request.request_info.date);
  } else if (type === "Last Updated") {
    return new Date(request.admin_info.last_modified);
  } else if (type === "Admin") {
    return request.admin_info.assignee && request.admin_info.assignee.length > 0
      ? request.admin_info.assignee
      : "No one assigned";
  } else if (type === "Completed Method") {
    return request.status.completed_reason && request.status.current_status == 2
      ? request.status.completed_reason
      : "NA";
  } else {
    return new Date(request.time_posted);
  }
};

// Sort requests based on the sort type
export const sortReq = (type, filteredRequests) => {
  var temp = JSON.parse(JSON.stringify(filteredRequests));
  temp.sort((request_a, request_b) => {
    const x = parseByType(type, request_a);
    const y = parseByType(type, request_b);
    return sortFn(x, y, true);
  });
  return temp;
};

// Volunteer filtering based on query from admin
export const filterVolunteers = (query, volunteers) => {
  var filtered = volunteers;
  if (!(!query || query === "")) {
    filtered = filtered.filter((volunteer) => {
      var firstNameMatch = String(
        volunteer.first_name.toLowerCase()
      ).startsWith(query);
      var lastNameMatch = volunteer.last_name
        ? String(volunteer.last_name.toLowerCase()).startsWith(query)
        : false;
      var emailMatch = String(volunteer.email.toLowerCase()).startsWith(query);
      var phoneMatch = volunteer.phone
        ? String(volunteer.phone.toLowerCase()).startsWith(query)
        : false;
      // for (var i = 0; i < volunteer.offer.tasks.length; i++) {
      //     if (String(volunteer.offer.tasks[i]).toLowerCase().startsWith(query)) {
      //         return true;
      //     }
      // }
      for (var i = 0; i < volunteer.offer.neighborhoods.length; i++) {
        if (
          String(volunteer.offer.neighborhoods[i])
            .toLowerCase()
            .startsWith(query)
        ) {
          return true;
        }
      }
      return firstNameMatch || lastNameMatch || emailMatch || phoneMatch;
    });
  }
  filtered.sort(function (a, b) {
    const x = String(a.first_name.toLowerCase());
    const y = String(b.first_name.toLowerCase());
    return sortFn(x, y, false);
  });
  return filtered;
};

// Request filtering based on query from admin
export const filterReq = (query, requests) => {
  var filtered_requests = requests;
  if (!(!query || query === "")) {
    filtered_requests = requests.filter((r) => {
      // Resource list
      var resources = JSON.parse(
        JSON.stringify(r.request_info.resource_request)
      );
      resources.push("groceries");

      // Requester email
      const email = r.personal_info.requester_email;
      const email_match = email
        ? String(email.toLowerCase()).startsWith(query)
        : false;

      // Requester name
      const name = String(r.personal_info.requester_name.toLowerCase());
      const name_match = name.startsWith(query);

      // Admin name
      const admin_name = String(r.admin_info.assignee.toLowerCase());
      const admin_match = admin_name.startsWith(query);

      for (var i = 0; i < resources.length; i++) {
        if (String(resources[i]).toLowerCase().startsWith(query)) {
          return true;
        }
      }
      return email_match || name_match || admin_match;
    });
  }
  filtered_requests.sort(function (a, b) {
    const x = new Date(a.admin_info.last_modified);
    const y = new Date(b.admin_info.last_modified);
    return sortFn(x, y, true);
  });
  return filtered_requests;
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Formatting requesters name
export const formatName = (first, last) => {
  first = first !== undefined ? capitalize(String(first.toLowerCase())) : "";
  last = last !== undefined ? capitalize(String(last.toLowerCase())) : "";
  if (first !== undefined && last === "") {
    const split = first.split(" ");
    if (split.length > 1) {
      first = split[0];
      split.shift();
      last = split.join(" ");
      last = capitalize(String(last.toLowerCase()));
    }
  }
  return first + " " + last;
};

// Get organization or admin's first_name
export const getName = (admin, association) => {
  if (Object.keys(admin).length === 0 && admin.constructor === Object) {
    return association.name;
  } else {
    return admin.first_name;
  }
};

export const fetchBeacons = async () => {
  const response = await fetch_a("org_token", "/api/beacon/", {
    method: "get",
  });
  const data = await response.json();
  return data;
};

// Return orgs volunteers
export const fetchOrgVolunteers = async (id) => {
  let params = { association: id };
  var url = generateURL("/api/users/allFromAssoc?", params);
  const response = await fetch(url, {
    method: "get",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  var resVolunteer = data.map((volunteer) => {
    volunteer.latitude = volunteer.latlong[1];
    volunteer.longitude = volunteer.latlong[0];
    return volunteer;
  });
  resVolunteer.sort(function (a, b) {
    const x = String(a.first_name.toLowerCase());
    const y = String(b.first_name.toLowerCase());
    return sortFn(x, y, false);
  });

  return resVolunteer;
};

// Return orgs requests
export const fetchOrgRequests = async (id) => {
  let params = { association: id };
  var url = generateURL("/api/request/allRequestsInAssoc?", params);
  const response = await fetch(url, {
    method: "get",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  var res = {};
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
};

export const filter_requests = (requests, type) => {
  return requests.filter((request) => request.status.current_status === type);
};

export const filter_volunteers = (volunteers, status) => {
  return volunteers.filter((volunteer) => volunteer.current_status === status);
};

// Split all requests in unmatched, matched and completed requests
export const splitRequests = (requests) => {
  var unMatchedArr = filter_requests(requests, request_status.UNMATCHED);
  var matchedArr = filter_requests(requests, request_status.MATCHED);
  var completedArr = filter_requests(requests, request_status.COMPLETED);
  return {
    unmatched: unMatchedArr,
    matched: matchedArr,
    completed: completedArr,
  };
};

// Check whether a request has a volunteer in progress or not
export const isInProgress = (request) => {
  var in_progress = false;
  const request_volunteers = request.status.volunteers;
  for (var i = 0; i < request_volunteers.length; i++) {
    if (request_volunteers[i].current_status === volunteer_status.IN_PROGRESS) {
      in_progress = true;
    }
  }
  return in_progress;
};

// Check whether a request has pending volunteers
export const isInPending = (request) => {
  var pending = false;
  const request_volunteers = request.status.volunteers;
  for (var i = 0; i < request_volunteers.length; i++) {
    if (request_volunteers[i].current_status === volunteer_status.PENDING) {
      pending = true;
    }
  }
  return pending;
};

// Update all requests array with the new update request
export const updateAllRequests = (request, allRequests, remove) => {
  return allRequests.map((curr_request) => {
    if (curr_request._id === request._id) {
      if (remove) {
        return;
      }
      return request;
    }
    return curr_request;
  });
};
