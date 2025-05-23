import instance from "@/lib/axios"

export const postChatMessage = async (userId: string, questionId: string, message: string) => {
  const response = await instance.post("/api/chatbot/answer", {
    user_id: userId,
    question_id: questionId,
    message: message,
  })

  return response.data // { status: "success", reply: "..." }
}