import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const add = (entry) => {
  const request = axios.post(baseUrl, entry);
  return request.then((response) => response.data);
};

const update = (entry, id) => {
  const request = axios.put(`${baseUrl}/${id}`, entry);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, add, update, remove };
