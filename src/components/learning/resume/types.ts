export interface PersonalInfo {
  name: string
  title: string
  age: number
  location: string
  phone: string
  email: string
  github: string
  avatar?: string
}

export interface Advantage {
  id: string
  content: string
}

export interface Skill {
  id: string
  category: string
  items: string[]
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  isCurrent: boolean
  responsibilities: string[]
}

export interface Project {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  techStack: string
  highlights: string[]
  link?: string
}

export interface Education {
  id: string
  school: string
  major: string
  degree: string
  achievements: string[]
}

export interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  advantages: Advantage[]
  skills: Skill[]
  workExperiences: WorkExperience[]
  projects: Project[]
  education: Education[]
  socialLinks: SocialLink[]
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '晓叶',
    title: 'AI大模型/Agent工程师',
    age: 23,
    location: '杭州',
    phone: '18323765634',
    email: 'wyxcide@qq.com',
    github: 'https://github.com/wyxpro/',
    avatar: '男',
  },
  advantages: [
    { id: '1', content: '杭州市第十五届计算机应用能力大赛 三等奖、创新项目奖' },
    { id: '2', content: 'GitHub 开源项目作者（ThriveX CMS 建站系统）Star 900+' },
    { id: '3', content: 'ThriveX CMS 建站系统 计算机软件著作权（申请中）' },
    { id: '4', content: '具备项目从 0 到 1 部署上线的经验' },
    { id: '5', content: '利用业余时间持续输出技术文章，目前在 CSDN 累计拥有 1700+ 粉丝' },
    { id: '6', content: '熟练 Spring Boot 以及 Express、Flask 等多种后端开发语言' },
    { id: '7', content: '能够独当一面，从 0 到 1 构建前端项目' }
  ],
  skills: [
    {
      id: '1',
      category: '前端基础',
      items: ['HTML5', 'CSS3', 'Flex', 'Scss', 'TailwindCSS', 'TypeScript', 'JavaScript', 'jQuery']
    },
    {
      id: '2',
      category: '前端框架',
      items: ['Vue2 / 3', 'React18', 'NextJS', 'Redux', 'Zustand', 'Pinia']
    },
    {
      id: '3',
      category: '后端技术',
      items: ['Spring Boot', 'Spring MVC', 'Mybatis Plus', 'Express', 'Flask']
    },
    {
      id: '4',
      category: '数据库',
      items: ['MySQL', 'SQL 优化']
    },
    {
      id: '5',
      category: '运维部署',
      items: ['Linux', 'Nginx', 'Docker', '宝塔面板', '1Panel']
    },
    {
      id: '6',
      category: '微服务',
      items: ['Spring Cloud', 'Nacos', 'OpenFeign', 'Gateway']
    }
  ],
  workExperiences: [
    {
      id: '1',
      company: '杭州 XXXX 数字科技有限公司',
      position: '前端负责人',
      startDate: '2024-07',
      endDate: '',
      isCurrent: true,
      responsibilities: [
        '带领前端团队完成日常项目的开发与迭代',
        '高质量完成项目交付与上线'
      ]
    },
    {
      id: '2',
      company: '成都 XX 科技有限公司',
      position: 'AI大模型/Agent工程师',
      startDate: '2024-05',
      endDate: '2024-06',
      isCurrent: false,
      responsibilities: [
        '负责公司内部 Todo 系统开发与改进',
        '采用 Electron 桌面软件开发框架'
      ]
    }
  ],
  projects: [
    {
      id: '1',
      name: 'ThriveX CMS 建站管理系统',
      role: '全栈开发（NextJS + Spring Boot）',
      startDate: '2023-03',
      endDate: '',
      isCurrent: true,
      description: 'ThriveX 是一个年轻、高颜值、全开源、永不收费的现代化 CMS 管理系统，项目组成是前端、控制端、后端，采用前后端分离开发式。',
      techStack: '前端: React、NextJS、TypeScript、Zustand、TailwindCSS、Scss、Next UI、Antd UI、Echarts、React Hook Form、Ahooks\n后端: Spring Boot、Mybatis Plus、MySQL、Qiniu、Swagger、Python、Flask、SQLAlchemy\n部署: Docker Compose 一键部署、Nginx 反向代理、SSL 证书',
      highlights: [
        '【AI】采用科大讯飞AI大模型实现文章续写、优化、总结、智能问答',
        '【权限】RBAC 权限管理，动态路由、按钮权限、多用户登录',
        '【地图】采用高德地图实现旅游足迹可视化等功能',
        '一个人完成产品、UI、前端、控制端、后端、数据库、测试以及项目部署上线',
        '项目代码全开源，GitHub 已有 1867 条 Commit 记录，收获 700+ Star'
      ],
      link: 'https://liuyuyang.net/'
    },
    {
      id: '2',
      name: '点点易付（DianDianPay）',
      role: 'AI大模型/Agent工程师',
      startDate: '2024-12',
      endDate: '',
      isCurrent: true,
      description: '点点易付专注打造一站式支付解决方案，通过安全可靠的支付通道和高效便捷的服务，助力全球商户拓展国际市场。',
      techStack: 'React、TypeScript、Zustand、TailwindCSS、Scss、Antd UI、Echarts、React Hook Form、Ahooks',
      highlights: [
        '项目高质量完成并上线，涨薪 2000 额外获得老板五位数奖金',
        '主导 jQuery 项目全面迁移至 React 生态',
        '使用 React-i18next 完成八国语言一键切换',
        '集成 Sentry 实现前端监控'
      ],
      link: 'https://diandianpay.com/'
    },
    {
      id: '3',
      name: 'Shopify 跨境电商结账页',
      role: 'AI大模型/Agent工程师',
      startDate: '2024-07',
      endDate: '2024-09',
      isCurrent: false,
      description: 'Shopify 结账页定制开发项目',
      techStack: 'React、TypeScript、Zustand、TailwindCSS、Scss、React Hook Form',
      highlights: [
        '主导 jQuery 项目全面迁移至 React 生态',
        '负责组件库架构设计',
        '使用 React-i18next 完成八国语言一键切换',
        '集成 Sentry 实现前端监控'
      ]
    }
  ],
  education: [
    {
      id: '1',
      school: '上海开放大学',
      major: '软件工程',
      degree: '本科',
      achievements: [
        '上海市计算机应用能力大赛三等奖',
        '上海开放大学创新项目奖',
        '二等奖学金',
        '计算机软件著作权'
      ]
    }
  ],
  socialLinks: [
    { id: '1', name: 'GitHub', url: 'https://github.com', icon: 'github' },
    { id: '2', name: 'CSDN 技术博客', url: 'https://csdn.net', icon: 'blog' },
    { id: '3', name: '开源项目作品', url: 'https://liuyuyang.net', icon: 'project' }
  ]
}
