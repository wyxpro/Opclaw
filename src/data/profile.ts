import type { 
  PersonalProfile, 
  PortfolioItem, 
  SkillCategory, 
  ModuleEntry,
  ProfileStats,
  HobbyItem,
  ContactConfig
} from '../types/profile'

// 个人资料数据
export const personalProfile: PersonalProfile = {
  name: '晓叶',
  title: '全栈开发工程师 & AI 研究员',
  bio: '热爱技术与设计的全栈开发者，专注于人工智能、Web 开发和用户体验设计。致力于创造优雅且实用的数字产品，一起加油💪',
  skillsBio: '多维度可视化数据呈现你的技能矩阵',
  avatar: '/vibe_images/avatar_1771416390.png',
  coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80',
  location: '中国 · 杭州',
  email: 'wyxcode@qq.com',
  phone: '+86 138 **** 8888',
  website: 'https://xiaoyu.dev',
  socialLinks: [
    {
      platform: 'qq',
      url: 'tencent://message/?uin=123456789',
      username: '123456789',
      displayName: 'QQ'
    },
    {
      platform: 'wechat',
      url: '#',
      username: 'xiaoye_dev',
      displayName: '微信'
    },
    {
      platform: 'douyin',
      url: 'https://v.douyin.com/abc',
      username: 'xiaoye',
      displayName: '抖音'
    },
    {
      platform: 'xiaohongshu',
      url: 'https://www.xiaohongshu.com/user/profile/123',
      username: '晓叶',
      displayName: '小红书'
    },
    {
      platform: 'weibo',
      url: 'https://weibo.com/zhangxiaoyu',
      username: '晓叶Dev',
      displayName: '微博'
    },
    {
      platform: 'bilibili',
      url: 'https://space.bilibili.com/346710742',
      username: '晓叶的代码世界',
      displayName: '哔哩哔哩'
    }
  ],
  achievements: [
    {
      id: '1',
      title: '开源贡献者',
      description: '为多个知名开源项目贡献代码',
      icon: '🏆',
      date: '2024',
      color: '#FFD700'
    },
    {
      id: '2',
      title: '技术博主',
      description: '发布 50+ 篇高质量技术文章',
      icon: '✍️',
      date: '2024',
      color: '#4A90E2'
    },
    {
      id: '3',
      title: '全栈认证',
      description: '获得 AWS 解决方案架构师认证',
      icon: '📜',
      date: '2023',
      color: '#FF6B6B'
    },
    {
      id: '4',
      title: '黑客马拉松',
      description: '获得全国 AI 应用创新大赛金奖',
      icon: '🥇',
      date: '2023',
      color: '#50C878'
    }
  ],
  stats: {
    yearsOfExperience: 5,
    projectsCompleted: 50,
    happyClients: 30,
    awards: 8,
    totalSkills: 20,
    masteredSkills: 14,
    avgLevel: 83,
    learningHours: '2000h+'
  },
  skillsRadar: [
    { name: '前端开发', score: 90, color: '#3B82F6' },
    { name: '后端开发', score: 85, color: '#10B981' },
    { name: 'AI/ML', score: 82, color: '#8B5CF6' },
    { name: 'DevOps', score: 78, color: '#F59E0B' },
    { name: 'UI设计', score: 75, color: '#EC4899' },
    { name: '产品思维', score: 80, color: '#06B6D4' }
  ]
}

// 技能数据
export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    name: '前端开发',
    icon: '🎨',
    color: '#3B82F6',
    skills: [
      { id: 'react', name: 'React / Next.js', level: 95, category: 'frontend', color: '#61DAFB' },
      { id: 'vue', name: 'Vue.js', level: 88, category: 'frontend', color: '#4FC08D' },
      { id: 'typescript', name: 'TypeScript', level: 92, category: 'frontend', color: '#3178C6' },
      { id: 'tailwind', name: 'Tailwind CSS', level: 90, category: 'frontend', color: '#06B6D4' },
      { id: 'threejs', name: 'Three.js / WebGL', level: 75, category: 'frontend', color: '#000000' }
    ]
  },
  {
    id: 'backend',
    name: '后端开发',
    icon: '⚙️',
    color: '#10B981',
    skills: [
      { id: 'nodejs', name: 'Node.js', level: 90, category: 'backend', color: '#339933' },
      { id: 'python', name: 'Python', level: 85, category: 'backend', color: '#3776AB' },
      { id: 'go', name: 'Go', level: 78, category: 'backend', color: '#00ADD8' },
      { id: 'postgresql', name: 'PostgreSQL', level: 82, category: 'backend', color: '#336791' },
      { id: 'redis', name: 'Redis', level: 80, category: 'backend', color: '#DC382D' }
    ]
  },
  {
    id: 'ai',
    name: '人工智能',
    icon: '🤖',
    color: '#8B5CF6',
    skills: [
      { id: 'llm', name: '大语言模型', level: 88, category: 'ai', color: '#FF6B6B' },
      { id: 'pytorch', name: 'PyTorch', level: 82, category: 'ai', color: '#EE4C2C' },
      { id: 'tensorflow', name: 'TensorFlow', level: 75, category: 'ai', color: '#FF6F00' },
      { id: 'nlp', name: '自然语言处理', level: 85, category: 'ai', color: '#4A90E2' },
      { id: 'cv', name: '计算机视觉', level: 70, category: 'ai', color: '#50C878' }
    ]
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: '🚀',
    color: '#F59E0B',
    skills: [
      { id: 'docker', name: 'Docker', level: 88, category: 'devops', color: '#2496ED' },
      { id: 'kubernetes', name: 'Kubernetes', level: 75, category: 'devops', color: '#326CE5' },
      { id: 'aws', name: 'AWS / 阿里云', level: 82, category: 'devops', color: '#FF9900' },
      { id: 'cicd', name: 'CI/CD', level: 85, category: 'devops', color: '#2088FF' },
      { id: 'terraform', name: 'Terraform', level: 70, category: 'devops', color: '#7B42BC' }
    ]
  }
]

// 项目作品数据
export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'AI 智能助手平台',
    description: '基于大语言模型的智能对话平台，支持多轮对话、知识库检索和自定义 Agent 开发。采用 React + FastAPI 架构，支持实时流式响应。',
    category: 'ai',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    tags: ['React', 'TypeScript', 'Python', 'LLM', 'FastAPI'],
    date: '2024-03',
    featured: true,
    link: '#',
    github: '#'
  },
  {
    id: '2',
    title: '电商数据分析平台',
    description: '为电商企业打造的数据可视化分析平台，提供实时销售监控、用户行为分析和智能推荐功能。',
    category: 'web',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['Vue.js', 'ECharts', 'Node.js', 'MongoDB'],
    date: '2024-01',
    featured: true,
    link: '#',
    github: '#'
  },
  {
    id: '3',
    title: '移动端社交 App',
    description: '面向年轻人的兴趣社交平台，支持实时聊天、动态发布和兴趣小组功能。',
    category: 'mobile',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    tags: ['React Native', 'Firebase', 'Redux'],
    date: '2023-11',
    link: '#',
    github: '#'
  },
  {
    id: '4',
    title: '品牌视觉识别系统',
    description: '为科技初创公司设计的完整品牌视觉识别系统，包括 Logo、配色方案和 UI 设计规范。',
    category: 'design',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    tags: ['Figma', 'Illustrator', 'Brand Design'],
    date: '2023-09',
    link: '#'
  },
  {
    id: '5',
    title: '深度学习图像识别系统',
    description: '基于 CNN 的图像分类系统，支持 100+ 种物体识别，准确率达到 95% 以上。',
    category: 'ai',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    tags: ['Python', 'PyTorch', 'OpenCV', 'Docker'],
    date: '2023-08',
    featured: true,
    github: '#'
  },
  {
    id: '6',
    title: '微服务架构重构',
    description: '将单体应用重构为微服务架构，提升系统可扩展性和维护性，降低 40% 的服务器成本。',
    category: 'web',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    tags: ['Kubernetes', 'Go', 'gRPC', 'Istio'],
    date: '2023-06',
    github: '#'
  }
]

// 功能模块入口数据
export const moduleEntries: ModuleEntry[] = [
  {
    id: 'resume',
    title: '在线简历',
    description: '专业的在线简历展示，支持 PDF 导出',
    icon: 'FileText',
    path: '/learning',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['技能展示', '项目经历', '教育背景', 'PDF导出']
  },
  {
    id: 'articles',
    title: '文章博客',
    description: '技术文章和知识分享，支持 Markdown 编辑',
    icon: 'BookOpen',
    path: '/learning',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-500',
    features: ['Markdown', '代码高亮', '标签管理', '全文搜索']
  },
  {
    id: 'ai-assistant',
    title: 'AI 助手',
    description: '智能 AI 助手，辅助学习和创作',
    icon: 'Bot',
    path: '/learning',
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-500',
    features: ['智能对话', '代码辅助', '文档分析', '知识问答']
  },
  {
    id: 'skilltree',
    title: '技能树',
    description: '可视化技能学习和成长路径',
    icon: 'GitBranch',
    path: '/learning',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    features: ['技能雷达', '知识图谱', '学习进度', '3D可视化']
  },
  {
    id: 'moments',
    title: '朋友圈',
    description: '分享生活点滴，记录美好瞬间',
    icon: 'MessageCircle',
    path: '/life',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    features: ['图文动态', '视频分享', '好友互动', '评论点赞']
  },
  {
    id: 'travel',
    title: '旅拍相册',
    description: '记录美好的旅行时光和风景',
    icon: 'Camera',
    path: '/life',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    features: ['地图标记', '照片墙', '路线规划', '足迹统计']
  },
  {
    id: 'love',
    title: '恋爱记录',
    description: '甜蜜的恋爱时光和纪念日',
    icon: 'Heart',
    path: '/life',
    color: '#F43F5E',
    gradient: 'from-rose-500 to-red-500',
    features: ['纪念日', '时光相册', '愿望清单', '祝福墙']
  },
  {
    id: 'sports',
    title: '运动',
    description: '记录运动数据，保持健康生活方式',
    icon: 'Dumbbell',
    path: '/life',
    color: '#84CC16',
    gradient: 'from-lime-500 to-green-500',
    features: ['运动记录', '数据统计', '目标设定', '健康报告']
  },
  {
    id: 'music',
    title: '音乐盒',
    description: '收藏喜爱的音乐和歌单',
    icon: 'Music',
    path: '/life?tab=music',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-blue-500',
    features: ['黑胶播放', '歌单管理', '本地导入', '可视化']
  },
  {
    id: 'movies',
    title: '收藏电影',
    description: '电影收藏和观影记录',
    icon: 'Film',
    path: '/life?tab=movies',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-violet-500',
    features: ['评分系统', '观影记录', '推荐算法', '海报墙']
  },
  {
    id: 'bookmarks',
    title: '百宝箱',
    description: '收藏有用的工具和资源链接',
    icon: 'Bookmark',
    path: '/life?tab=bookmarks',
    color: '#14B8A6',
    gradient: 'from-teal-500 to-emerald-500',
    features: ['分类管理', '快速搜索', '标签系统', '链接预览']
  }
]

// 统计数据
export const profileStats: ProfileStats[] = [
  {
    label: '年经验',
    value: 5,
    suffix: '+',
    icon: 'Calendar',
    color: '#3B82F6'
  },
  {
    label: '完成项目',
    value: 50,
    suffix: '+',
    icon: 'Briefcase',
    color: '#10B981'
  },
  {
    label: '满意客户',
    value: 30,
    suffix: '+',
    icon: 'Users',
    color: '#F59E0B'
  },
  {
    label: '获得荣誉',
    value: 8,
    suffix: '',
    icon: 'Award',
    color: '#8B5CF6'
  }
]


// 兴趣爱好数据
export const hobbiesData: HobbyItem[] = [
  {
    id: 'sports',
    title: '运动健身',
    description: '保持活力，挑战自我，享受运动带来的快乐与健康',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    icon: 'Dumbbell',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-500',
    stats: [
      { label: '坚持天数', value: '365+', icon: 'Clock' },
      { label: '喜爱项目', value: '跑步、游泳', icon: 'Target' },
      { label: '消耗热量', value: '50万+', icon: 'Zap' }
    ],
    highlights: ['马拉松', '游泳', '健身', '瑜伽'],
    details: {
      fullDescription: '运动是我生活中不可或缺的一部分。通过坚持运动，我不仅保持了良好的身体状态，更培养了坚韧不拔的意志力。从最初的几百米到现在的马拉松，每一步都是对自己的挑战和超越。',
      achievements: ['完成人生第一个半程马拉松', '坚持晨跑365天不间断', '学会自由泳和蛙泳', '获得健身初级教练认证'],
      goals: ['完成全程马拉松', '学会冲浪', '挑战铁人三项', '攀登一座雪山'],
      favoriteItems: ['Nike Zoom Fly 跑鞋', 'Garmin 运动手表', 'AirPods Pro', 'Lululemon 运动服']
    }
  },
  {
    id: 'travel',
    title: '旅游探索',
    description: '用脚步丈量世界，用镜头记录美好，探索未知的风景',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    icon: 'Plane',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
    stats: [
      { label: '已访城市', value: '20+', icon: 'MapPin' },
      { label: '足迹遍布', value: '5个国家', icon: 'Target' },
      { label: '拍摄照片', value: '1万+', icon: 'Zap' }
    ],
    highlights: ['自然风光', '人文古迹', '美食之旅', '摄影'],
    details: {
      fullDescription: '旅行让我看到了世界的广阔和多样性。每一次出行都是一次心灵的洗礼，让我在陌生的环境中发现新的自己。用镜头记录下那些美好的瞬间，成为最珍贵的回忆。',
      achievements: ['独自完成西藏自驾游', '在冰岛看到极光', '登上富士山顶', '品尝过20+国家的特色美食'],
      goals: ['环游世界七大洲', '在撒哈拉沙漠露营', '探访南极', '学习潜水证'],
      favoriteItems: ['Sony A7M4 相机', 'DJI Mini 无人机', 'Osprey 背包', 'Kindle 电子书']
    }
  },
  {
    id: 'food',
    title: '美食烹饪',
    description: '品味人间烟火，探索味蕾的无限可能，享受美食时光',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    icon: 'UtensilsCrossed',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    stats: [
      { label: '拿手菜品', value: '30+', icon: 'ChefHat' },
      { label: '探索菜系', value: '8大菜系', icon: 'Target' },
      { label: '探店数量', value: '200+', icon: 'Zap' }
    ],
    highlights: ['中式料理', '烘焙甜点', '咖啡品鉴', '探店'],
    details: {
      fullDescription: '美食是生活中最美好的享受之一。从品尝到自己动手制作，每一道菜都承载着对食材的尊重和对味道的追求。无论是家常小炒还是精致甜点，都能带给我满满的成就感。',
      achievements: ['成功复刻米其林餐厅菜品', '学会拉花艺术', '举办家庭美食派对', '建立个人食谱博客'],
      goals: ['学习法式料理', '考取咖啡师证书', '出版个人食谱', '开一家小餐馆'],
      favoriteItems: ['Le Creuset 珐琅锅', 'KitchenAid 厨师机', 'Breville 咖啡机', '藤次郎菜刀']
    }
  },
  {
    id: 'gaming',
    title: '游戏娱乐',
    description: '在虚拟世界中冒险，体验精彩故事，放松身心',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    icon: 'Gamepad2',
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-500',
    stats: [
      { label: '游戏时长', value: '1000+', icon: 'Clock' },
      { label: '喜爱类型', value: 'RPG、策略', icon: 'Target' },
      { label: '通关游戏', value: '50+', icon: 'Zap' }
    ],
    highlights: ['单机大作', '独立游戏', '桌游', '电竞'],
    details: {
      fullDescription: '游戏是我放松和娱乐的重要方式。在虚拟世界中，我可以成为任何人，体验不同的故事和冒险。从3A大作到独立精品，每一款好游戏都是一件艺术品，值得细细品味。',
      achievements: ['全成就通关《塞尔达传说》', '组建自己的电竞战队', '参加桌游马拉松24小时', '直播游戏收获1万粉丝'],
      goals: ['开发自己的独立游戏', '参加国际电竞比赛', '收集100款经典游戏', '建立游戏主题房间'],
      favoriteItems: ['PS5 游戏主机', 'Nintendo Switch', 'Steam Deck', 'Secretlab 电竞椅']
    }
  }
]

// 联系方式配置
export const contactConfig: ContactConfig = {
  formTitle: '发送消息',
  qrCodes: [
    {
      platform: 'wechat',
      label: '微信号',
      description: '交个朋友呀',
      image: '/vibe_images/wx.jpg',
      icon: 'MessageCircle',
      color: '#07C160'
    },
    {
      platform: 'douyin',
      label: '抖音号',
      description: '我的日常生活',
      image: '/vibe_images/dy.jpg',
      icon: 'Video',
      color: '#000000'
    }
  ]
}

// 所有标签
export const allTags = Array.from(
  new Set(portfolioItems.flatMap(item => item.tags))
).sort()
