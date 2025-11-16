'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ChatMessage } from './use-realtime-chat'

export function useMessagesQuery(roomName: string) {
  const [data, setData] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!roomName) {
      setIsLoading(false)
      return
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data: messages, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .eq('room_name', roomName)
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError

        const formattedMessages: ChatMessage[] =
          messages?.map((msg) => ({
            id: msg.id,
            content: msg.content,
            user: {
              name: msg.user_name,
            },
            createdAt: msg.created_at,
          })) || []

        setData(formattedMessages)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch messages'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [roomName])

  return { data, isLoading, error }
}

