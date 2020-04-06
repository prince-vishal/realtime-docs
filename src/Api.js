import axios from 'axios'

export default () => {
    return axios.create({
        baseURL: `https://docs-backend.herokuapp.com`,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
    });
}
