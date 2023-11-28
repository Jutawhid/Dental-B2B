import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://api.easifi.co/api/',
});

export default Api;
