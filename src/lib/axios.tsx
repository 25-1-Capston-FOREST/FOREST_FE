// lib/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "https://capston-forest.duckdns.org",
  headers: {
    "Content-Type": "application/json",  // 이게 꼭 있어야 해!
    withCredentials: true,
  },
});

export default instance;