# 🤖 Opclaw 数字人三步骤 Agent 工作流程图指南

本篇文档模仿了时序流程图（Sequence Diagram）的样式，为您梳理并还原了 Opclaw 项目中 **声音克隆**、**形象复刻**、以及 **AI数字人对话** 三个核心 Agent 模块的具体执行链路，包括模型选型、输入输出、工具层调用及数据库读写逻辑。

---

## 🎙️ 工作流 1：声音克隆 Agent 工作流程 (Voice Cloning)

声音克隆 Agent 负责采集用户少量的语音样本，提取声学特征，并训练/构建个性化的声音包。

### 1. Mermaid 时序图

```mermaid
sequenceDiagram
    autonumber
    actor 用户
    participant AI Agent as 声音克隆 Agent
    participant 工具层 as 客户端/音频工具层
    participant AI 模型 as GPT-SoVITS / ASR
    participant 数据库 as PostgreSQL / Supabase
    
    用户->>AI Agent: 发起“声音克隆”请求
    AI Agent->>AI Agent: 决策：启动声音分析与克隆工作流
    AI Agent->>用户: 请求麦克风权限，展示录音文本提示
    用户->>AI Agent: 在线朗读并录制 10-30 秒音频
    AI Agent->>工具层: 传输音频原始数据 (WAV/MP3)
    
    Note over 工具层: 客户端音频预处理:<br/>提取RMS、去噪、音量归一化
    
    工具层->>AI 模型: 调用 GPT-SoVITS 提取声学向量特征
    AI 模型-->>工具层: 返回声音特征向量 (Voice Profile)
    工具层-->>AI Agent: 声学嵌入特征数据 (Embedding)
    
    Note over AI Agent: 提取声音模型权重参数<br/>匹配音色/情绪映射基线
    
    AI Agent->>用户: 试听克隆声音 (生成并播放测试文本)
    AI Agent->>数据库: 存储克隆声音模型权重及用户音色配置
    数据库-->>AI Agent: 存储成功确认
    AI Agent->>用户: 提示声音克隆完成，音色已上线
```

### 2. 详细执行步骤说明

*   **用户层**：发起声音克隆，授权麦克风并完成 10~30 秒的短音频录制。
*   **AI Agent**：负责状态机控制，引导用户完成录制，并决定声音文件的截取与调用特征提取模型。
*   **工具层**：执行音频前处理（如去除杂音、限制音量范围、采样率转换），并将干净音频传输到云端/本地推理模块。
*   **AI 模型 (GPT-SoVITS)**：使用少样本 TTS 声音克隆技术，通过对录制的音频样本进行自适应微调，生成对应的音色特征权重（Speaker Embedding）。
*   **数据库层**：在数据库中持久化存储用户专属的音色特征 ID 以及关联的文件存储链接。

---

## 👤 工作流 2：形象复刻 Agent 工作流程 (Avatar Creation)

形象复刻 Agent 负责通过照片提取用户的面部网格与几何信息，并结合 3D 渲染引擎构建个性化虚拟形象。

### 1. Mermaid 时序图

```mermaid
sequenceDiagram
    autonumber
    actor 用户
    participant AI Agent as 形象复刻 Agent
    participant 工具层 as 图像工具层 & WebGL
    participant AI 模型 as MediaPipe / InsightFace
    participant 数据库 as 资产存储 / Supabase
    
    用户->>AI Agent: 发起“形象复刻”请求
    AI Agent->>AI Agent: 决策：激活面部识别与 3D 重建工作流
    AI Agent->>用户: 请求相机权限 (或提示上传照片)
    用户->>AI Agent: 拍照上传正面清晰人脸照
    AI Agent->>工具层: 图片格式标准化处理 (压缩、裁剪)
    工具层->>AI 模型: 提取面部 3D 几何特征点 (Facial Landmarking)
    AI 模型-->>工具层: 返回 468 个面部网格坐标 (Mesh Map)
    工具层-->>AI Agent: 返回人脸特征数据与纹理映射点
    
    Note over AI Agent: WebGL / Three.js 客户端渲染:<br/>进行骨骼绑定 (Skeleton Setup)<br/>配置眨眼与口型驱动 (Visemes)
    
    AI Agent->>用户: 展示 3D 形象预览并允许微调偏好
    AI Agent->>数据库: 存储 3D 数字人配置与骨骼贴图模型文件
    数据库-->>AI Agent: 存储成功确认
    AI Agent->>用户: 提示形象复刻完成，分身已激活
```

### 2. 详细执行步骤说明

*   **用户层**：上传一张高清人脸照片，或直接调用前置摄像头拍摄。
*   **AI Agent**：启动图像分析，引导用户将脸部对准取景框，检测光线是否充足。
*   **工具层**：对原始图像进行亮度和对比度优化，对齐眼部和嘴部区域。
*   **AI 模型 (MediaPipe/InsightFace)**：检测人脸关键点，重建面部 3D 拓扑结构，生成纹理映射图（UV Map）。
*   **WebGL / Three.js**：在前端执行骨骼绑定和面部动作捕捉映射（Visemes），为数字人的嘴巴、眼睛和面部肌肉配置表情参数。
*   **数据库层**：将生成的 3D 模型配置文件（如 JSON/GLTF 结构）以及预设的主题场景绑定存储到数据库中。

---

## 💬 工作流 3：AI数字人对话 Agent 工作流程 (AI Chat & Decision Loop)

数字人对话 Agent 是 Opclaw 的大脑核，它包含了完整的“用户输入 → Agent 决策 → 工具调用 → 执行结果”的闭环决策流。

### 1. Mermaid 时序图

```mermaid
sequenceDiagram
    autonumber
    actor 用户
    participant AI Agent as 对话控制 Agent
    participant 工具层 as RAG 检索 & ASR/TTS
    participant AI 模型 as LLM (Llama) & SoVITS
    participant 数据库 as 向量数据库 / Supabase
    
    用户->>AI Agent: 输入语音提问 ("今天我的新媒体数据怎么样?")
    
    rect rgb(240, 248, 255)
        Note over AI Agent, 工具层: 阶段一：用户输入与预处理
        AI Agent->>工具层: 调用 ASR (语音转文字) 服务
        工具层->>AI 模型: 音频流识别转写
        AI 模型-->>工具层: 返回文本结果 ("今天我的新媒体数据怎么样?")
        工具层-->>AI Agent: 识别纯文本
    end
    
    rect rgb(255, 250, 240)
        Note over AI Agent, 数据库: 阶段二：Agent 决策与 RAG 检索
        AI Agent->>AI Agent: 意图识别：需要查询自媒体看板数据与历史上下文
        AI Agent->>数据库: 向量检索该用户的历史记忆与相关数据指标
        数据库-->>AI Agent: 返回 context：[昨日PV=1200, 主题=技术分享...]
    end
    
    rect rgb(245, 255, 250)
        Note over AI Agent, AI 模型: 阶段三：大模型推理与工具调用
        AI Agent->>AI 模型: 输入 [用户提问 + RAG 上下文 + 人设 Prompt]
        Note over AI 模型: LLM 决策:<br/>推理生成答复文本并打上<br/>[高兴/摆手] 等动作情绪标签
        AI 模型-->>AI Agent: 返回智能回复文本与 Action 动作控制参数
    end
    
    rect rgb(255, 240, 245)
        Note over AI Agent, 工具层: 阶段四：数字人语音与动作执行结果
        AI Agent->>AI 模型: 调用 GPT-SoVITS 转换文本为用户克隆音色
        AI 模型-->>AI Agent: 返回克隆音频数据流 (Audio Stream)
        AI Agent->>工具层: 驱动 Three.js 运行口型同步 (Lip-Sync) 并播放音频与动作
        AI Agent->>数据库: 保存本次会话记录与更新上下文记忆
    end
    
    AI Agent->>用户: 展现 3D 数字人开口说话并进行肢体互动
```

### 2. 详细执行步骤说明

*   **阶段一：用户输入与预处理**：用户通过语音输入时，声音经由 ASR 识别模块转为纯文本；如果直接输入文本，则直接跳到阶段二。
*   **阶段二：Agent 决策与 RAG 检索**：Agent 接收文本后，通过预处理进行意图分析。它判定用户正在询问新媒体数据，于是向 Supabase/向量数据库发起查询，检索当前关联的运营指标数据和历史对话记忆。
*   **阶段三：大模型推理与工具调用**：Agent 将“用户问题 + 数据库提取的实时指标 + 系统人设 Prompt”打包发送给大语言模型（LLM）。大模型生成结构化的回复文本，并在文本中标记情绪和动画指令（例如：`{text: "今天的数据增长了20%！", emotion: "happy", action: "wave_hand"}`）。
*   **阶段四：执行结果与渲染**：Agent 拦截大模型的输出，首先调用声音克隆 TTS 模型（GPT-SoVITS）按当前用户的声线渲染音频，其次在前端唤醒 Three.js，将音频包与 3D 口型同步混合器绑定，最后在网页上呈现出栩栩如生的数字分身，让其声形并茂地向用户做出答复。
