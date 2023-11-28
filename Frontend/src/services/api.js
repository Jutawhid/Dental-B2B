import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api/v1', //localhost url
  // baseURL: 'https://dev.easifi.co:3000/api/v1', //server url
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
