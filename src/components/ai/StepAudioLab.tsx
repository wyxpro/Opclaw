import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Volume2, VolumeX, Play, Square, Send, Sparkles,
  Phone, PhoneOff, Loader2, Copy, AlertTriangle, ArrowRight,
  User, Bot, RefreshCw, Music
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import {
  transcribeStepAudio,
  generateStepSpeech,
  streamStepChat,
  StepAudioRealtimeClient,
  PRESET_VOICES,
  type StepChatMessage
} from '../../services/stepfun';

export default function StepAudioLab() {
  const { themeConfig } = useTheme();
  const [subTab, setSubTab] = useState<'realtime' | 'chat' | 'tts' | 'asr'>('realtime');

  return (
    <div
      className="p-1 md:p-6 rounded-3xl border transition-all duration-300"
      style={{
        background: themeConfig.glassEffect.background,
        borderColor: themeConfig.colors.border,
        backdropFilter: themeConfig.glassEffect.backdropBlur,
      }}
    >
      {/* Sub-tab navigation */}
      <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-slate-950/40 rounded-2xl border border-slate-800/40">
        {[
          { id: 'realtime', label: '📞 实时语音对话', desc: 'stepaudio-2.5-realtime' },
          { id: 'chat', label: '💬 语音对话大模型', desc: 'stepaudio-2.5-chat' },
          { id: 'tts', label: '🔊 表现力语音合成', desc: 'stepaudio-2.5-tts' },
          { id: 'asr', label: '🎤 高性能语音识别', desc: 'stepaudio-2.5-asr' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              subTab === tab.id
                ? 'bg-indigo-600 text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[9px] opacity-75 font-mono">{tab.desc}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {subTab === 'realtime' && <RealtimePanel key="realtime" />}
        {subTab === 'chat' && <ChatPanel key="chat" />}
        {subTab === 'tts' && <TtsPanel key="tts" />}
        {subTab === 'asr' && <AsrPanel key="asr" />}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   1. Realtime Panel (WebSocket full-duplex)
   ========================================================================== */
function RealtimePanel() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'recording' | 'thinking' | 'speaking'>('disconnected');
  const [voice, setVoice] = useState('linjiajiejie');
  const [instructions, setInstructions] = useState('你是一个亲切、高情商的语音分身助手。回复要幽默、口语化，多用短句，适合语音播报。');
  const [transcript, setTranscript] = useState('');
  const clientRef = useRef<StepAudioRealtimeClient | null>(null);

  const startCall = async () => {
    try {
      setTranscript('');
      const client = new StepAudioRealtimeClient({
        onOpen: () => {},
        onTextDelta: (text) => {
          setTranscript(prev => prev + text);
        },
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
        },
        onAudioStart: () => {},
        onAudioEnd: () => {},
      });

      clientRef.current = client;
      await client.connect({ voice, instructions });
    } catch (e) {
      alert('连接失败：' + (e instanceof Error ? e.message : '未知错误'));
      setStatus('disconnected');
    }
  };

  const endCall = () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setStatus('disconnected');
  };

  const toggleMute = () => {
    if (!clientRef.current) return;
    if (status === 'recording') {
      clientRef.current.stopRecording();
    } else {
      clientRef.current.startRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Column */}
        <div className="space-y-4 p-5 rounded-2xl bg-slate-950/20 border border-slate-800/40">
          <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles size={16} className="text-indigo-400" />
            通话参数设定
          </h4>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400">选择分身音色</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              disabled={status !== 'disconnected'}
              className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 disabled:opacity-50"
            >
              {PRESET_VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400">系统人设指令 (Instructions)</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={status !== 'disconnected'}
              rows={4}
              className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Interaction Column */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/20 border border-slate-800/40 min-h-[300px] relative overflow-hidden">
          {/* Pulsating animation */}
          {status !== 'disconnected' && (
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-15">
              <motion.div
                animate={{
                  scale: status === 'recording' ? [1, 1.8, 1] : [1, 1.3, 1],
                  opacity: status === 'recording' ? [0.2, 0.6, 0.2] : [0.1, 0.3, 0.1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: status === 'recording' ? 1.5 : 3,
                  ease: 'easeInOut',
                }}
                className={`w-72 h-72 rounded-full blur-3xl ${
                  status === 'recording'
                    ? 'bg-rose-500'
                    : status === 'speaking'
                    ? 'bg-indigo-500'
                    : 'bg-emerald-500'
                }`}
              />
            </div>
          )}

          {/* Central Call Trigger */}
          <div className="flex flex-col items-center gap-6 z-10">
            {status === 'disconnected' ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCall}
                className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <Phone size={32} />
              </motion.button>
            ) : (
              <div className="flex items-center gap-4">
                {/* Talk / Mute Switch */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  disabled={status === 'connecting'}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all cursor-pointer ${
                    status === 'recording'
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20 animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                  } disabled:opacity-50`}
                >
                  {status === 'recording' ? <MicOff size={24} /> : <Mic size={24} />}
                </motion.button>

                {/* Hang up */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={endCall}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-[0_10px_25px_rgba(239,68,68,0.3)] transition-all cursor-pointer"
                >
                  <PhoneOff size={24} />
                </motion.button>
              </div>
            )}

            {/* Status indicator */}
            <div className="text-center">
              <p className="text-sm font-bold capitalize text-slate-100 flex items-center justify-center gap-2">
                {status === 'connecting' && <Loader2 size={16} className="animate-spin text-teal-400" />}
                {status === 'recording' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                {status === 'disconnected' && '未连接'}
                {status === 'connecting' && '正在建立全双工实时通道...'}
                {status === 'connected' && '已连线，随时可以说话'}
                {status === 'recording' && '正在录音...（说完了松开或按静音）'}
                {status === 'thinking' && '正在分析副语言并生成回复...'}
                {status === 'speaking' && 'AI分身正在说话...'}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {status !== 'disconnected' ? 'WebSocket wss://api.stepfun.com/step_plan/v1/realtime' : '点击话筒按钮发起呼叫'}
              </p>
            </div>
          </div>

          {/* Transcript Box */}
          {transcript && (
            <div className="w-full max-w-md mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <p className="font-bold text-slate-400 mb-1">AI 分身实时语音字幕：</p>
              <p className="leading-relaxed whitespace-pre-wrap">{transcript}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   2. Chat Panel (Text-in/text-out stepaudio-2.5-chat)
   ========================================================================== */
function ChatPanel() {
  const [messages, setMessages] = useState<StepChatMessage[]>([
    { role: 'assistant', content: '😊 你好！我是基于 `stepaudio-2.5-chat` 模型建立的语音对话助手。我不仅具备强大的对话推理能力，还专为语音交互而训练。请输入文字，我可以流式回答你！' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [ttsLoading, setTtsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: StepChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessageId = `chat-${Date.now()}`;
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      let fullContent = '';
      const payloadMessages = [
        ...messages,
        userMessage
      ];

      await streamStepChat(
        { messages: payloadMessages },
        (chunk) => {
          fullContent += chunk;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { role: 'assistant', content: fullContent };
            return next;
          });
        }
      );

      setIsLoading(false);

      // Trigger automatic TTS playback if option is active
      if (autoSpeak && fullContent) {
        speakResponse(fullContent);
      }
    } catch (e) {
      setIsLoading(false);
      alert('对话失败：' + (e instanceof Error ? e.message : '未知错误'));
    }
  };

  const speakResponse = async (text: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setTtsLoading(true);
    try {
      // Clean text from emojis for TTS
      const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
      const audioBlob = await generateStepSpeech({
        input: cleanText,
        voice: 'linjiajiejie',
        instruction: '温柔地自然播报'
      });

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setTtsLoading(false);
      audio.onerror = () => setTtsLoading(false);
      await audio.play();
    } catch (e) {
      console.error(e);
      setTtsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-[450px] space-y-4"
    >
      {/* Settings Row */}
      <div className="flex justify-between items-center px-4 py-2 bg-slate-950/20 border border-slate-800/40 rounded-xl">
        <span className="text-xs text-slate-400">大模型端点: `/step_plan/v1/chat/completions`</span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="accent-indigo-600 rounded"
            />
            自动播放回答语音
          </label>
          {ttsLoading && (
            <span className="flex items-center gap-1 text-[11px] text-teal-400 font-bold">
              <Loader2 size={12} className="animate-spin" />
              正在播放音频...
            </span>
          )}
        </div>
      </div>

      {/* Message Screen */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-950/40 border border-slate-800/30 rounded-2xl space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="space-y-1">
                <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/80 text-slate-100 border border-slate-800/60 rounded-tl-none'
                }`}>
                  {m.content || <Loader2 size={14} className="animate-spin text-slate-400" />}
                </div>
                {m.role === 'assistant' && m.content && (
                  <button
                    onClick={() => speakResponse(m.content)}
                    className="text-[10px] text-slate-500 hover:text-indigo-400 flex items-center gap-0.5 ml-1 transition-colors"
                  >
                    <Volume2 size={12} />
                    播放这段语音
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="给 AI 分身说点什么..."
          className="flex-1 bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          发送
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   3. TTS Panel (Expressive Text-to-Speech stepaudio-2.5-tts)
   ========================================================================== */
function TtsPanel() {
  const [text, setText] = useState('你好，(whisper) 我是你的专属AI分身。 (laughter) 很高兴能用这种非常自然、富有感情的声音跟你对话。 (sigh) 相信我们在未来能一起探索更多AI能力的奥秘！');
  const [instruction, setInstruction] = useState('温柔、亲切地，在括号标注处加入对应的呼吸、轻笑或低语等细节情绪');
  const [voice, setVoice] = useState('linjiajiejie');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const synthesize = async () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const blob = await generateStepSpeech({
        input: text,
        instruction,
        voice
      });

      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audioRef.current = audio;
      await audio.play();
    } catch (e) {
      alert('合成失败：' + (e instanceof Error ? e.message : '未知错误'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Column */}
        <div className="space-y-4 p-5 rounded-2xl bg-slate-950/20 border border-slate-800/40">
          <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
            <Volume2 size={16} className="text-indigo-400" />
            合成参数控制
          </h4>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400">音色模型 (Voice)</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
            >
              {PRESET_VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400">全局语境微调指导 (Instruction)</label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
              placeholder="控制语音的语速、感情、口癖，如：亲切、带有一点慵懒和轻笑..."
              className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="p-3 bg-slate-900/40 border border-slate-800/50 rounded-xl space-y-1">
            <p className="text-[10px] text-indigo-400 font-bold flex items-center gap-0.5">
              <Sparkles size={11} />
              小贴士：
            </p>
            <p className="text-[9px] text-slate-500 leading-relaxed">
              StepAudio-TTS 支持句内局部细节控制，您可以直接在输入框中利用英文括号插入标记，例如 <b>(whisper)</b> 代表低语，<b>(laughter)</b> 代表轻笑，<b>(sigh)</b> 代表叹气等，能够让合成的说话人极其富有活人质感。
            </p>
          </div>
        </div>

        {/* Text Input & Player Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400">合成输入文本 (Input Text)</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="输入需要朗读的文本，最多 1000 字..."
              className="w-full bg-slate-900 border border-slate-700/60 rounded-2xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={synthesize}
              disabled={isLoading || !text.trim()}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 disabled:text-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              立即合成并播放
            </button>

            {audioUrl && (
              <audio controls src={audioUrl} className="h-9 max-w-xs text-slate-200 outline-none rounded-xl" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   4. ASR Panel (Speech-to-Text stepaudio-2.5-asr)
   ========================================================================== */
function AsrPanel() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [partial, setPartial] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecord = async () => {
    setTranscription('');
    setPartial('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsLoading(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const text = await transcribeStepAudio(audioBlob, (partialText) => {
            setPartial(partialText);
          });
          setTranscription(text || '未检测到语音内容，请重新尝试。');
        } catch (e) {
          alert('识别失败：' + (e instanceof Error ? e.message : '未知错误'));
        } finally {
          setIsLoading(false);
        }

        // Release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      alert('麦克风授权失败：' + (e instanceof Error ? e.message : '未知错误'));
    }
  };

  const stopRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const copyResult = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    alert('已复制到剪贴板！');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-950/20 border border-slate-800/40 min-h-[250px] relative overflow-hidden">
        {/* Glowing wave animation when recording */}
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-15">
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-56 h-56 rounded-full bg-indigo-500 blur-3xl"
            />
          </div>
        )}

        <div className="flex flex-col items-center gap-5 z-10 text-center">
          {!isRecording ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecord}
              disabled={isLoading}
              className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Mic size={24} />}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecord}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/20 transition-all cursor-pointer animate-pulse"
            >
              <Square size={20} />
            </motion.button>
          )}

          <div>
            <p className="text-sm font-bold text-slate-200">
              {isRecording ? '正在监听您的语音输入...' : isLoading ? '正在流式解码语音...' : '点击话筒开始录音'}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              使用 stepaudio-2.5-asr 准实时流式转写接口 (SSE)
            </p>
          </div>
        </div>

        {/* Real-time Partial Result */}
        {partial && (
          <div className="mt-6 text-center max-w-md px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/25">
            <p className="text-xs text-indigo-300 animate-pulse font-medium">流式转写中: "{partial}"</p>
          </div>
        )}

        {/* Final Result Card */}
        {transcription && (
          <div className="w-full max-w-lg mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400">识别结果 (Transcription Result)</span>
              <button
                onClick={copyResult}
                className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
              >
                <Copy size={12} />
                复制
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium select-text">
              "{transcription}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
