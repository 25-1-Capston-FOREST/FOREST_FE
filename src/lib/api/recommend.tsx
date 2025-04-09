import instance from "@/lib/axios";

export const getRecommendation = async () => {
  const response = await instance.get("/api/recommendation");
  console.log("API 응답 데이터:", response.data)
  return response.data.recommendations;
};