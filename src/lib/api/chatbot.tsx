import instance from "@/lib/axios"

// 챗봇 메시지 전송 API
export const postChatMessage = async (questionId: string, message: string) => {
  const response = await instance.post("/api/chatbot/answer", {
    question_id: questionId,
    message: message,
  })
  // 응답 형식: { status: "success", reply: "..." }
  return response.data
}

export const saveChatMessage = async () => {
  const response = await instance.post("/api/chatbot/save")
  console.log("~~", response.data)
  return response.data
}

