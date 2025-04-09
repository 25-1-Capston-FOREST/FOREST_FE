import instance from "@/lib/axios";

export const postBooking = async (activityId: number, activityDate: string) => {
  const response = await instance.post(`/api/book?id=${activityId}`, {
    activityDate: activityDate,
  });
  return response.data;
};

export const getBookedActivities = async () => {
  const response = await instance.get("/api/user/activities?status=0");
  return response.data;
};