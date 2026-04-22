import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Trash2, Calendar, Clock, ChevronRight } from 'lucide-react'
import type { Message } from './types'

export interface ChatSession {
  id: string
  title: string
  timestamp: number
  messages: Message[]
  characterName: string
}

interface HistoryDialogProps {
  isOpen: boolean
  onClose: () => void
  sessions: ChatSession[]
  onSelectSession: (session: ChatSession) => void
  onDeleteSession: (id: string) => void
}

export const HistoryDialog: React.FC<HistoryDialogProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-8 md:pb-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Dialog Container - 浅色风格 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl overflow-hidden flex flex-col max-h-[80vh] shadow-[0_-10px_50px_rgba(0,0,0,0.1)] mb-4 sm:mb-0"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">历史对话</h3>
                  <p className="text-xs text-gray-500 font-medium">{sessions.length} 条记录</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-white">
              {sessions.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mb-4">
                    <MessageSquare size={48} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-gray-400 font-medium">暂无历史对话记录</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {sessions.sort((a, b) => b.timestamp - a.timestamp).map((session) => (
                    <div key={session.id} className="relative group overflow-hidden rounded-2xl">
                        {/* Swipe Background (Delete Action) */}
                        <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6">
                            <span className="text-white font-bold flex items-center gap-2">
                                <Trash2 size={18} />
                                删除
                            </span>
                        </div>

                        {/* Swipeable Foreground Card */}
                        <motion.div
                            drag="x"
                            dragDirectionLock
                            dragConstraints={{ left: -100, right: 0 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -60) {
                                  onDeleteSession(session.id)
                                }
                            }}
                            className="relative z-10 bg-white border border-gray-100 p-4 transition-shadow hover:shadow-md cursor-pointer active:scale-[0.99]"
                            onClick={() => onSelectSession(session)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                                    <MessageSquare size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-800 truncate mb-1">
                                        {session.title || '开启新对话'}
                                    </h4>
                                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatDate(session.timestamp)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {formatTime(session.timestamp)}
                                        </span>
                                        <span className="bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 text-indigo-600">
                                            {session.messages.length} 轮对话
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-300" />
                            </div>
                        </motion.div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="h-10 sm:hidden bg-white" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
