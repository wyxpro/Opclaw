import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Download, Check, Share2, Mic, Bot, Sparkles, Zap, User } from 'lucide-react'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
import { useTheme } from '../../hooks/useTheme'
import type { VoiceModel, AvatarModel, CharacterStyle } from './types'

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  voiceModel: VoiceModel | null
  avatarModel: AvatarModel | null
  characterStyle: CharacterStyle
  background: string
  customAvatar: any
}

// Default user data as fallback
const DEFAULT_PROFILE = {
  name: '晓叶',
  title: '全栈开发工程师 & AI 研究员',
  bio: '热爱技术与设计的全栈开发者，专注于人工智能、Web 开发和用户体验设计。',
  avatar: '/vibe_images/avatar_1771416390.png'
}

const DEFAULT_SKILLS = [
  { name: 'AI 对话交互 / Prompt', level: 92, color: 'from-purple-500 to-indigo-500' },
  { name: '前端开发 / React / WebGL', level: 88, color: 'from-blue-500 to-cyan-500' },
  { name: '全栈工程 & API 部署', level: 85, color: 'from-emerald-500 to-teal-500' }
]

type TemplateType = 'minimal' | 'cyber' | 'artistic' | 'cartoon' | 'retro'

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  voiceModel,
  avatarModel,
  characterStyle,
  background,
  customAvatar
}) => {
  const { themeConfig } = useTheme()
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  // Template state
  const [currentTemplate, setCurrentTemplate] = useState<TemplateType>('cartoon')

  // User Profile and Skills data state
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [skills, setSkills] = useState(DEFAULT_SKILLS)

  // Load user data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('home_editor_data')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.profile) {
          setProfile({
            name: parsed.profile.name || DEFAULT_PROFILE.name,
            title: parsed.profile.title || DEFAULT_PROFILE.title,
            bio: parsed.profile.bio || DEFAULT_PROFILE.bio,
            avatar: parsed.profile.avatar || DEFAULT_PROFILE.avatar
          })
        }
        if (parsed.skillCategories && Array.isArray(parsed.skillCategories)) {
          const allSkills = parsed.skillCategories
            .flatMap((cat: any) => cat.skills || [])
            .sort((a: any, b: any) => (b.level || 0) - (a.level || 0))
            .slice(0, 3)
            .map((s: any, idx: number) => {
              const colors = [
                'from-purple-500 to-indigo-500',
                'from-blue-500 to-cyan-500',
                'from-emerald-500 to-teal-500'
              ]
              return {
                name: s.name,
                level: s.level || 80,
                color: colors[idx % colors.length]
              }
            })
          if (allSkills.length > 0) {
            setSkills(allSkills)
          }
        }
      }
    } catch (e) {
      console.error('Failed to load user profile for sharing:', e)
    }
  }, [isOpen])

  // Generate share link and QR code
  useEffect(() => {
    if (!isOpen) return

    const configToShare = {
      voiceModel,
      avatarModel,
      characterStyle,
      background,
      customAvatar,
      profile: {
        name: profile.name,
        avatar: profile.avatar,
        bio: profile.bio
      },
      skills: skills,
      template: currentTemplate
    }

    try {
      const jsonStr = JSON.stringify(configToShare)
      const base64 = btoa(unescape(encodeURIComponent(jsonStr)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

      const shareId = `data_${base64}`
      
      const shares = JSON.parse(localStorage.getItem('ai_character_shares') || '{}')
      shares[shareId] = configToShare
      localStorage.setItem('ai_character_shares', JSON.stringify(shares))

      const origin = window.location.origin
      const pathname = window.location.pathname
      const fullUrl = `${origin}${pathname}?shareId=${shareId}`
      setShareUrl(fullUrl)

      // Use local qrcode library to generate data URL (resolves CORS / networking issues during html2canvas export)
      QRCode.toDataURL(fullUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      .then(url => {
        setQrCodeUrl(url)
      })
      .catch(err => {
        console.error('Failed to generate local QR code:', err)
      })
    } catch (err) {
      console.error('Failed to generate share URL:', err)
    }
  }, [isOpen, voiceModel, avatarModel, characterStyle, background, customAvatar, profile, skills, currentTemplate])

  // Copy Link function
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Copy link failed:', e)
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Download Card as PNG Image
  const handleDownloadCard = async () => {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let exportBg = '#0f172a'
      if (currentTemplate === 'minimal') exportBg = '#ffffff'
      if (currentTemplate === 'artistic') exportBg = '#fef7f0'
      if (currentTemplate === 'cartoon') exportBg = '#f0f9ff'
      if (currentTemplate === 'retro') exportBg = '#f5f0e6'

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: exportBg,
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = imgData
      link.download = `AI-Digital-Human-${profile.name}-${currentTemplate}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.error('Failed to export sharing card:', e)
    } finally {
      setDownloading(false)
    }
  }

  const voiceName = voiceModel?.name || '系统默认声音'
  const avatarName = customAvatar?.name || avatarModel?.name || '系统默认形象'
  const avatarUrl = customAvatar?.url || avatarModel?.url || '/vibe_images/person/girl/girl.png'

  // Template Options
  const templates = [
    { id: 'minimal', name: '极简', icon: '◐', swatchBg: 'bg-white text-slate-800 border-slate-200' },
    { id: 'cyber', name: '赛博', icon: '◉', swatchBg: 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white' },
    { id: 'artistic', name: '艺术', icon: '❋', swatchBg: 'bg-gradient-to-br from-rose-400 to-[#f4a261] text-white' },
    { id: 'cartoon', name: '童趣', icon: '✿', swatchBg: 'bg-gradient-to-br from-pink-400 to-yellow-300 text-slate-800' },
    { id: 'retro', name: '复古', icon: '✤', swatchBg: 'bg-[#8b6914] text-[#f5f0e6]' }
  ]

  // Styles maps for card rendering
  const getCardStyles = () => {
    switch (currentTemplate) {
      case 'minimal':
        return {
          wrapper: 'relative w-full rounded-[20px] p-6 bg-white border border-slate-200 text-slate-800 overflow-hidden shadow-md flex flex-col gap-5 font-sans',
          badge: 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider border border-slate-200',
          portraitContainer: 'relative w-full aspect-[3/4.2] rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm flex flex-col select-none',
          portraitBadge: 'absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[8px] font-bold tracking-wider z-10',
          portraitCaption: 'AI Model v1.0',
          portraitCaptionClass: 'absolute bottom-0 inset-x-0 bg-slate-900/60 backdrop-blur-sm text-white text-[8px] py-1 text-center font-medium',
          avatar: 'w-10 h-10 rounded-full border border-slate-200 bg-slate-50 overflow-hidden shrink-0 shadow-sm',
          name: 'text-lg font-bold text-slate-900',
          title: 'text-xs text-blue-600 font-medium',
          bio: 'text-[11px] text-slate-500 leading-relaxed line-clamp-3 pr-1',
          divider: 'h-px bg-slate-100 w-full',
          sectionHeader: 'text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1',
          dnaBox: 'flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl',
          dnaValue: 'text-xs font-bold text-slate-700 truncate',
          skillText: 'text-[10px] font-medium text-slate-700 truncate pr-1',
          skillVal: 'font-bold text-blue-600',
          skillTrack: 'h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50',
          skillFill: 'h-full rounded-full bg-blue-600',
          qrContainer: 'w-20 h-20 bg-white p-1 rounded-xl shadow-sm border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden',
          footerTitle: 'text-[13px] font-bold text-slate-800',
          footerDesc: 'text-[10px] text-slate-550 leading-relaxed',
          iconColor: 'text-slate-500'
        }
      case 'artistic':
        return {
          wrapper: 'relative w-full rounded-[32px] p-6 bg-[#fef7f0] border border-[#f0e6dc] text-[#2d3436] overflow-hidden shadow-lg flex flex-col gap-5 font-serif',
          badge: 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffefe5] text-[#e85d75] text-[10px] font-bold tracking-wider border border-[#f0e6dc]',
          portraitContainer: 'relative w-full aspect-[3/4.2] rounded-[28px] border border-orange-105 bg-[#fff8f3] overflow-hidden shadow-md flex flex-col select-none',
          portraitBadge: 'absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-[#e85d75] text-[8px] font-bold z-10',
          portraitCaption: '✧ Aesthetic Model ✧',
          portraitCaptionClass: 'absolute bottom-0 inset-x-0 bg-[#fff8f3]/95 text-[#e85d75] text-[8px] py-1 text-center font-medium italic border-t border-[#f5ebe3]',
          avatar: 'w-10 h-10 rounded-[12px] border border-orange-200 bg-[#ffefe5] overflow-hidden shrink-0 shadow-sm',
          name: 'text-lg font-bold text-[#2d3436]',
          title: 'text-xs text-[#e85d75] font-serif italic',
          bio: 'text-[11px] text-[#636e72] leading-relaxed line-clamp-3 pr-1',
          divider: 'h-px bg-[#f0e6dc] w-full',
          sectionHeader: 'text-[10px] font-bold text-[#e85d75] uppercase tracking-wider flex items-center gap-1 italic',
          dnaBox: 'flex items-center gap-2 bg-[#fff8f3] border border-[#f5ebe3] px-3 py-1.5 rounded-[12px]',
          dnaValue: 'text-xs font-bold text-[#2d3436] truncate',
          skillText: 'text-[10px] font-medium text-[#636e72] truncate pr-1',
          skillVal: 'font-bold text-[#e85d75]',
          skillTrack: 'h-1.5 bg-[#ffefe5]/60 rounded-full overflow-hidden border border-[#f5ebe3]',
          skillFill: 'h-full rounded-full bg-gradient-to-r from-rose-400 to-[#f4a261]',
          qrContainer: 'w-20 h-20 bg-white p-1.5 rounded-[16px] shadow-sm border border-orange-100 shrink-0 flex items-center justify-center overflow-hidden',
          footerTitle: 'text-[13px] font-bold text-[#2d3436]',
          footerDesc: 'text-[10px] text-[#7f8c8d] leading-relaxed',
          iconColor: 'text-[#e85d75]'
        }
      case 'cartoon':
        return {
          wrapper: 'relative w-full rounded-[36px] p-6 bg-[#f0f9ff] border-4 border-slate-800 text-slate-800 overflow-hidden shadow-[6px_6px_0px_#1e293b] flex flex-col gap-5 font-sans',
          badge: 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold tracking-wider border-2 border-slate-800 shadow-[2px_2px_0px_#1e293b]',
          portraitContainer: 'relative w-full aspect-[3/4.2] rounded-[24px] border-4 border-slate-800 bg-yellow-100 overflow-hidden shadow-[3px_3px_0px_#1e293b] flex flex-col select-none',
          portraitBadge: 'absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-pink-500 text-white border-2 border-slate-800 text-[8px] font-extrabold z-10 uppercase',
          portraitCaption: '⚡ 3D CLONE ⚡',
          portraitCaptionClass: 'absolute bottom-0 inset-x-0 bg-slate-800 text-white text-[9px] py-1 text-center font-bold tracking-wide border-t-2 border-slate-800',
          avatar: 'w-10 h-10 rounded-[14px] border-2 border-slate-800 bg-yellow-105 overflow-hidden shrink-0 shadow-[1.5px_1.5px_0px_#1e293b]',
          name: 'text-lg font-extrabold text-slate-900',
          title: 'text-xs text-sky-600 font-bold',
          bio: 'text-[11px] text-slate-650 leading-relaxed line-clamp-3 pr-1 font-medium',
          divider: 'h-1 bg-slate-800 w-full',
          sectionHeader: 'text-[11px] font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1',
          dnaBox: 'flex items-center gap-2 bg-white border-2 border-slate-800 px-3 py-1.5 rounded-[16px] shadow-[1.5px_1.5px_0px_#1e293b]',
          dnaValue: 'text-xs font-bold text-slate-850 truncate',
          skillText: 'text-[10px] font-bold text-slate-700 truncate pr-1',
          skillVal: 'font-extrabold text-pink-500',
          skillTrack: 'h-2 bg-white rounded-full overflow-hidden border-2 border-slate-800',
          skillFill: 'h-full rounded-full bg-yellow-400',
          qrContainer: 'w-20 h-20 bg-white p-1 rounded-2xl border-4 border-slate-800 shadow-[4px_4px_0px_#1e293b] shrink-0 flex items-center justify-center overflow-hidden',
          footerTitle: 'text-[13px] font-extrabold text-slate-905',
          footerDesc: 'text-[10px] text-slate-550 leading-relaxed font-semibold',
          iconColor: 'text-pink-500'
        }
      case 'retro':
        return {
          wrapper: 'relative w-full rounded-none p-6 bg-[#f5f0e6] border-4 border-double border-[#8b6914] text-[#3d3830] overflow-hidden shadow-[5px_5px_0px_#8b6914] flex flex-col gap-5 font-serif',
          badge: 'flex items-center gap-1.5 px-3 py-0.5 rounded-none bg-[#ebe4d6] text-[#8b6914] text-[10px] font-bold tracking-wider border border-[#8b6914]',
          portraitContainer: 'relative w-full aspect-[3/4.2] rounded-none border-2 border-[#8b6914] p-1 bg-[#faf7f2] overflow-hidden shadow-[3px_3px_0px_#8b6914] flex flex-col select-none',
          portraitBadge: 'absolute top-3 left-3 px-2 py-0.5 rounded-none bg-[#faf7f2] text-[#8b6914] border border-[#8b6914] text-[8px] font-bold z-10',
          portraitCaption: 'Fig 1. Clone Avatar',
          portraitCaptionClass: 'absolute bottom-1 inset-x-1 bg-[#faf7f2] border-t border-[#8b6914] text-[#3d3830] text-[8px] py-0.5 text-center font-bold',
          avatar: 'w-10 h-10 rounded-none border border-[#8b6914] p-0.5 bg-white overflow-hidden shrink-0 shadow-sm',
          name: 'text-lg font-bold text-[#3d3830] tracking-wide',
          title: 'text-xs text-[#c75b39] font-bold uppercase tracking-wider',
          bio: 'text-[11px] text-[#5c5548] leading-relaxed line-clamp-3 pr-1',
          divider: 'h-0.5 border-t border-b border-[#8b6914] w-full',
          sectionHeader: 'text-[11px] font-bold text-[#8b6914] uppercase tracking-wider flex items-center gap-1 border-b border-[#8b6914] pb-0.5',
          dnaBox: 'flex items-center gap-2 bg-[#faf7f2] border border-[#d9d0c1] px-3 py-1.5 rounded-none',
          dnaValue: 'text-xs font-bold text-[#3d3830] truncate',
          skillText: 'text-[10px] font-bold text-[#5c5548] truncate pr-1',
          skillVal: 'font-bold text-[#c75b39]',
          skillTrack: 'h-1.5 bg-[#ebe4d6] rounded-none overflow-hidden border border-[#d9d0c1]',
          skillFill: 'h-full bg-[#8b6914]',
          qrContainer: 'w-20 h-20 bg-white p-1 rounded-none border-2 border-[#8b6914] shrink-0 flex items-center justify-center overflow-hidden',
          footerTitle: 'text-[13px] font-bold text-[#3d3830]',
          footerDesc: 'text-[10px] text-[#7a7263] leading-relaxed',
          iconColor: 'text-[#8b6914]'
        }
      case 'cyber':
      default:
        return {
          wrapper: 'relative w-full rounded-3xl p-6 bg-gradient-to-br from-slate-950 via-[#0f0a1e] to-slate-950 border border-purple-500/30 text-white overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col gap-6 font-mono',
          badge: 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-wider border border-indigo-500/30',
          portraitContainer: 'relative w-full aspect-[3/4.2] rounded-2xl border border-cyan-400/50 bg-[#0f0a1e]/50 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.3)] flex flex-col select-none',
          portraitBadge: 'absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[8px] font-bold tracking-wider z-10 animate-pulse',
          portraitCaption: '🔴 LIVE 3D MODEL',
          portraitCaptionClass: 'absolute bottom-0 inset-x-0 bg-black/60 border-t border-cyan-500/20 text-cyan-300 text-[8px] py-1 text-center font-bold tracking-widest',
          avatar: 'w-10 h-10 rounded-xl border border-cyan-400/40 bg-slate-800 overflow-hidden shrink-0 shadow-lg ring-2 ring-purple-500/20',
          name: 'text-lg font-bold text-white',
          title: 'text-xs text-cyan-400 font-medium',
          bio: 'text-[11px] text-white/50 leading-relaxed line-clamp-3 pr-1',
          divider: 'h-px bg-white/10 w-full',
          sectionHeader: 'text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1',
          dnaBox: 'flex items-center gap-2 bg-purple-950/20 border border-purple-950/40 px-3 py-1.5 rounded-xl',
          dnaValue: 'text-xs font-bold text-white/90 truncate',
          skillText: 'text-[10px] font-medium text-white/80 truncate pr-1',
          skillVal: 'font-bold text-indigo-300',
          skillTrack: 'h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5',
          skillFill: 'h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(0,212,255,0.4)]',
          qrContainer: 'w-20 h-20 bg-white p-1 rounded-xl shadow-lg border border-cyan-400/30 shrink-0 flex items-center justify-center overflow-hidden',
          footerTitle: 'text-[13px] font-bold text-white',
          footerDesc: 'text-[10px] text-white/45 leading-relaxed',
          iconColor: 'text-cyan-400'
        }
    }
  }

  const s = getCardStyles()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-md">
          {/* Modal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Content - Translucent Card Jelly Glass style */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white/10 border border-white/25 rounded-[32px] overflow-hidden flex flex-col shadow-[0_25px_50px_rgba(0,0,0,0.25),_inset_0_1.5px_2px_rgba(255,255,255,0.35)] backdrop-blur-3xl z-10 my-8"
          >
            {/* Glowing jelly glass backdrops inside the modal panel */}
            <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -right-20 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                  <Share2 size={16} />
                </div>
                <h3 className="text-base font-bold text-white">分享我的 AI 数字分身</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors border border-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Template Selector */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 relative z-10">
              <p className="text-xs text-white/70 mb-2.5 font-bold flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-300" />
                选择分享卡片样式模板：
              </p>
              <div className="grid grid-cols-5 gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setCurrentTemplate(tpl.id as TemplateType)}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-2xl border text-center transition-all ${
                      currentTemplate === tpl.id 
                        ? 'border-indigo-400 bg-indigo-500/25 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${tpl.swatchBg} flex items-center justify-center text-xs font-bold shadow-inner mb-1 border border-white/10 shrink-0`}>
                      {tpl.icon}
                    </div>
                    <span className="text-[10px] font-bold text-white/90">{tpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Container for Card Preview + Action Buttons */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(80vh-170px)] custom-scrollbar relative z-10">
              
              {/* --- The Sharing Card Canvas (#share-card-content) --- */}
              <div 
                ref={cardRef}
                id="share-card-content"
                className={s.wrapper}
                style={{ contentVisibility: 'auto' }}
              >
                {/* Background Textures / Glows based on templates */}
                {currentTemplate === 'cyber' && (
                  <>
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #a855f7 1px, transparent 1px), linear-gradient(to bottom, #00d4ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                  </>
                )}
                {currentTemplate === 'minimal' && (
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', backgroundSize: '16px 16px' }} />
                )}
                {currentTemplate === 'artistic' && (
                  <>
                    <div className="absolute -top-32 -left-32 w-72 h-72 bg-gradient-to-br from-pink-300/15 to-orange-300/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-br from-yellow-200/15 to-rose-300/15 rounded-full blur-3xl pointer-events-none" />
                  </>
                )}
                {currentTemplate === 'cartoon' && (
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fb7185 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
                )}
                {currentTemplate === 'retro' && (
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
                )}

                {/* Card Title Header */}
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className={s.badge}>
                      <Sparkles size={10} className="animate-pulse" />
                      MY DIGITAL CLONE · 数字人分身
                    </span>
                    <span className="text-[9px] text-inherit opacity-30 uppercase tracking-widest font-mono">OPCLAW LINK</span>
                  </div>
                </div>

                {/* Card Main Columns (Details on left, Digital Human Portrait on right) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 relative z-10">
                  
                  {/* Left Column: User details, DNA & Skill Matrix (7 cols on desktop) */}
                  <div className="sm:col-span-7 flex flex-col justify-between gap-4">
                    
                    {/* Basic Info with Avatar to the Left of Nickname */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-3 text-left">
                        {/* User Setting Avatar (Left) */}
                        <div className={s.avatar}>
                          <img 
                            src={profile.avatar} 
                            alt="User Profile Avatar" 
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://tse2.mm.bing.net/th/id/OIP.JXixrtqu6-SGuc8H2zyFogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
                            }}
                          />
                        </div>
                        {/* Name & Title */}
                        <div className="min-w-0 flex-1">
                          <h4 className={s.name}>{profile.name}</h4>
                          <p className={s.title}>{profile.title}</p>
                        </div>
                      </div>
                      <p className={`${s.bio} text-left`}>{profile.bio}</p>
                    </div>

                    {/* Character Clone DNA */}
                    <div className="space-y-2 text-left">
                      <h5 className={s.sectionHeader}>
                        <Bot size={11} className={s.iconColor} />
                        数字人克隆基因
                      </h5>
                      <div className="grid grid-cols-1 gap-2">
                        {/* Voice DNA */}
                        <div className={s.dnaBox}>
                          <Mic size={12} className={s.iconColor} />
                          <span className={s.dnaValue}>
                            <span className="opacity-50">声线: </span>{voiceName}
                          </span>
                        </div>
                        {/* Avatar DNA */}
                        <div className={s.dnaBox}>
                          <User size={12} className={s.iconColor} />
                          <span className={s.dnaValue}>
                            <span className="opacity-50">形象: </span>{avatarName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skill Matrix */}
                    <div className="space-y-2 text-left">
                      <h5 className={s.sectionHeader}>
                        <Zap size={11} className={s.iconColor} />
                        核心技能矩阵
                      </h5>
                      <div className="space-y-2">
                        {skills.map((skill, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-medium">
                              <span className={s.skillText}>{skill.name}</span>
                              <span className={s.skillVal}>{skill.level}%</span>
                            </div>
                            <div className={s.skillTrack}>
                              {currentTemplate === 'cartoon' ? (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className={`h-full ${index === 0 ? 'bg-pink-400' : index === 1 ? 'bg-sky-400' : 'bg-yellow-400'}`}
                                />
                              ) : (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className={`${s.skillFill} ${currentTemplate === 'minimal' || currentTemplate === 'retro' ? '' : `bg-gradient-to-r ${skill.color}`}`}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: 3D/2D Digital Human Portrait on the right of bio (5 cols on desktop) */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center">
                    <motion.div 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className={s.portraitContainer}
                    >
                      {/* Portrait Badge */}
                      <span className={s.portraitBadge}>
                        {currentTemplate === 'cyber' ? '● 3D ONLINE' : 'AI DIGITAL CLONE'}
                      </span>
                      
                      {/* Portrait Image (Using current customized avatar) */}
                      <img 
                        src={avatarUrl} 
                        alt="AI 3D Clone representation" 
                        className="w-full h-full object-cover select-none pointer-events-none"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/vibe_images/person/girl/girl.png'
                        }}
                        referrerPolicy="no-referrer"
                      />

                      {/* Portrait Caption Overlay */}
                      <div className={s.portraitCaptionClass}>
                        {s.portraitCaption}
                      </div>
                    </motion.div>
                  </div>

                </div>

                {/* Card Divider */}
                <div className={s.divider} />

                {/* Card Footer: QR Code & Prompt */}
                <div className="flex items-center justify-between gap-4 mt-1 relative z-10">
                  <div className="space-y-1 flex-1 text-left">
                    <h6 className={s.footerTitle}>与我的 AI 专属对话</h6>
                    <p className={s.footerDesc}>
                      长按或扫描右侧二维码，即可直接进入我的专属数字人界面，体验定制的音色、形象及知识库对话。
                    </p>
                  </div>
                  
                  {/* QR Code Container */}
                  <div className={s.qrContainer}>
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-full h-full object-contain" 
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg" />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons below card */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span className="text-emerald-400">链接已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="text-white/70" />
                      <span>复制专属链接</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadCard}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  <span>{downloading ? '生成海报中...' : '保存为分享海报'}</span>
                </motion.button>
              </div>

            </div>

            {/* Modal Footer Info */}
            <div className="px-6 py-3.5 border-t border-white/10 bg-white/5 flex items-center justify-center text-center relative z-10">
              <span className="text-[10px] text-white/50">
                支持跨设备同步 · 加密链接保证数据私密性
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
