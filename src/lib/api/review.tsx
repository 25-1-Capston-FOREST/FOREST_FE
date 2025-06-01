import instance from "@/lib/axios";

export const postReview = async (userActivityId: number, rate: number, content: string) => {
  try {
    const response = await instance.post(`/api/review`,
      {
        rate,
        content,
      },
      {
        params: {
          id: userActivityId,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("리뷰 작성 중 오류 발생:", error);
    throw error;
  }
};

//사용자 리뷰 조회
export const getUsertReview = async () => {
  const response = await instance.get("/api/user/reviews");
  return response.data;
};


//특정 여가 리뷰 조회
export const getActivityReview = async(activityId: string) => {
  const response = await instance.get("/api/detail/reviews", {
    params: { id: activityId },
  });
  return response.data;
};