import instance from "@/lib/axios";

export const postBooking = async (activityId: number, activityDate: string) => {
  const response = await instance.post(`/api/book?id=${activityId}`, {
    activityDate: activityDate,
  });
  return response.data;
};