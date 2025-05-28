import instance from "@/lib/axios";

export const getSearch = async (keyword: string) => {
  const response = await instance.get("/api/research", {
    params: { keyword: keyword },
  });
  return response.data;
};