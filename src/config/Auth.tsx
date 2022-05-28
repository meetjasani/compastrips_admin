import STORAGEKEY from "./APP/app.config";



class Auth {


    /**
     * Authenticate a user. Save a token string in Local Storage
     *
     * @param {string} token
     */
     static setAuthToken(token: string) {
        localStorage.setItem(STORAGEKEY.token, token);
    }


    /**
     * Get a token value.
     *
     * @returns {string}
     */
     static getToken() {
        return localStorage.getItem(STORAGEKEY.token);
    }

    static isUserAuthenticated() {
        return (localStorage.getItem(STORAGEKEY.token) !== null || sessionStorage.getItem(STORAGEKEY.token) !== null);
    }

}

export default Auth;