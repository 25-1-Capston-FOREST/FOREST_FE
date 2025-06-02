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
  const HEADER_HEIGHT = 150 // 최대 높이에 맞춤

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
      setMessages(prev => {
        const withoutLoading = prev.filter(m => m.text !== "...")
        return [...withoutLoading, { role: "bot", text: "에러가 발생했습니다. 다시 시도해주세요." }]
      })
    }
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (messages.length > 1) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
  }, [messages]);

  return (
    <div className="mb-[50px] pt-[10px] pb-[90px] px-4 bg-white min-h-[calc(100vh-300px)] flex flex-col items-center">
      {/* 메시지 영역 */}
      <div
        ref={containerRef}
        className="w-full max-w-[527px] flex flex-col space-y-2"
        style={{
          maxHeight: `calc(100vh - 300}px)`,
          paddingTop: "10px",
          paddingBottom: "100px"
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm w-fit max-w-[80%] px-3 py-2 rounded-[17px] ${msg.role === "user" ? "bg-[#EBEBEB] self-end" : "self-start"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="fixed bottom-3 flex left-1/2 -translate-x-1/2 z-10 w-full max-w-[550px] flex items-center space-x-2 px-4 bg-[#FFFFFF] h-[40px] pb-[80px]">
        <div className="flex flex-1 flex-row h-[40px] rounded-[10px] border items-center bg-white shadow-md px-2">
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
              width={26}
              height={26}
              className="transform -rotate-90"
            />
          </button>
        </div>
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
