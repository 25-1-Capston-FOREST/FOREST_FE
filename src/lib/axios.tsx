import axios from "axios";

const instance = axios.create({
  baseURL: "https://capston-forest.duckdns.org",
  withCredentials: true, // 필요 시
});

export default instance;