"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { postChatMessage } from "@/lib/api/chatbot"

type Role = "user" | "bot"
type Message = { role: Role; text: string }

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)


  // 로컬용
  // const handleSend = () => {
  //   if (!input.trim()) return

  //   const userMessage: Message = { role: "user", text: input }
  //   const loadingMessage: Message = { role: "bot", text: "..." }

  //   setMessages(prev => [...prev, userMessage, loadingMessage])
  //   setInput("")

  //   setTimeout(() => {
  //     setMessages(prev => {
  //       const withoutLoading = prev.slice(0, -1)
  //       return [...withoutLoading, { role: "bot", text: `"${input}"에 대한 응답입니다.` }]
  //     })
  //   }, 1000)
  // }


  // 배포용
  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", text: input }
    const loadingMessage: Message = { role: "bot", text: "..." }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setInput("")

    try {
      const data = await postChatMessage("1", "1", input)

      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1)
        return [...withoutLoading, { role: "bot", text: data.reply }]
      })
    } catch (error) {
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1)
        return [...withoutLoading, { role: "bot", text: "에러가 발생했습니다. 다시 시도해주세요." }]
      })
    }
  }


  useEffect(() => {
    const container = containerRef.current
    if (container) {
      // 메시지 추가될 때마다 스크롤을 맨 아래로 내림
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col items-center bg-white px-4 pt-10">
      {/* 메시지 영역 */}
      <div
        ref={containerRef}
        className="w-full max-w-[527px] flex flex-col space-y-2 overflow-y-auto px-4 pt-4"
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

      {/* 입력창 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[527px] h-[38px] rounded-[10px] border flex items-center bg-white z-10 shadow-md px-2">
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
    </div>
  )
}
