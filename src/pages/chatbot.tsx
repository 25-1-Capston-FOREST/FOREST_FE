"use client"
import Image from "next/image"
import { useEffect, useState } from "react"

// 타입 정의
type Role = "user" | "bot"
type Message = { role: Role; text: string }

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  // 테스트용 더미 메시지 로딩


  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", text: input }
    const loadingMessage: Message = { role: "bot", text: "..." }

    // 사용자 메시지 추가 + 챗봇 로딩 메시지 추가
    setMessages(prev => [loadingMessage, userMessage, ...prev])
    setInput("")

    // 1초 후 챗봇 응답으로 교체
    setTimeout(() => {
      const botResponse: Message = {
        role: "bot",
        text: `"${input}"에 대한 응답입니다.`,
      }

      setMessages(prev => {
        // prev[0] = loadingMessage, prev[1] = userMessage
        const remaining = prev.slice(2)
        return [botResponse, userMessage, ...remaining]
      })
    }, 1000)
  }

  return (
    <div className="w-full justify-center flex flex-row">
      <div className="flex flex-col">
        <div className="w-[527px] h-[408px] mt-[30px] overflow-y-auto flex flex-col-reverse p-2 space-y-2 space-y-reverse">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`w-fit max-w-[80%] px-3 py-1 rounded-xl ${msg.role === "user" ? "bg-[#EBEBEB] self-end" : "self-start"
                }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="w-[527px] h-[38px] rounded-[10px] border flex items-center">
          <input
            className="flex-1 px-2 outline-none"
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
              src="images/icon_arrow.svg"
              alt="화살표"
              width={30}
              height={30}
              className="transform -rotate-90"
            />
          </button>
        </div>

      </div>
    </div>
  )
}