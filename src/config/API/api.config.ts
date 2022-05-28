const protocol = `${process.env.REACT_APP_PROTOCOL}`;
const host = `${process.env.REACT_APP_HOST}`;
const apiPort = `${process.env.REACT_APP_PORT}`;
const trailUrl = `${process.env.REACT_APP_TRAIL_URL}`;

const hostUrl = `${protocol}://${host}${apiPort ? ':' + apiPort : ''}/`;
const endpoint = `${protocol}://${host}${(apiPort ? ':' + apiPort : '')}/${trailUrl}`;

const API_LOCAL = {
    protocol: protocol,
    host: host,
    port: apiPort,
    apiUrl: trailUrl,
    endpoint: endpoint,
    hostUrl: hostUrl
};

export const API = API_LOCAL
