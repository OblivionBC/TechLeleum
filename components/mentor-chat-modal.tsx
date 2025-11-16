'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { RealtimeChat } from './realtime-chat'
import { useMessagesQuery } from '@/hooks/use-messages-query'
import { createClient } from '@/lib/supabase/client'

interface MentorChatModalProps {
  isOpen: boolean
  onClose: () => void
  mentorId: string
  mentorName: string
}

export function MentorChatModal({
  isOpen,
  onClose,
  mentorId,
  mentorName,
}: MentorChatModalProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string>('')
  const [roomName, setRoomName] = useState<string>('')

  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setCurrentUserId(user.id)

        // Get user's display name from youth or mentor table
        const { data: youthData } = await supabase
          .from('youth')
          .select('display_name')
          .eq('id', user.id)
          .single()

        const { data: mentorData } = await supabase
          .from('mentors')
          .select('display_name')
          .eq('id', user.id)
          .single()

        const displayName =
          youthData?.display_name ||
          mentorData?.display_name ||
          user.user_metadata?.display_name ||
          user.email?.split('@')[0] ||
          'User'

        setCurrentUserName(displayName)

        // Create room name: always use the smaller ID first for consistency
        const roomId = user.id < mentorId ? `${user.id}-${mentorId}` : `${mentorId}-${user.id}`
        setRoomName(`chat-${roomId}`)
      }
    }

    if (isOpen) {
      getCurrentUser()
    }
  }, [isOpen, mentorId])

  const { data: messages, isLoading } = useMessagesQuery(roomName)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-stone-200">
          <div>
            <h2 className="text-xl font-semibold text-amber-900">Chat with {mentorName}</h2>
            <p className="text-sm text-stone-500">Messages are sent in real-time</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          {isLoading || !roomName ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-stone-500">Loading chat...</p>
            </div>
          ) : (
            <RealtimeChat
              roomName={roomName}
              username={currentUserName}
              messages={messages}
            />
          )}
        </div>
      </div>
    </div>
  )
}

