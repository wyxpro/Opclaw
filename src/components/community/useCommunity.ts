import { useState, useCallback } from 'react'
import type { Post, Comment, CommunityUser, PostFormData, AvatarChatMessage } from './types'
import { mockPosts, mockComments, mockCurrentUser } from '../../data/mock'
import { ragEngine } from '../../lib/ragEngine'

// 从localStorage获取当前用户的AI分身信息
const getCurrentUserWithAvatar = (): CommunityUser => {
  const savedAvatar = localStorage.getItem('ai_avatar')
  
  let avatarModel = undefined
  if (savedAvatar) {
    try {
      avatarModel = JSON.parse(savedAvatar)
    } catch {
      // 解析失败使用默认
    }
  }
  
  return {
    ...mockCurrentUser,
    avatarModel,
    avatar: avatarModel?.url || mockCurrentUser.avatar,
    name: localStorage.getItem('user_name') || mockCurrentUser.name,
  }
}

// 初始欢迎消息
const getInitialWelcomeMessage = (): AvatarChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: '你好！我是你的AI分身🌟\n\n在社区中，我可以：\n• 帮你回复其他用户的评论\n• 参与话题讨论\n• 分享你的观点和想法\n\n有什么想聊的吗？',
  timestamp: 1700000000000,
})

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [currentUser, setCurrentUser] = useState<CommunityUser>(() => getCurrentUserWithAvatar())
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  
  // AI分身对话状态
  const [avatarMessages, setAvatarMessages] = useState<AvatarChatMessage[]>([getInitialWelcomeMessage()])
  const [isAvatarTyping, setIsAvatarTyping] = useState(false)

  // 加载帖子列表
  const loadPosts = useCallback(async (reset = false, currentPageNum = page) => {
    setIsLoading(true)
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const pageToUse = reset ? 1 : currentPageNum
    const start = (pageToUse - 1) * 10
    const end = start + 10
    const newPosts = mockPosts.slice(start, end)
    
    if (reset) {
      setPosts(newPosts)
      setPage(2)
    } else {
      setPosts(prev => [...prev, ...newPosts])
      setPage(prev => prev + 1)
    }
    
    setHasMore(end < mockPosts.length)
    setIsLoading(false)
  }, [page])

  // 加载更多帖子
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadPosts()
    }
  }, [isLoading, hasMore, loadPosts])

  // 发布新帖子
  const createPost = useCallback(async (data: PostFormData): Promise<void> => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        ...currentUser,
        avatar: data.useAIAvatar && currentUser.avatarModel 
          ? currentUser.avatarModel.url 
          : currentUser.avatar,
      },
      content: data.content,
      attachments: data.attachments,
      timestamp: Date.now(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
    }
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setPosts(prev => [newPost, ...prev])
  }, [currentUser])

  // 点赞/取消点赞帖子
  const toggleLikePost = useCallback(async (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked,
        }
      }
      return post
    }))
  }, [])

  // 分享帖子
  const sharePost = useCallback(async (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          shares: post.isShared ? post.shares - 1 : post.shares + 1,
          isShared: !post.isShared,
        }
      }
      return post
    }))
  }, [])

  // 加载评论
  const loadComments = useCallback(async (postId: string) => {
    if (comments[postId]) return // 已加载过
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const postComments = mockComments.filter((comment: Comment) => comment.postId === postId)
    setComments(prev => ({ ...prev, [postId]: postComments }))
  }, [comments])

  // 添加评论
  const addComment = useCallback(async (postId: string, content: string, parentId?: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      author: currentUser,
      content,
      timestamp: Date.now(),
      likes: 0,
      parentId,
    }
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 400))
    
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }))
    
    // 更新帖子评论数
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: post.comments + 1 }
      }
      return post
    }))
    
    return newComment
  }, [currentUser])

  // 点赞评论
  const toggleLikeComment = useCallback(async (commentId: string, postId: string) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId]?.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          }
        }
        return comment
      }) || [],
    }))
  }, [])

  // 与AI分身对话
  const sendMessageToAvatar = useCallback(async (content: string) => {
    const userMessage: AvatarChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    
    setAvatarMessages(prev => [...prev, userMessage])
    setIsAvatarTyping(true)
    
    // 使用RAG引擎生成回复
    setTimeout(() => {
      const ragResponse = ragEngine.generateResponse(content)
      const responseMessage: AvatarChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: ragResponse,
        timestamp: Date.now(),
        avatarUrl: currentUser.avatarModel?.url,
      }
      
      setAvatarMessages(prev => [...prev, responseMessage])
      setIsAvatarTyping(false)
      
      // 如果有克隆的声音，自动播放语音
      const savedVoice = localStorage.getItem('ai_voice')
      if (savedVoice && 'speechSynthesis' in window) {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(ragResponse)
          utterance.lang = 'zh-CN'
          utterance.rate = 1.0
          utterance.pitch = 1.0
          speechSynthesis.speak(utterance)
        }, 500)
      }
    }, 1500)
  }, [currentUser])

  // 刷新当前用户信息（当AI分身更新时）
  const refreshCurrentUser = useCallback(() => {
    setCurrentUser(getCurrentUserWithAvatar())
  }, [])

  return {
    posts,
    comments,
    currentUser,
    isLoading,
    hasMore,
    avatarMessages,
    isAvatarTyping,
    loadPosts,
    loadMore,
    createPost,
    toggleLikePost,
    sharePost,
    loadComments,
    addComment,
    toggleLikeComment,
    sendMessageToAvatar,
    refreshCurrentUser,
  }
}
