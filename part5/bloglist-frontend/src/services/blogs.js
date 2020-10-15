import axios from 'axios'
const baseUrl = '/api/blogs/'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// Functions that set or require authentication

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const createBlog = async (entry) => {
  const config = { headers: { Authorization: token } }

  const response = await axios.post(baseUrl, entry, config)
  return response.data
}

const updateBlog = async (entry, id) => {
  const config = { headers: { Authorization: token } }
  const url = baseUrl + id

  const response = await axios.put(url, entry, config)
  return response.data
}

const removeBlog = async (id) => {
  const config = { headers: { Authorization: token } }
  const url = baseUrl + id

  const response = await axios.delete(url, config)
  return response.data
}

export default { getAll, setToken, createBlog, updateBlog, removeBlog }