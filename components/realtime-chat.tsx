'use client'

import { useState, useEffect, useRef } from 'react'
import { useRealtimeChat } from '@/hooks/use-realtime-chat'
import { ChatMessageItem } from './chat-message-item'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Send } from 'lucide-react'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

interface RealtimeChatProps {
  roomName: string
  username: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

export function RealtimeChat({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) {
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage } = useRealtimeChat({
    roomName,
    onMessage,
    initialMessages,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(inputValue, username)
      setInputValue('')
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ maxHeight: '500px' }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-stone-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.user.name === username
            const showHeader =
              index === 0 || messages[index - 1].user.name !== message.user.name

            return (
              <ChatMessageItem
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                showHeader={showHeader}
              />
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-stone-200 p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
