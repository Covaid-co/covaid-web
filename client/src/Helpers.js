
export const generateURL = (baseURL, params) => {
    let query = Object.keys(params)
					.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
					.join('&');
    baseURL += query;
    return baseURL;
}
