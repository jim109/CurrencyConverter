import axios from 'axios';

const authApi = axios.create({

    baseURL:'https://restserver-production-3297.up.railway.app'
});


export default authApi;