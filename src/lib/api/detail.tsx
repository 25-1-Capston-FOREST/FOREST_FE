import instance from "@/lib/axios";

export const getDetail = async (activityId: string) => {
  const response = await instance.get("/api/detail", {
    params: { id: activityId },
  });
  return response.data;
};