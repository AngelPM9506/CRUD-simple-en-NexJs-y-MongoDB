import axios from "axios";

let urlBase = process.env.AXIOS_URL_BASE;

const api = axios.create({
    baseURL: urlBase
});

export default api; 