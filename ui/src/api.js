import axios from "axios";

const api = axios.create({
  baseURL: "https://guruvishnu.pythonanywhere.com/api",
});

export default api;
