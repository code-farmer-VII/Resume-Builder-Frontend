import axios from 'axios';

// Laravel API base URL
axios.defaults.baseURL = 'http://localhost:8000'; // or your backend URL

// Enable cookies for SPA authentication
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default axios;
