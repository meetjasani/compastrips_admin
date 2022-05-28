import {API} from '../../config/API/api.config';
import Auth from '../../config/Auth';
export const BaseURL = API.endpoint + '/';
const axios = require('axios').default;

const defaultHeaders = {
    isAuth: true,
    AdditionalParams: {},
    isJsonRequest: true
};


interface apiResponse {
    data: {
            data: any,
            message: string,
            status: number
        },
        status: number,
}

export const ApiGet = (type: string, header = defaultHeaders) => {
    return new Promise((resolve, reject) => {
        const s = type.includes('?') ? '&' : '?';
        axios.get(BaseURL + type + `${s}lang=ko`, getHttpOptions(header))
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
                // console.log(responseJson);
            })
            .catch((error: any) => {
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}

export const ApiDelete = (type: string, header = defaultHeaders) => {
    return new Promise((resolve, reject) => {
        const s = type.includes('?') ? '&' : '?';
        axios.delete(BaseURL + type + `${s}lang=ko`, getHttpOptions(header))
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
                // console.log(responseJson);
            })
            .catch((error: any) => {
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiPut = (type: string,data:any) => {
    return new Promise((resolve, reject) => {
        const s = type.includes('?') ? '&' : '?';
        axios.put(BaseURL + type + `${s}lang=ko`,data,getHttpOptions())
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
                // console.log(responseJson);
            })
            .catch((error: any) => {
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiPatch = (type: string,data:any) => {
    return new Promise((resolve, reject) => {
        const s = type.includes('?') ? '&' : '?';
        axios.patch(BaseURL + type + `${s}lang=ko`,data,getHttpOptions())
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
                // console.log(responseJson);
            })
            .catch((error: any) => {
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}

export const ApiGetNoAuth = (type: string) => {
    return new Promise((resolve, reject) => {
        const s = type.includes('?') ? '&' : '?';
        axios.get(BaseURL + type + `${s}lang=ko`, getHttpOptions({ ...defaultHeaders, isAuth: false }))
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    }) ;
}

export const ApiPost = (type: any, userData: any) => {
    return new Promise((resolve, reject) => {
        const s = type.includes('?') ? '&' : '?';
        axios.post(BaseURL + type + `${s}lang=ko`, userData, getHttpOptions())
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
                // console.log(responseJson);               
                if(responseJson.data && responseJson.data.data && responseJson.data.data.token)
                Auth.setAuthToken(JSON.stringify(responseJson.data.data.token));
            })
            .catch((error: any) => {
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('message') && error.response.data.message) {
                    reject(error.response.data.message);
                } else {
                    reject();
                }
            });
    });
}



export const getHttpOptions = (options = defaultHeaders) => {
    let headers = {
        Authorization: "",
        'Content-Type': "application/json",
    };

    if (options.hasOwnProperty('isAuth') && options.isAuth) {
        headers['Authorization'] = Auth.getToken() ?? "";
    }

    if (options.hasOwnProperty('isJsonRequest') && options.isJsonRequest) {
        headers['Content-Type'] = 'application/json';
    }

    if (options.hasOwnProperty('AdditionalParams') && options.AdditionalParams) {
        headers = {...headers, ...options.AdditionalParams};
    }

    return {headers}
}