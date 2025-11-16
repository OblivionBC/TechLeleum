'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface ChatMessage {
  id: string
  content: string
  user: {
    name: string
  }
  createdAt: string
}

interface UseRealtimeChatOptions {
  roomName: string
  onMessage?: (messages: ChatMessage[]) => void
  initialMessages?: ChatMessage[]
}

export function useRealtimeChat({
  roomName,
  onMessage,
  initialMessages = [],
}: UseRealtimeChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!roomName) return

    const supabase = createClient()
    const realtimeChannel = supabase
      .channel(`chat:${roomName}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_name=eq.${roomName}`,
        },
        (payload) => {
          const newMessage: ChatMessage = {
            id: payload.new.id,
            content: payload.new.content,
            user: {
              name: payload.new.user_name,
            },
            createdAt: payload.new.created_at,
          }
          setMessages((prev) => {
            const updated = [...prev, newMessage]
            onMessage?.(updated)
            return updated
          })
        }
      )
      .subscribe()

    setChannel(realtimeChannel)

    return () => {
      supabase.removeChannel(realtimeChannel)
    }
  }, [roomName, onMessage])

  const sendMessage = useCallback(
    async (content: string, username: string) => {
      if (!content.trim() || !roomName) return

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase.from('messages').insert({
        room_name: roomName,
        content: content.trim(),
        user_id: user.id,
        user_name: username,
      })

      if (error) {
        console.error('Error sending message:', error)
        throw error
      }
    },
    [roomName]
  )

  return { messages, sendMessage }
}

