import { useState, useCallback, useEffect } from 'react'
import type { Post, Comment, CommunityUser, PostFormData, AvatarChatMessage } from './types'
import { ragEngine } from '../../lib/ragEngine'
import { getSupabaseClient } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

// 从localStorage获取当前用户的AI分身信息
const getSavedAvatarModel = () => {
  const saved = localStorage.getItem('ai_avatar')
  try {
    return saved ? JSON.parse(saved) : undefined
  } catch {
    return undefined
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
  const { user: authUser } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [currentUser, setCurrentUser] = useState<CommunityUser>(() => {
    const avatarModel = getSavedAvatarModel()
    return {
      id: authUser?.id || '',
      name: authUser?.username || '用户',
      avatar: avatarModel?.url || authUser?.avatar || '',
      avatarModel,
      bio: authUser?.bio,
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  
  // AI分身对话状态
  const [avatarMessages, setAvatarMessages] = useState<AvatarChatMessage[]>([getInitialWelcomeMessage()])
  const [isAvatarTyping, setIsAvatarTyping] = useState(false)

  useEffect(() => {
    const avatarModel = getSavedAvatarModel()
    setCurrentUser({
      id: authUser?.id || '',
      name: authUser?.username || '用户',
      avatar: avatarModel?.url || authUser?.avatar || '',
      avatarModel,
      bio: authUser?.bio,
    })
  }, [authUser?.id, authUser?.username, authUser?.avatar, authUser?.bio])

  // 加载帖子列表
  const loadPosts = useCallback(async (reset = false, currentPageNum = page) => {
    setIsLoading(true)
    const supabase = getSupabaseClient()
    const pageToUse = reset ? 1 : currentPageNum
    const from = (pageToUse - 1) * 10
    const to = from + 9
    const { data: rows } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)
    let mapped: Post[] = []
    if (rows && rows.length > 0) {
      const authorIds = Array.from(new Set(rows.map(r => r.author_id)))
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, avatar_url')
        .in('user_id', authorIds)
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]))
      mapped = rows.map(r => {
        const p = profileMap.get(r.author_id)
        const author: CommunityUser = {
          id: r.author_id,
          name: p?.username || '用户',
          avatar: p?.avatar_url || '',
        }
        return {
          id: r.id,
          author,
          content: r.content,
          attachments: r.attachments || [],
          timestamp: new Date(r.created_at).getTime(),
          likes: r.likes || 0,
          comments: r.comments_count || 0,
          shares: r.shares || 0,
        }
      })
    }
    if (reset) {
      setPosts(mapped)
      setPage(2)
    } else {
      setPosts(prev => [...prev, ...mapped])
      setPage(prev => prev + 1)
    }
    setHasMore((rows?.length || 0) === 10)
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
    const supabase = getSupabaseClient()
    const attachments = data.attachments || []
    const authorAvatar = data.useAIAvatar && currentUser.avatarModel ? currentUser.avatarModel.url : currentUser.avatar
    const insertRes = await supabase.from('posts').insert({
      author_id: currentUser.id,
      content: data.content,
      attachments,
    }).select('*').single()
    if (insertRes.data) {
      const newPost: Post = {
        id: insertRes.data.id,
        author: { ...currentUser, avatar: authorAvatar },
        content: insertRes.data.content,
        attachments,
        timestamp: new Date(insertRes.data.created_at).getTime(),
        likes: 0,
        comments: 0,
        shares: 0,
      }
      setPosts(prev => [newPost, ...prev])
    }
  }, [currentUser])

  // 点赞/取消点赞帖子
  const toggleLikePost = useCallback(async (postId: string) => {
    const target = posts.find(p => p.id === postId)
    if (!target) return
    const nextLiked = !target.isLiked
    const nextLikes = nextLiked ? target.likes + 1 : Math.max(0, target.likes - 1)
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: nextLiked, likes: nextLikes } : p))
    const supabase = getSupabaseClient()
    await supabase.from('posts').update({ likes: nextLikes }).eq('id', postId)
  }, [posts])

  // 分享帖子
  const sharePost = useCallback(async (postId: string) => {
    const target = posts.find(p => p.id === postId)
    if (!target) return
    const nextShared = !target.isShared
    const nextShares = nextShared ? target.shares + 1 : Math.max(0, target.shares - 1)
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isShared: nextShared, shares: nextShares } : p))
    const supabase = getSupabaseClient()
    await supabase.from('posts').update({ shares: nextShares }).eq('id', postId)
  }, [posts])

  // 加载评论
  const loadComments = useCallback(async (postId: string) => {
    if (comments[postId]) return
    const supabase = getSupabaseClient()
    const { data: rows } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    let mapped: Comment[] = []
    if (rows && rows.length > 0) {
      const authorIds = Array.from(new Set(rows.map(r => r.author_id)))
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, avatar_url')
        .in('user_id', authorIds)
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]))
      mapped = rows.map(r => {
        const p = profileMap.get(r.author_id)
        const author: CommunityUser = {
          id: r.author_id,
          name: p?.username || '用户',
          avatar: p?.avatar_url || '',
        }
        return {
          id: r.id,
          postId: r.post_id,
          author,
          content: r.content,
          timestamp: new Date(r.created_at).getTime(),
          likes: r.likes || 0,
          parentId: r.parent_id || undefined,
        }
      })
    }
    setComments(prev => ({ ...prev, [postId]: mapped }))
  }, [comments])

  // 添加评论
  const addComment = useCallback(async (postId: string, content: string, parentId?: string) => {
    const supabase = getSupabaseClient()
    const insertRes = await supabase.from('comments').insert({
      post_id: postId,
      author_id: currentUser.id,
      content,
      parent_id: parentId || null,
    }).select('*').single()
    if (insertRes.data) {
      const newComment: Comment = {
        id: insertRes.data.id,
        postId,
        author: currentUser,
        content: insertRes.data.content,
        timestamp: new Date(insertRes.data.created_at).getTime(),
        likes: 0,
        parentId,
      }
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }))
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const nextCount = (post.comments || 0) + 1
          return { ...post, comments: nextCount }
        }
        return post
      }))
      await supabase.from('posts').update({ comments_count: (target => (target?.comments || 0) + 1)(posts.find(p => p.id === postId)) }).eq('id', postId)
      return newComment
    }
  }, [currentUser, posts])

  // 点赞评论
  const toggleLikeComment = useCallback(async (commentId: string, postId: string) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId]?.map(comment => {
        if (comment.id === commentId) {
          const nextLiked = !comment.isLiked
          const nextLikes = nextLiked ? comment.likes + 1 : Math.max(0, comment.likes - 1)
          return { ...comment, isLiked: nextLiked, likes: nextLikes }
        }
        return comment
      }) || [],
    }))
    const supabase = getSupabaseClient()
    const target = comments[postId]?.find(c => c.id === commentId)
    if (target) {
      await supabase.from('comments').update({ likes: target.likes }).eq('id', commentId)
    }
  }, [comments])

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
    const avatarModel = getSavedAvatarModel()
    setCurrentUser(prev => ({
      ...prev,
      avatar: avatarModel?.url || prev.avatar,
      avatarModel,
    }))
  }, [])

  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase
      .channel('community-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        payload => {
          const r: any = payload.new
          const p: Post = {
            id: r.id,
            author: currentUser,
            content: r.content,
            attachments: r.attachments || [],
            timestamp: new Date(r.created_at).getTime(),
            likes: r.likes || 0,
            comments: r.comments_count || 0,
            shares: r.shares || 0,
          }
          setPosts(prev => [p, ...prev])
        }
      )
    channel.subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser])

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
