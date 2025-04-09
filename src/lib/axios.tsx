// lib/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "https://capston-forest.duckdns.org",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",  // 이게 꼭 있어야 해!
  },
});

export default instance;