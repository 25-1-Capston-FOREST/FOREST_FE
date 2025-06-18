import instance from "@/lib/axios";

export const getSearch = async (keyword: string) => {
  const response = await instance.get("/api/search", {
    params: { keyword: keyword },
  });
  return response.data;
};