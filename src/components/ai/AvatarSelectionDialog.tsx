import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, User, Check, Video, Image as ImageIcon, Sparkles } from 'lucide-react'

export interface AvatarPreset {
    id: string
    name: string
    url: string
    type: 'image' | 'video'
    gender: 'male' | 'female'
    style: 'realistic' | 'cartoon' | 'professional' | 'casual'
}

const PRESET_AVATARS: AvatarPreset[] = [
    // Females
    { id: 'f1', name: '职场专家', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', type: 'image', gender: 'female', style: 'professional' },
    { id: 'f2', name: '活力少女', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', type: 'image', gender: 'female', style: 'casual' },
    { id: 'f3', name: '文静学姐', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', type: 'image', gender: 'female', style: 'realistic' },
    { id: 'f4', name: '元气卡通', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Lucy', type: 'image', gender: 'female', style: 'cartoon' },
    { id: 'f5', name: '摩登都会', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', type: 'image', gender: 'female', style: 'realistic' },
    
    // Males
    { id: 'm1', name: '商务精英', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', type: 'image', gender: 'male', style: 'professional' },
    { id: 'm2', name: '阳光暖男', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', type: 'image', gender: 'male', style: 'casual' },
    { id: 'm3', name: '智慧学者', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', type: 'image', gender: 'male', style: 'realistic' },
    { id: 'm4', name: '硬派克隆', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jack', type: 'image', gender: 'male', style: 'cartoon' },
    { id: 'm5', name: '潮流极客', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400', type: 'image', gender: 'male', style: 'casual' },
]

interface AvatarSelectionDialogProps {
    isOpen: boolean
    onClose: () => void
    onSelectAvatar: (avatar: { type: 'image' | 'video' | 'custom', url: string, style?: string }) => void
}

export function AvatarSelectionDialog({ isOpen, onClose, onSelectAvatar }: AvatarSelectionDialogProps) {
    const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets')
    const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadPreview, setUploadPreview] = useState<{ url: string, type: 'image' | 'video' } | null>(null)

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
                                <h3 className="text-base font-bold text-gray-900">克隆数字分身</h3>
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
                                onClick={() => setActiveTab('custom')}
                                className={`flex-1 py-1.5 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === 'custom' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-50 text-gray-400'
                                }`}
                            >
                                自定义上传
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
                                                className="group relative flex flex-col p-1.5 rounded-xl border-2 border-gray-50 hover:border-indigo-100 transition-all"
                                            >
                                                <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5">
                                                    <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                                <div className="px-1 text-left w-full">
                                                    <div className="font-bold text-[11px] text-gray-800 truncate">{p.name}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 pt-1 text-center">
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-video rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all overflow-hidden relative"
                                    >
                                        {uploadPreview ? (
                                            <>
                                                {uploadPreview.type === 'video' ? (
                                                    <video src={uploadPreview.url} className="w-full h-full object-cover" autoPlay loop muted />
                                                ) : (
                                                    <img src={uploadPreview.url} className="w-full h-full object-cover" alt="Preview" />
                                                )}
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <p className="text-white text-sm font-bold">更换素材</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-indigo-500 mb-4">
                                                    <Upload size={32} />
                                                </div>
                                                <div className="font-bold text-gray-800">上传视频或照片</div>
                                                <p className="text-xs text-gray-400 mt-1 max-w-[200px]">支持 MP4, MOV 或 JPG, PNG 打造专属数字形象</p>
                                            </>
                                        )}
                                    </div>

                                    {uploadPreview && (
                                        <button 
                                            onClick={() => {
                                                onSelectAvatar({ type: uploadPreview.type, url: uploadPreview.url, style: 'realistic' })
                                                onClose()
                                            }}
                                            className="w-full py-4 bg-indigo-600 rounded-2xl text-white font-bold shadow-xl shadow-indigo-200 active:scale-95 transition-all"
                                        >
                                            确认使用此形象
                                        </button>
                                    )}

                                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                        <p className="text-[11px] text-amber-700 leading-relaxed text-left flex gap-2">
                                            <span className="shrink-0 mt-0.5">💡</span>
                                            提示：上传清晰的脸部特写视频或照片，能获得更逼真的数字人合成效果和面部动态。
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
