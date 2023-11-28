import axios from 'axios';

const BASE_API = axios.create({
  baseURL: 'https://api.easifi.co/api/v1', //server url
  // baseURL: 'https://qaapi.easifi.co/api/v1', //server url
  // baseURL: 'http://localhost:3001/api/v1', //localhost url
  headers: {
    'Content-Type': 'application/json',
  },
});
export default BASE_API;
