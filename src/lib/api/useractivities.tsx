import instance from "@/lib/axios";

// 예약된 여가 조회
export const getPlannedlist = async () => {
  try {
    const response = await instance.get("/api/user/activities", {
      params: { status: 0 }, // 0: 예약된 여가
    });
    return response.data;
  } catch (error) {
    console.error("예약된 여가 목록 불러오기 실패:", error);
    throw error;
  }
};

//완료된 여가 조회
export const getCompletedlist = async () => {
  try {
    const response = await instance.get("/api/user/activities", {
      params: { status: 1 }, 
    });
    return response.data;
  } catch (error) {
    console.error("완료된 여가 목록 불러오기 실패:", error);
    throw error;
  }
};