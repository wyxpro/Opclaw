import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, User, Check, Video, Image as ImageIcon, Sparkles, Bot, RefreshCw } from 'lucide-react'
import type { AvatarModel, CharacterStyle } from './types'
import { avatarCloneService } from '../../services/avatarCloneService'

export interface AvatarPreset {
    id: string
    name: string
    url: string
    type: 'image' | 'video'
    gender: 'male' | 'female'
    style: CharacterStyle
}

const PRESET_AVATARS: AvatarPreset[] = [
    // Default AI Avatar
    { id: 'default-ai', name: 'AI数字人', url: '/vibe_images/person/girl/girl.png', type: 'image', gender: 'female', style: 'realistic' },
    
    // Females
    { id: 'f1', name: '职场专家', url: '/vibe_images/person/girl/girl1.png', type: 'image', gender: 'female', style: 'realistic' },
    { id: 'f2', name: '元气甜妹', url: '/vibe_images/person/girl/元气甜妹.png', type: 'image', gender: 'female', style: 'realistic' },
    { id: 'f3', name: '古风女子', url: '/vibe_images/person/girl/古风女子.png', type: 'image', gender: 'female', style: 'realistic' },
    { id: 'f4', name: '可爱萝莉', url: '/vibe_images/person/girl/可爱萝莉.png', type: 'image', gender: 'female', style: 'cartoon' },
    { id: 'f5', name: '甜酷辣妹', url: '/vibe_images/person/girl/甜酷辣妹.png', type: 'image', gender: 'female', style: 'realistic' },
    { id: 'f6', name: '赛博朋克少女', url: '/vibe_images/person/girl/赛博朋克少女.png', type: 'image', gender: 'female', style: 'realistic' },
    { id: 'f7', name: '韩系女神', url: '/vibe_images/person/girl/韩系女神.png', type: 'image', gender: 'female', style: 'realistic' },
    
    // Males
    { id: 'm1', name: '元气少年', url: '/vibe_images/person/boy/元气少年.jpg', type: 'image', gender: 'male', style: 'realistic' },
    { id: 'm2', name: '国风公子', url: '/vibe_images/person/boy/国风公子.jpg', type: 'image', gender: 'male', style: 'realistic' },
    { id: 'm3', name: '复古港风', url: '/vibe_images/person/boy/复古港风.jpg', type: 'image', gender: 'male', style: 'realistic' },
    { id: 'm4', name: '成熟绅士', url: '/vibe_images/person/boy/成熟绅士.jpg', type: 'image', gender: 'male', style: 'realistic' },
    { id: 'm5', name: '文艺少年', url: '/vibe_images/person/boy/文艺少年.jpg', type: 'image', gender: 'male', style: 'realistic' },
    { id: 'm6', name: '电竞潮玩少年', url: '/vibe_images/person/boy/电竞潮玩少年.jpg', type: 'image', gender: 'male', style: 'cartoon' },
    { id: 'm7', name: '街头少年', url: '/vibe_images/person/boy/街头少年.jpg', type: 'image', gender: 'male', style: 'realistic' },
]

// 默认AI头像配置
export const DEFAULT_AI_AVATAR: AvatarModel = {
    id: 'default-ai',
    name: 'AI数字人',
    type: 'image',
    url: '/vibe_images/person/girl/girl.png',
    style: 'realistic',
    createdAt: Date.now(),
    isCloned: false
}

interface AvatarSelectionDialogProps {
    isOpen: boolean
    onClose: () => void
    onSelectAvatar: (avatar: any) => void
    myAvatar?: AvatarModel | null
    currentAvatarUrl?: string
    onGoToClone?: () => void
}

export function AvatarSelectionDialog({ isOpen, onClose, onSelectAvatar, myAvatar, currentAvatarUrl, onGoToClone }: AvatarSelectionDialogProps) {
    const [activeTab, setActiveTab] = useState<'presets' | 'my'>('presets')
    const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all')
    const [myStyleFilter, setMyStyleFilter] = useState<CharacterStyle>(myAvatar?.style || 'realistic')
    const [isGeneratingStyle, setIsGeneratingStyle] = useState(false)
    const [generatedAvatars, setGeneratedAvatars] = useState<Record<CharacterStyle, AvatarModel | null>>({
        'realistic': myAvatar || null,
        'cartoon': null,
        'hidden': null
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadPreview, setUploadPreview] = useState<{ url: string, type: 'image' | 'video' } | null>(null)

    // 同步外部传入的我的分身风格
    React.useEffect(() => {
        if (myAvatar?.style) {
            setMyStyleFilter(myAvatar.style)
            setGeneratedAvatars(prev => ({
                ...prev,
                [myAvatar.style]: myAvatar
            }))
        }
    }, [myAvatar])

    // 风格切换时自动生成对应风格的头像
    React.useEffect(() => {
        const generateAvatarForStyle = async () => {
            if (!myAvatar?.originalUrl || generatedAvatars[myStyleFilter] || isGeneratingStyle) {
                return
            }

            setIsGeneratingStyle(true)
            try {
                const result = await avatarCloneService.cloneAvatar({
                    imageUrl: myAvatar.originalUrl,
                    style: myStyleFilter
                })

                if (result.error) {
                    throw new Error(result.error)
                }

                const newAvatar: AvatarModel = {
                    ...myAvatar,
                    id: `avatar-${Date.now()}`,
                    url: result.url,
                    style: myStyleFilter,
                    createdAt: Date.now()
                }

                setGeneratedAvatars(prev => ({
                    ...prev,
                    [myStyleFilter]: newAvatar
                }))
            } catch (err) {
                console.error('Generate style avatar failed:', err)
                alert(`生成${myStyleFilter === 'cartoon' ? '卡通' : '真实'}风格形象失败: ${err instanceof Error ? err.message : '未知错误'}`)
            } finally {
                setIsGeneratingStyle(false)
            }
        }

        generateAvatarForStyle()
    }, [myStyleFilter, myAvatar, generatedAvatars])

    const filteredPresets = PRESET_AVATARS.filter(p => genderFilter === 'all' || p.gender === genderFilter)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            const type = file.type.startsWith('video/') ? 'video' : 'image'
            setUploadPreview({ url, type })
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl overflow-hidden flex flex-col max-h-[75vh] shadow-[0_-10px_50px_rgba(0,0,0,0.1)]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Mobile Handle */}
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2 mb-1 sm:hidden" />

                        {/* Header */}
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Sparkles size={16} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">选择分身形象</h3>
                            </div>
                            <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">×</button>
                        </div>

                        {/* Tabs */}
                        <div className="px-5 py-2.5 flex gap-2">
                            <button 
                                onClick={() => setActiveTab('presets')}
                                className={`flex-1 py-1.5 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === 'presets' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-50 text-gray-400'
                                }`}
                            >
                                预设库
                            </button>
                             <button 
                                onClick={() => setActiveTab('my')}
                                className={`flex-1 py-1.5 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === 'my' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-50 text-gray-400'
                                }`}
                            >
                                我的分身
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 pb-5">
                            {activeTab === 'presets' ? (
                                <div className="space-y-4">
                                    {/* Gender Filter */}
                                    <div className="flex gap-2">
                                        {['all', 'female', 'male'].map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => setGenderFilter(g as any)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                                    genderFilter === g ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-100 text-gray-400'
                                                }`}
                                            >
                                                {g === 'all' ? '全部' : g === 'female' ? '女生' : '男生'}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Presets Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {filteredPresets.map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    onSelectAvatar({ type: p.type, url: p.url, style: p.style })
                                                    onClose()
                                                }}
                                                className={`group relative flex flex-col p-1.5 rounded-xl border-2 transition-all ${
                                                    currentAvatarUrl === p.url ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-50 hover:border-indigo-100'
                                                }`}
                                            >
                                                <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 relative">
                                                    <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                                                    {currentAvatarUrl === p.url && (
                                                        <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                                                <Check size={14} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="px-1 text-left w-full">
                                                    <div className={`font-bold text-[11px] truncate ${currentAvatarUrl === p.url ? 'text-indigo-600' : 'text-gray-800'}`}>{p.name}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                 <div className="space-y-5 pt-1">
                                    {/* Style Selection */}
                                    <div className="space-y-3">
                                        <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
                                            <button 
                                                onClick={() => setMyStyleFilter('realistic')}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                                    myStyleFilter === 'realistic' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'
                                                }`}
                                            >
                                                <User size={14} />
                                                真实风格
                                            </button>
                                            <button 
                                                onClick={() => setMyStyleFilter('cartoon')}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                                    myStyleFilter === 'cartoon' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'
                                                }`}
                                            >
                                                <Sparkles size={14} />
                                                卡通风格
                                            </button>
                                        </div>

                                        {/* 生成进度条 */}
                                        <AnimatePresence>
                                            {isGeneratingStyle && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="p-3 rounded-xl bg-blue-50 border border-blue-100 overflow-hidden"
                                                >
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <p className="text-xs font-medium text-blue-700">
                                                            正在生成{myStyleFilter === 'cartoon' ? '卡通' : '真实'}风格形象...</p>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-blue-100 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: '0%' }}
                                                            animate={{ width: '100%' }}
                                                            transition={{ duration: 8, ease: 'easeInOut' }}
                                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {myAvatar ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    const avatarToUse = generatedAvatars[myStyleFilter] || myAvatar
                                                    onSelectAvatar({ ...avatarToUse, style: myStyleFilter })
                                                    onClose()
                                                }}
                                                disabled={isGeneratingStyle}
                                                className="relative group aspect-[3/4] rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-lg disabled:opacity-70"
                                            >
                                                {isGeneratingStyle ? (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-3">
                                                        <RefreshCw size={24} className="text-indigo-500 animate-spin" />
                                                        <p className="text-xs font-medium text-gray-600">生成中...</p>
                                                    </div>
                                                ) : generatedAvatars[myStyleFilter]?.type === 'video' ? (
                                                    <video src={generatedAvatars[myStyleFilter]!.url} className="w-full h-full object-cover" />
                                                ) : generatedAvatars[myStyleFilter] ? (
                                                    <img src={generatedAvatars[myStyleFilter]!.url} className="w-full h-full object-cover" alt="My Avatar" referrerPolicy="no-referrer" />
                                                ) : (
                                                    <img src={myAvatar.url} className="w-full h-full object-cover" alt="My Avatar" referrerPolicy="no-referrer" />
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                    <p className="text-white text-[11px] font-bold truncate">{myAvatar.name}</p>
                                                    <p className="text-white/60 text-[9px]">{myStyleFilter === 'realistic' ? '真实风格' : '卡通风格'}</p>
                                                </div>
                                                {(generatedAvatars[myStyleFilter] && currentAvatarUrl === generatedAvatars[myStyleFilter]!.url) || 
                                                 (!generatedAvatars[myStyleFilter] && currentAvatarUrl === myAvatar.url) && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                                                        <Check size={12} />
                                                    </div>
                                                )}
                                            </motion.button>
                                            
                                            {/* Quick Clone Button */}
                                            <button 
                                                onClick={() => onGoToClone?.()}
                                                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-indigo-500">
                                                    <Upload size={20} />
                                                </div>
                                                <div className="text-[11px] font-bold text-gray-500">再创建一个</div>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* 默认AI数字人头像 */}
                                            {myStyleFilter === 'realistic' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        onSelectAvatar({ ...DEFAULT_AI_AVATAR, style: myStyleFilter })
                                                        onClose()
                                                    }}
                                                    className="relative group aspect-[3/4] rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-lg"
                                                >
                                                    <img src={DEFAULT_AI_AVATAR.url} className="w-full h-full object-cover" alt={DEFAULT_AI_AVATAR.name} referrerPolicy="no-referrer" />
                                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                        <p className="text-white text-[11px] font-bold truncate">{DEFAULT_AI_AVATAR.name}</p>
                                                        <p className="text-white/60 text-[9px]">真实风格</p>
                                                    </div>
                                                    {currentAvatarUrl === DEFAULT_AI_AVATAR.url && (
                                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                                                            <Check size={12} />
                                                        </div>
                                                    )}
                                                </motion.button>
                                            )}
                                            
                                            {/* Quick Clone Button */}
                                            <button 
                                                onClick={() => onGoToClone?.()}
                                                className={`aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all ${
                                                    myStyleFilter === 'cartoon' ? 'col-span-2' : ''
                                                }`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-indigo-500">
                                                    <Upload size={20} />
                                                </div>
                                                <div className="text-[11px] font-bold text-gray-500">
                                                    {myStyleFilter === 'realistic' ? '再创建一个' : '创建卡通风格分身'}
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                        <p className="text-[11px] text-blue-700 leading-relaxed text-left flex gap-2">
                                            <span className="shrink-0 mt-0.5">✨</span>
                                            提示：我的分身支持在不同对话场景中切换风格，真实风格适合正式场合，卡通风格适合趣味互动。
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*,video/*"
                            className="hidden" 
                            onChange={handleFileUpload}
                        />
                        <div className="h-6 sm:hidden bg-white shrink-0" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
