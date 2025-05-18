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

// 챗봇 마지막 메시지 저장 API (종료 이유 포함)
export const saveChatMessage = async (
  questionId: string,
  message: string,
  endReason: string
) => {
  const response = await instance.post("/api/chatbot/save", {
    question_id: questionId,
    message: message,
    end_reason: endReason,
  })

  // 응답 형식: { status: "success", message: "마지막 응답 저장 성공 (mock)" }
  return response.data
}
