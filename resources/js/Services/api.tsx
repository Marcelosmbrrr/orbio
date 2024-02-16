import axios from "axios";

const api = axios.create({
    baseURL: window.location.origin,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

api.defaults.timeout = 10000;

export { api };