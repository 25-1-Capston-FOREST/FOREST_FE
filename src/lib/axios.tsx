import axios from "axios";

const instance = axios.create({
  baseURL: "http://13.124.10.41:3001",
  withCredentials: true, // 필요 시
});

export default instance;