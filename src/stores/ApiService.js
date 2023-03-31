import axios from "axios";
import JWT from "jsonwebtoken";
import decode from "jwt-decode";

export default class ApiService {
    userAuthToken = null;

    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    isAuthenticated = () => {
        return this.userAuthToken !== null && !this.isTokenExpired(this.userAuthToken);
    };

    doLoginPost = async (email, password) => {
        return axios.post(
            `${this.apiUrl}auth/login`,
            {
                email: email,
                password: password,
            },
        );
    };

    login = async (email, password, redirectUrl = null) => {
        const response = await this.doLoginPost(email, password);
        this.userAuthToken = response.data.token;
        this.saveTokenInLocalStorage(this.userAuthToken);
        window.location = redirectUrl || "/"; // router not available at this point
    };

    logout = async () => {
        this.userAuthToken = null;
        this.removeTokenFromLocalStorage();
        window.location = "/login"; // router not available at this point
    };

    getTokenFromLocalStorage = () => {
        return window.localStorage.getItem("kk_auth_token");
    };

    saveTokenInLocalStorage = (token) => {
        window.localStorage.setItem("kk_auth_token", token);
    };

    removeTokenFromLocalStorage = () => {
        window.localStorage.removeItem("kk_auth_token");
    };

    tokenExpiryInSeconds = (token) => {
        const now = Date.now();
        const decodedToken = JWT.decode(token, { json: true });
        return decodedToken.exp - (now / 1000);
    };

    isTokenExpired = (token) => {
        return this.tokenExpiryInSeconds(token) <= 0;
    };

    isTokenCloseToExpiry = (token) => {
        return this.tokenExpiryInSeconds(token) < 300;
    };

    refreshToken = async (token) => {
        const requestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios.get(`${this.apiUrl}auth/refresh`, requestConfig);
        return response.data.token;
    };

    getToken = async () => {
        if (!this.userAuthToken) {
            this.userAuthToken = this.getTokenFromLocalStorage();
        }

        if (!this.userAuthToken || this.isTokenExpired(this.userAuthToken)) {
            // user must log in, redirect to login page

            // keep record of path and query params and pass to login for redirecting user to originally intended path
            // after successful login
            const pathName = window.location.pathname;
            const searchParams = window.location.search;
            const redirectUrl = pathName
                ? `?redirect_url=${encodeURIComponent(`${pathName}${searchParams}`)}`
                : "";

            if (pathName !== "/login") { // prevent recursion
                window.location = `/login${redirectUrl}`; // router not available at this point
            }

            throw new Error("User is not authenticated.");
        }

        // check if token is close to expiry, and refresh it if yes
        if (this.isTokenCloseToExpiry(this.userAuthToken)) {
            this.userAuthToken = await this.refreshToken(this.userAuthToken);
        }

        return this.userAuthToken;
    };

    getProfile = () => {
        if (!this.userAuthToken) {
            return null;
        }

        return decode(this.userAuthToken);
    };

    getRequestConfig = async (path, method, config) => {
        const absolutePath = `${this.apiUrl}${path}`;
        const token = await this.getToken();

        const requestConfig = {
            ...config,
            method: method,
            url: absolutePath,
        };
        if (Object.prototype.hasOwnProperty.call(requestConfig, "headers")) {
            requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        else {
            requestConfig.headers = { Authorization: `Bearer ${token}` };
        }
        return requestConfig;
    };

    makeHttpCall = async (path, method = "get", config = null) => {
        try {
            const requestConfig = await this.getRequestConfig(path, method, config);
            return axios(requestConfig);
        }
        catch (error) {
            // wrapping errors in JS is sucky
            // see discussion here: https://stackoverflow.com/questions/42754270/re-throwing-exception-in-nodejs-and-not-losing-stack-trace
            error.message = `Couldn't make HTTP call. ${error.message}`;
            throw error;
        }
    };

}
