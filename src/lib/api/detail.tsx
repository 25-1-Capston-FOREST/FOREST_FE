import instance from "@/lib/axios";

export const getDetail = async (activityId: number) => {
  const response = await instance.get("/api/detail", {
    params: { activity_id: activityId },
  });
  return response.data;
};