import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Sliders, Volume2, Mic, Bot, X, Brain, Zap } from 'lucide-react'
import { useSentioBasicStore, useSentioAsrStore, useSentioTtsStore, useSentioAgentStore } from '../../lib/sentioStore'
import { Live2dManager } from '../../lib/live2d/live2dManager'
import { MemoryBankContent } from './MemoryBankDialog'
import { SkillsContent } from './SkillsDialog'
import type { ChatSession } from './HistoryDialog'

interface CharacterConfigDialogProps {
  isOpen: boolean
  onClose: () => void
  sessions?: ChatSession[]
}

type TabType = 'basic' | 'asr' | 'tts' | 'agent' | 'memory' | 'skills'

export function CharacterConfigDialog({ isOpen, onClose, sessions = [] }: CharacterConfigDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic')

  // Zustand stores
  const { sound, lipFactor, showThink, setSound, setLipFactor, setShowThink } = useSentioBasicStore()
  const asrStore = useSentioAsrStore()
  const ttsStore = useSentioTtsStore()
  const agentStore = useSentioAgentStore()

  const tabs = [
    { id: 'basic', name: '基础设置', icon: Sliders },
    { id: 'memory', name: 'Agent 记忆库', icon: Brain },
    { id: 'skills', name: 'Skills 技能', icon: Zap },
    { id: 'asr', name: '语音识别 (ASR)', icon: Mic },
    { id: 'tts', name: '语音合成 (TTS)', icon: Volume2 },
    { id: 'agent', name: 'AI 智能体', icon: Bot },
  ] as const

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-slate-900/90 border border-slate-700/50 rounded-3xl overflow-hidden flex flex-col h-[85vh] md:h-[650px] shadow-[0_24px_50px_rgba(0,0,0,0.5)] text-slate-100 animate-fade-in"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="text-indigo-400 animate-spin-slow" size={20} />
                <h3 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  数字人多模态配置中心
                </h3>
              </div>
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Main Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:w-56 bg-slate-950/40 border-b md:border-b-0 md:border-r border-slate-800/80 p-3 gap-2 md:gap-1 shrink-0 no-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`px-4 py-2 md:py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all text-left whitespace-nowrap shrink-0 ${
                        activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Panel Content */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-900/50">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-300 mb-4">基本交互表现</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-950/20 border border-slate-800/50 p-4 rounded-2xl">
                          <div>
                            <p className="text-xs font-bold text-slate-200">合成语音输出</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">是否在收到回复时自动朗读文本</p>
                          </div>
                          <button
                            onClick={() => setSound(!sound)}
                            className={`w-11 h-6 rounded-full transition-all relative ${sound ? 'bg-indigo-600' : 'bg-slate-700'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${sound ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-slate-950/20 border border-slate-800/50 p-4 rounded-2xl">
                          <div>
                            <p className="text-xs font-bold text-slate-200">显示思考过程 (R1模型)</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">是否展示 AI 的推理思考气泡</p>
                          </div>
                          <button
                            onClick={() => setShowThink(!showThink)}
                            className={`w-11 h-6 rounded-full transition-all relative ${showThink ? 'bg-indigo-600' : 'bg-slate-700'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${showThink ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/20 border border-slate-800/50 p-4 rounded-2xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-slate-200">口型振幅倍率 (Lip Sync Factor)</span>
                        <span className="text-xs font-bold text-indigo-400">{lipFactor.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={lipFactor}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value)
                          setLipFactor(val)
                          Live2dManager.getInstance().setLipFactor(val)
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                        <span>微小 (1.0)</span>
                        <span>标准 (5.0)</span>
                        <span>夸张 (10.0)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'asr' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">语音识别 (ASR) 配置</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">语音识别开关</label>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-300">启用 ASR 服务</span>
                          <button
                            onClick={() => asrStore.setEnable(!asrStore.enable)}
                            className={`w-11 h-6 rounded-full transition-all relative ${asrStore.enable ? 'bg-indigo-600' : 'bg-slate-700'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${asrStore.enable ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">默认识别引擎</label>
                        <select 
                          value={asrStore.engine} 
                          onChange={(e) => asrStore.setEngine(e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                        >
                          <option value="default">系统默认引擎</option>
                          <option value="SenseVoiceSmall">FunAudioLLM / SenseVoiceSmall (端侧超快速)</option>
                          <option value="whisper-1">OpenAI / Whisper-1 (长音频精准)</option>
                        </select>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-3">
                        <label className="text-[11px] text-slate-400 font-bold">第三方 ASR 引擎配置</label>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-16 shrink-0">Model:</span>
                            <input 
                              type="text"
                              autoComplete="off"
                              value={asrStore.settings?.model || ''}
                              onChange={(e) => asrStore.setSettings({ ...asrStore.settings, model: e.target.value })}
                              placeholder="例如 whisper-1"
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-16 shrink-0">Base URL:</span>
                            <input 
                              type="text"
                              autoComplete="off"
                              value={asrStore.settings?.base_url || ''}
                              onChange={(e) => asrStore.setSettings({ ...asrStore.settings, base_url: e.target.value })}
                              placeholder="https://api.openai.com/v1"
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-16 shrink-0">API Key:</span>
                            <input 
                              type="password"
                              autoComplete="new-password"
                              value={asrStore.settings?.api_key || ''}
                              onChange={(e) => asrStore.setSettings({ ...asrStore.settings, api_key: e.target.value })}
                              placeholder="第三方 ASR API Key"
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tts' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">语音合成 (TTS) 配置</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">语音合成开关</label>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-300">启用 TTS 服务</span>
                          <button
                            onClick={() => ttsStore.setEnable(!ttsStore.enable)}
                            className={`w-11 h-6 rounded-full transition-all relative ${ttsStore.enable ? 'bg-indigo-600' : 'bg-slate-700'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${ttsStore.enable ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">模型音色库 (Preset Voice)</label>
                        <select 
                          value={ttsStore.engine} 
                          onChange={(e) => ttsStore.setEngine(e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                        >
                          <option value="default">默认音色</option>
                          <option value="anna">fnlp/MOSS-TTSD-v0.5:anna (温柔女生)</option>
                          <option value="brian">fnlp/MOSS-TTSD-v0.5:brian (磁性男生)</option>
                          <option value="cloned">我的克隆声音 (零样本 Zero-shot)</option>
                        </select>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-3">
                        <label className="text-[11px] text-slate-400 font-bold">第三方 TTS 引擎配置</label>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-16 shrink-0">Model:</span>
                            <input 
                              type="text"
                              autoComplete="off"
                              value={ttsStore.settings?.model || ''}
                              onChange={(e) => ttsStore.setSettings({ ...ttsStore.settings, model: e.target.value })}
                              placeholder="例如 cosyvoice-300b"
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-16 shrink-0">Base URL:</span>
                            <input 
                              type="text"
                              autoComplete="off"
                              value={ttsStore.settings?.base_url || ''}
                              onChange={(e) => ttsStore.setSettings({ ...ttsStore.settings, base_url: e.target.value })}
                              placeholder="https://api.siliconflow.cn/v1"
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-16 shrink-0">API Key:</span>
                            <input 
                              type="password"
                              autoComplete="new-password"
                              value={ttsStore.settings?.api_key || ''}
                              onChange={(e) => ttsStore.setSettings({ ...ttsStore.settings, api_key: e.target.value })}
                              placeholder="第三方 TTS API Key"
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'agent' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">AI 智能体配置</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">推理大模型模型 (LLM Model)</label>
                        <select 
                          value={agentStore.engine} 
                          onChange={(e) => agentStore.setEngine(e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                        >
                          <option value="default">默认大模型</option>
                          <option value="deepseek-r1">DeepSeek-R1 (深度思维链推理)</option>
                          <option value="deepseek-v3">DeepSeek-V3 (极速大语言模型)</option>
                          <option value="qwen-2.5-72b">Qwen-2.5-72B-Instruct (阿里千问)</option>
                        </select>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-3">
                        <label className="text-[11px] text-slate-400 font-bold">第三方 Agent 大脑配置</label>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-16 shrink-0">Model:</span>
                            <input 
                              type="text"
                              autoComplete="off"
                              value={agentStore.settings?.model || ''}
                              onChange={(e) => agentStore.setSettings({ ...agentStore.settings, model: e.target.value })}
                              placeholder="例如 deepseek-chat"
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-16 shrink-0">Base URL:</span>
                            <input 
                              type="text"
                              autoComplete="off"
                              value={agentStore.settings?.base_url || ''}
                              onChange={(e) => agentStore.setSettings({ ...agentStore.settings, base_url: e.target.value })}
                              placeholder="https://api.deepseek.com/v1"
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-16 shrink-0">API Key:</span>
                            <input 
                              type="password"
                              autoComplete="new-password"
                              value={agentStore.settings?.api_key || ''}
                              onChange={(e) => agentStore.setSettings({ ...agentStore.settings, api_key: e.target.value })}
                              placeholder="第三方 LLM API Key"
                              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'memory' && (
                  <MemoryBankContent sessions={sessions} isDark={true} />
                )}

                {activeTab === 'skills' && (
                  <SkillsContent />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 transition-colors text-white shadow-md shadow-indigo-500/20"
              >
                保存并应用配置
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
