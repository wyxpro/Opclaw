// AI人工智能领域技能树数据

export interface SkillNode {
  id: string
  name: string
  level: number // 0-100
  description: string
  children?: SkillNode[]
  dependencies?: string[]
  category: 'foundation' | 'ml' | 'dl' | 'nlp' | 'cv' | 'rl' | 'deployment'
}

export interface SkillDimension {
  name: string
  score: number
  fullMark: number
  color: string
}

export interface SkillCategory {
  id: string
  name: string
  icon: string
  color: string
  skills: SkillNode[]
}

// 雷达图维度数据
export const radarDimensions: SkillDimension[] = [
  { name: '机器学习', score: 85, fullMark: 100, color: '#8b5cf6' },
  { name: '深度学习', score: 78, fullMark: 100, color: '#ec4899' },
  { name: '自然语言处理', score: 82, fullMark: 100, color: '#3b82f6' },
  { name: '计算机视觉', score: 70, fullMark: 100, color: '#10b981' },
  { name: '强化学习', score: 65, fullMark: 100, color: '#f59e0b' },
  { name: '模型部署', score: 75, fullMark: 100, color: '#06b6d4' },
]

// 技能统计数据
export const skillStats = {
  totalSkills: 156,
  masteredSkills: 89,
  learningSkills: 42,
  plannedSkills: 25,
  totalHours: 1248,
  certificates: 12,
  projects: 28,
}

// 技能分类数据
export const skillCategories: SkillCategory[] = [
  {
    id: 'foundation',
    name: '基础理论',
    icon: '📚',
    color: '#8b5cf6',
    skills: [
      {
        id: 'math',
        name: '数学基础',
        level: 90,
        category: 'foundation',
        description: '线性代数、微积分、概率统计',
        children: [
          { id: 'linear-algebra', name: '线性代数', level: 92, category: 'foundation', description: '矩阵运算、特征分解、SVD' },
          { id: 'calculus', name: '微积分', level: 88, category: 'foundation', description: '梯度、偏导数、链式法则' },
          { id: 'probability', name: '概率统计', level: 90, category: 'foundation', description: '概率分布、假设检验、贝叶斯' },
        ],
      },
      {
        id: 'python',
        name: 'Python编程',
        level: 95,
        category: 'foundation',
        description: 'Python基础、数据结构、算法',
      },
      {
        id: 'data-processing',
        name: '数据处理',
        level: 88,
        category: 'foundation',
        description: 'NumPy, Pandas, 数据清洗',
      },
    ],
  },
  {
    id: 'ml',
    name: '机器学习',
    icon: '🤖',
    color: '#ec4899',
    skills: [
      {
        id: 'supervised',
        name: '监督学习',
        level: 88,
        category: 'ml',
        description: '分类、回归算法',
        children: [
          { id: 'linear-regression', name: '线性回归', level: 95, category: 'ml', description: '简单/多元线性回归' },
          { id: 'logistic-regression', name: '逻辑回归', level: 90, category: 'ml', description: '二分类、多分类' },
          { id: 'svm', name: '支持向量机', level: 85, category: 'ml', description: 'SVM、核方法' },
          { id: 'random-forest', name: '随机森林', level: 88, category: 'ml', description: '集成学习、Bagging' },
          { id: 'xgboost', name: 'XGBoost', level: 82, category: 'ml', description: '梯度提升树' },
        ],
      },
      {
        id: 'unsupervised',
        name: '无监督学习',
        level: 80,
        category: 'ml',
        description: '聚类、降维',
        children: [
          { id: 'kmeans', name: 'K-Means', level: 90, category: 'ml', description: 'K均值聚类' },
          { id: 'pca', name: 'PCA', level: 85, category: 'ml', description: '主成分分析' },
          { id: 'clustering', name: '层次聚类', level: 75, category: 'ml', description: 'Agglomerative Clustering' },
        ],
      },
    ],
  },
  {
    id: 'dl',
    name: '深度学习',
    icon: '🧠',
    color: '#3b82f6',
    skills: [
      {
        id: 'neural-networks',
        name: '神经网络基础',
        level: 85,
        category: 'dl',
        description: '前馈网络、反向传播',
        children: [
          { id: 'mlp', name: '多层感知机', level: 90, category: 'dl', description: 'MLP、全连接层' },
          { id: 'activation', name: '激活函数', level: 88, category: 'dl', description: 'ReLU, Sigmoid, Tanh' },
          { id: 'optimization', name: '优化算法', level: 85, category: 'dl', description: 'SGD, Adam, RMSprop' },
        ],
      },
      {
        id: 'cnn',
        name: '卷积神经网络',
        level: 82,
        category: 'dl',
        description: 'CNN架构、图像特征提取',
        children: [
          { id: 'convolution', name: '卷积层', level: 88, category: 'dl', description: '卷积操作、填充、步长' },
          { id: 'pooling', name: '池化层', level: 85, category: 'dl', description: 'MaxPool, AvgPool' },
          { id: 'resnet', name: 'ResNet', level: 78, category: 'dl', description: '残差网络' },
        ],
      },
      {
        id: 'rnn',
        name: '循环神经网络',
        level: 80,
        category: 'dl',
        description: 'RNN、LSTM、GRU',
        children: [
          { id: 'lstm', name: 'LSTM', level: 82, category: 'dl', description: '长短期记忆网络' },
          { id: 'gru', name: 'GRU', level: 80, category: 'dl', description: '门控循环单元' },
          { id: 'seq2seq', name: 'Seq2Seq', level: 75, category: 'dl', description: '序列到序列' },
        ],
      },
      {
        id: 'transformers',
        name: 'Transformer',
        level: 88,
        category: 'dl',
        description: '注意力机制、Transformer架构',
        children: [
          { id: 'attention', name: '注意力机制', level: 90, category: 'dl', description: 'Self-Attention' },
          { id: 'bert', name: 'BERT', level: 85, category: 'dl', description: '双向编码器' },
          { id: 'gpt', name: 'GPT系列', level: 88, category: 'dl', description: '生成式预训练' },
        ],
      },
    ],
  },
  {
    id: 'nlp',
    name: '自然语言处理',
    icon: '💬',
    color: '#10b981',
    skills: [
      {
        id: 'text-processing',
        name: '文本处理',
        level: 90,
        category: 'nlp',
        description: '分词、词性标注、NER',
        children: [
          { id: 'tokenization', name: '分词', level: 92, category: 'nlp', description: 'Tokenization' },
          { id: 'ner', name: '命名实体识别', level: 85, category: 'nlp', description: 'NER' },
          { id: 'pos', name: '词性标注', level: 88, category: 'nlp', description: 'POS Tagging' },
        ],
      },
      {
        id: 'word-embeddings',
        name: '词向量',
        level: 88,
        category: 'nlp',
        description: 'Word2Vec, GloVe, FastText',
      },
      {
        id: 'llm',
        name: '大语言模型',
        level: 85,
        category: 'nlp',
        description: 'LLM应用与微调',
        children: [
          { id: 'prompt-engineering', name: '提示工程', level: 90, category: 'nlp', description: 'Prompt Engineering' },
          { id: 'fine-tuning', name: '模型微调', level: 82, category: 'nlp', description: 'Fine-tuning' },
          { id: 'rag', name: 'RAG', level: 80, category: 'nlp', description: '检索增强生成' },
        ],
      },
    ],
  },
  {
    id: 'cv',
    name: '计算机视觉',
    icon: '👁️',
    color: '#f59e0b',
    skills: [
      {
        id: 'image-processing',
        name: '图像处理',
        level: 78,
        category: 'cv',
        description: '滤波、边缘检测、形态学',
      },
      {
        id: 'object-detection',
        name: '目标检测',
        level: 75,
        category: 'cv',
        description: 'YOLO, Faster R-CNN',
      },
      {
        id: 'image-segmentation',
        name: '图像分割',
        level: 70,
        category: 'cv',
        description: '语义分割、实例分割',
      },
    ],
  },
  {
    id: 'deployment',
    name: '模型部署',
    icon: '🚀',
    color: '#06b6d4',
    skills: [
      {
        id: 'frameworks',
        name: '深度学习框架',
        level: 88,
        category: 'deployment',
        description: 'PyTorch, TensorFlow',
        children: [
          { id: 'pytorch', name: 'PyTorch', level: 92, category: 'deployment', description: '动态图、自动求导' },
          { id: 'tensorflow', name: 'TensorFlow', level: 80, category: 'deployment', description: '静态图、Keras' },
          { id: 'huggingface', name: 'HuggingFace', level: 88, category: 'deployment', description: 'Transformers库' },
        ],
      },
      {
        id: 'model-optimization',
        name: '模型优化',
        level: 75,
        category: 'deployment',
        description: '量化、剪枝、蒸馏',
      },
      {
        id: 'serving',
        name: '模型服务',
        level: 78,
        category: 'deployment',
        description: 'ONNX, TensorRT, FastAPI',
      },
    ],
  },
]

// 技能进度数据
export const skillProgress = [
  { month: '1月', ml: 45, dl: 30, nlp: 35, cv: 25 },
  { month: '2月', ml: 52, dl: 38, nlp: 42, cv: 30 },
  { month: '3月', ml: 58, dl: 45, nlp: 48, cv: 35 },
  { month: '4月', ml: 65, dl: 52, nlp: 55, cv: 42 },
  { month: '5月', ml: 72, dl: 60, nlp: 62, cv: 50 },
  { month: '6月', ml: 78, dl: 68, nlp: 70, cv: 58 },
  { month: '7月', ml: 82, dl: 75, nlp: 76, cv: 65 },
  { month: '8月', ml: 85, dl: 78, nlp: 82, cv: 70 },
]

// 最近学习记录
export const recentLearning = [
  { skill: 'Transformer架构', date: '2025-02-20', progress: 95, category: '深度学习' },
  { skill: 'BERT微调实战', date: '2025-02-18', progress: 88, category: 'NLP' },
  { skill: 'PyTorch分布式训练', date: '2025-02-15', progress: 72, category: '部署' },
  { skill: '注意力机制详解', date: '2025-02-12', progress: 90, category: '深度学习' },
  { skill: 'RAG系统构建', date: '2025-02-10', progress: 65, category: 'NLP' },
]
