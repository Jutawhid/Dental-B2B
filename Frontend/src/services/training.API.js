import axios from '../api/BaseURL';
import authHeader from './auth-header';

class trainingAPI {
  // training list
  getTrainingList() {
    return axios.get('/training/list', {
      headers: authHeader(),
    });
  }
  // training add
  trainingAdd(userData) {
    console.log(userData);
    let formData = new FormData();
    if (userData.document) {
      formData.append('document', userData.document);
    }
    formData.append('title', userData.title);
    formData.append('description', userData.description);

    return axios.post('/training/add', formData, {
      headers: authHeader(),
    });
  }
  
  // training update
  trainingUpdate(userData,file) {
    console.log(userData);
    let formData = new FormData();

    formData.append('id', userData.id);
    formData.append('title', userData.title);
    formData.append('description', userData.description);
    if (file) {
      formData.append('document', file);
    }

    return axios.put('/training/update', formData, {
      headers: authHeader(),
    });
  }

  // training delete
  trainingDelete(id) {
    return axios.delete('/training/delete', {
      headers: authHeader(),
      data: {
        id: id,
      },
    });
  }
}

export default new trainingAPI();
