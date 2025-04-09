import instance from "@/lib/axios";

export const getRecommendation = async () => {
  const response = await instance.get("/api/recommendation");
  return response.data.recommendations;
};