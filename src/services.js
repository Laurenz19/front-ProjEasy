import axios from 'axios'

const setToken = (token) => {
  localStorage.setItem('token', token)
}

const getInstance = ()=>{
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json'
    }
  })

  instance.defaults.baseURL = "http://localhost:3000/api/"
  instance.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  return instance;
}

const logout = () => {
  localStorage.removeItem('token')
}

const getRecord = async (url) => {
  try {
    const axiosInstance = getInstance()
    const response = await axiosInstance.get(url)
    return response
  } catch (error) {
    return error.response
  }
}

const postRecord = async (url, body) => {
  try {
    const axiosInstance = getInstance()
    const response = await axiosInstance.post(url, body)
    return response
  } catch (error) {
    return error.response
  }
}

const deleteRecord = async (url) => {
  try {
    const axiosInstance = getInstance()
    const response = await axiosInstance.delete(url)
  } catch (error) {
    return error.response
  }
}

const patchRecord = async (url, body) => {
   try {
      const axiosInstance = getInstance()
      const response = await axiosInstance.patch(url, body)
      return response
    } catch (error) {
      return error.response
    }
}

const login = async (email, password) => {
  try {
    var axiosInstance = axios.create({
      baseURL: "http://localhost:3000/api",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await axiosInstance.post('/login', { email: email, password: password })
    if (response.status == 200) {
      console.log(response.data['accessToken'])
      setToken(response.data['accessToken'])
    }
    return response
  } catch (error) {
    return error.response
  }
}

export default {
  setToken,
  getRecord,
  deleteRecord,
  patchRecord,
  logout,
  login,
  postRecord
}
