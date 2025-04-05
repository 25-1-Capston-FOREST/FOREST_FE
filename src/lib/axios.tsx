import axios from "axios";

const instance = axios.create({
  baseURL: "http://3.37.88.112:3001/api",
  withCredentials: true, // 필요 시
});

export default instance;