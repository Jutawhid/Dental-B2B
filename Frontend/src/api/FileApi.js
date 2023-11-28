import axios from 'axios';

const FileApi = axios.create({
  fileURL: 'http://localhost:3001/upload/images/profile/',
});

export default FileApi;
