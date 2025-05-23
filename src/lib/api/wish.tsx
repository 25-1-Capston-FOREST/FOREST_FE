import instance from "@/lib/axios";

// 찜 목록 조회
export const getWishlist = async () => {
  const response = await instance.get("/api/user/wishlist");
  return response.data;
};

// 찜하기
export const postWish = async (activityId: string) => {
  const response = await instance.post(`/api/wish?id=${activityId}`);
  return response.data;
};


//찜삭제
export const deleteWish = async (wishId: string) => {
  const response = await instance.delete("/api/wish", {
    params: {
      id: wishId, 
    },
  });
  return response.data;
};