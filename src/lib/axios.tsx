import axios from "axios";

const instance = axios.create({
  baseURL: "https://capston-forest.duckdns.org",
  withCredentials: true, // 필요 시
  headers: {
    "Content-Type": "application/json", // 이거 꼭 있어야 해!
  },
});

export default instance;