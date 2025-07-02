import axios from "axios";
const BASE_URL = 'http://localhost:3000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout:10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;

/*
baseURL: The base URL for the API requests. In this case, it is set to 'http://localhost:3000/api'.

withCredentials: true means that cookies , authorization headers , or TLS client certificates will be sent with the request across domains.

timeout: 10000 sets a timeout of 10 seconds for the request. If the request takes longer than this, it will be aborted.

headers: This sets the default headers for the requests. In this case, it sets the 'Content-Type' to 'application/json', indicating that the request body will be in JSON format.
*/
