"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { postChatMessage, saveChatMessage } from "@/lib/api/chatbot"
import { useRouter } from "next/router"

type Role = "user" | "bot"
type Message = { role: Role; text: string }

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const QUESTION_ID = "1"

  const handleEndChat = async () => {
    try {
      const data = await saveChatMessage()
      if (data.status === "success") {
        alert("대화가 성공적으로 저장되었습니다.")
        router.push("/main")
      } else {
        alert("저장 실패: " + data.message)
      }
    } catch (error: any) {
      console.error("대화 저장 에러:", error)
      alert("대화 저장 중 에러가 발생했습니다.")
    }
  }
  // 메시지 전송
  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", text: input }
    const loadingMessage: Message = { role: "bot", text: "..." }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setInput("")

    try {
      const data = await postChatMessage(QUESTION_ID, input)

      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.text !== "...")
        return [...withoutLoading, { role: "bot", text: data.reply }]
      })
    } catch (error: any) {
      console.error("메시지 전송 에러:", error)
      console.error("서버 응답:", error.response?.data)
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.text !== "...")
        return [...withoutLoading, { role: "bot", text: "에러가 발생했습니다. 다시 시도해주세요." }]
      })
    }
  }


  //  자동 스크롤
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  return (
    <div className="mt-[-30px] flex flex-col items-center bg-white px-4 pt-10">
      {/* 메시지 영역 */}
      <div
        ref={containerRef}
        className="flex flex-col justify-end w-full max-w-[527px] space-y-2 overflow-y-auto px-4 pt-4 pb-[150px]"
        style={{
          minHeight: 150,
          maxHeight: "calc(100vh - 160px)",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm w-fit max-w-[80%] px-3 py-2 rounded-[17px] ${msg.role === "user" ? "bg-[#EBEBEB] self-end" : "self-start"
              }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* 입력창 + 전송버튼 + 대화종료 버튼 컨테이너 */}
      {/* 입력 영역 전체 감싸는 컨테이너 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 w-[527px]">

        {/* 입력창 + 전송 버튼 (border 박스) */}
        <div className="flex flex-1 h-[38px] rounded-[10px] border items-center bg-white shadow-md px-2">
          <input
            className="flex-1 px-2 outline-none text-[14px]"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="메시지를 입력하세요"
          />
          <button onClick={handleSend} className="px-2">
            <Image
              src="/images/icon_arrow.svg"
              alt="화살표"
              width={30}
              height={30}
              className="transform -rotate-90"
            />
          </button>
        </div>

        {/* 대화 종료 버튼 */}
        <button
          onClick={handleEndChat}
          className="bg-[#FFA6A6] text-white rounded-[10px] px-4 h-[38px] text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          대화 종료
        </button>
      </div>

    </div>
  )
}
