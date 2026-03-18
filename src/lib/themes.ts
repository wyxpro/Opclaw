// Theme Configuration - 5 Theme Styles

export type ThemeType = 'minimal' | 'cyber' | 'artistic' | 'cartoon' | 'retro'

export interface ThemeConfig {
  id: ThemeType
  name: string
  description: string
  icon: string
  colors: {
    // Background colors
    bg: string
    bgAlt: string
    surface: string
    surfaceAlt: string
    card: string
    cardHover: string
    // Primary colors
    primary: string
    primaryGlow: string
    primaryDim: string
    primaryMuted: string
    // Accent colors
    accent: string
    accentGlow: string
    accentDim: string
    // Semantic colors
    rose: string
    cyan: string
    emerald: string
    sky: string
    // Text colors
    text: string
    textSecondary: string
    textMuted: string
    textDim: string
    // Border colors
    border: string
    borderLight: string
  }
  fonts: {
    sans: string
    mono: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    glow: string
    card: string
    cardHover: string
    float: string
  }
  glassEffect: {
    background: string
    border: string
    backdropBlur: string
  }
}

export const themes: Record<ThemeType, ThemeConfig> = {
  // 1. 浅色极简风格
  minimal: {
    id: 'minimal',
    name: '极简',
    description: '白色米白主色调，简洁线条',
    icon: '◐',
    colors: {
      bg: '#fafafa',
      bgAlt: '#f5f5f5',
      surface: '#ffffff',
      surfaceAlt: '#f0f0f0',
      card: '#ffffff',
      cardHover: '#f8f8f8',
      primary: '#2563eb',
      primaryGlow: '#3b82f6',
      primaryDim: '#1d4ed8',
      primaryMuted: 'rgba(37, 99, 235, 0.1)',
      accent: '#f59e0b',
      accentGlow: '#fbbf24',
      accentDim: '#d97706',
      rose: '#f43f5e',
      cyan: '#06b6d4',
      emerald: '#10b981',
      sky: '#0ea5e9',
      text: '#1a1a1a',
      textSecondary: '#4a4a4a',
      textMuted: '#6b7280',
      textDim: '#9ca3af',
      border: '#e5e5e5',
      borderLight: '#f0f0f0',
    },
    fonts: {
      sans: "'Inter', 'Noto Sans SC', system-ui, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    shadows: {
      glow: '0 0 30px rgba(37, 99, 235, 0.1)',
      card: '0 2px 12px rgba(0, 0, 0, 0.06)',
      cardHover: '0 8px 30px rgba(0, 0, 0, 0.1)',
      float: '0 20px 60px rgba(0, 0, 0, 0.12)',
    },
    glassEffect: {
      background: 'rgba(255, 255, 255, 0.8)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      backdropBlur: 'blur(20px)',
    },
  },

  // 2. 深色赛博感风格
  cyber: {
    id: 'cyber',
    name: '赛博',
    description: '霓虹紫蓝渐变，未来科技感',
    icon: '◉',
    colors: {
      bg: '#0f0a1e',
      bgAlt: '#16102a',
      surface: '#1a1430',
      surfaceAlt: '#221a3d',
      card: '#251d42',
      cardHover: '#2d2452',
      primary: '#00d4ff',
      primaryGlow: '#5ce1ff',
      primaryDim: '#00a8cc',
      primaryMuted: 'rgba(0, 212, 255, 0.15)',
      accent: '#a855f7',
      accentGlow: '#c084fc',
      accentDim: '#7c3aed',
      rose: '#f43f5e',
      cyan: '#00d4ff',
      emerald: '#00e5a0',
      sky: '#38bdf8',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textDim: '#64748b',
      border: 'rgba(139, 92, 246, 0.25)',
      borderLight: 'rgba(139, 92, 246, 0.15)',
    },
    fonts: {
      sans: "'Inter', 'Noto Sans SC', system-ui, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    borderRadius: {
      sm: '6px',
      md: '10px',
      lg: '14px',
      xl: '18px',
      full: '9999px',
    },
    shadows: {
      glow: '0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(168, 85, 247, 0.15)',
      card: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.1)',
      cardHover: '0 8px 40px rgba(0, 212, 255, 0.2), 0 0 0 1px rgba(168, 85, 247, 0.2)',
      float: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 212, 255, 0.1)',
    },
    glassEffect: {
      background: 'rgba(26, 20, 48, 0.75)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      backdropBlur: 'blur(20px)',
    },
  },

  // 3. 艺术风格
  artistic: {
    id: 'artistic',
    name: '艺术',
    description: '柔和渐变色彩，优雅字体',
    icon: '❋',
    colors: {
      bg: '#fef7f0',
      bgAlt: '#fdf2e9',
      surface: '#fff8f3',
      surfaceAlt: '#ffefe5',
      card: '#ffffff',
      cardHover: '#fff5ed',
      primary: '#e85d75',
      primaryGlow: '#f08a9e',
      primaryDim: '#d43d5c',
      primaryMuted: 'rgba(232, 93, 117, 0.12)',
      accent: '#f4a261',
      accentGlow: '#f6b584',
      accentDim: '#e08c4a',
      rose: '#e85d75',
      cyan: '#2a9d8f',
      emerald: '#57a773',
      sky: '#4a90e2',
      text: '#2d3436',
      textSecondary: '#636e72',
      textMuted: '#7f8c8d',
      textDim: '#b2bec3',
      border: '#f0e6dc',
      borderLight: '#f5ebe3',
    },
    fonts: {
      sans: "'Playfair Display', 'Noto Serif SC', Georgia, serif",
      mono: "'Fira Code', monospace",
    },
    borderRadius: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      full: '9999px',
    },
    shadows: {
      glow: '0 0 40px rgba(232, 93, 117, 0.15)',
      card: '0 4px 20px rgba(0, 0, 0, 0.05)',
      cardHover: '0 12px 40px rgba(232, 93, 117, 0.12)',
      float: '0 24px 60px rgba(0, 0, 0, 0.08)',
    },
    glassEffect: {
      background: 'rgba(255, 248, 243, 0.85)',
      border: '1px solid rgba(232, 93, 117, 0.1)',
      backdropBlur: 'blur(24px)',
    },
  },

  // 4. 童趣卡通风格
  cartoon: {
    id: 'cartoon',
    name: '童趣',
    description: '明亮活泼色彩，圆润边角',
    icon: '✿',
    colors: {
      bg: '#f0f9ff',
      bgAlt: '#e0f2fe',
      surface: '#ffffff',
      surfaceAlt: '#f5fbff',
      card: '#ffffff',
      cardHover: '#f0f9ff',
      primary: '#f472b6',
      primaryGlow: '#f9a8d4',
      primaryDim: '#ec4899',
      primaryMuted: 'rgba(244, 114, 182, 0.15)',
      accent: '#fbbf24',
      accentGlow: '#fcd34d',
      accentDim: '#f59e0b',
      rose: '#fb7185',
      cyan: '#22d3ee',
      emerald: '#4ade80',
      sky: '#60a5fa',
      text: '#374151',
      textSecondary: '#4b5563',
      textMuted: '#6b7280',
      textDim: '#9ca3af',
      border: '#dbeafe',
      borderLight: '#eff6ff',
    },
    fonts: {
      sans: "'Nunito', 'Noto Sans SC', 'Comic Sans MS', cursive, sans-serif",
      mono: "'Fira Code', monospace",
    },
    borderRadius: {
      sm: '12px',
      md: '20px',
      lg: '28px',
      xl: '36px',
      full: '9999px',
    },
    shadows: {
      glow: '0 0 30px rgba(244, 114, 182, 0.2)',
      card: '0 4px 0 rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)',
      cardHover: '0 6px 0 rgba(0, 0, 0, 0.1), 0 12px 30px rgba(244, 114, 182, 0.15)',
      float: '0 8px 0 rgba(0, 0, 0, 0.1), 0 20px 50px rgba(0, 0, 0, 0.15)',
    },
    glassEffect: {
      background: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid rgba(244, 114, 182, 0.2)',
      backdropBlur: 'blur(16px)',
    },
  },

  // 5. 复古风格
  retro: {
    id: 'retro',
    name: '复古',
    description: '暖黄棕色系，老式排版',
    icon: '✤',
    colors: {
      bg: '#f5f0e6',
      bgAlt: '#ebe4d6',
      surface: '#faf7f2',
      surfaceAlt: '#f2ede3',
      card: '#fffef9',
      cardHover: '#f9f6f0',
      primary: '#8b6914',
      primaryGlow: '#a67c00',
      primaryDim: '#6b4e0a',
      primaryMuted: 'rgba(139, 105, 20, 0.12)',
      accent: '#c75b39',
      accentGlow: '#d4704f',
      accentDim: '#a84a2d',
      rose: '#c75b39',
      cyan: '#5a7a6a',
      emerald: '#6b8e6b',
      sky: '#6b8fa8',
      text: '#3d3830',
      textSecondary: '#5c5548',
      textMuted: '#7a7263',
      textDim: '#a09988',
      border: '#d9d0c1',
      borderLight: '#e8e2d6',
    },
    fonts: {
      sans: "'Merriweather', 'Noto Serif SC', Georgia, serif",
      mono: "'Courier New', monospace",
    },
    borderRadius: {
      sm: '2px',
      md: '4px',
      lg: '6px',
      xl: '8px',
      full: '9999px',
    },
    shadows: {
      glow: '0 0 20px rgba(139, 105, 20, 0.15)',
      card: '3px 3px 0 rgba(139, 105, 20, 0.2), 0 4px 12px rgba(0, 0, 0, 0.08)',
      cardHover: '4px 4px 0 rgba(139, 105, 20, 0.25), 0 8px 24px rgba(0, 0, 0, 0.12)',
      float: '5px 5px 0 rgba(139, 105, 20, 0.2), 0 20px 40px rgba(0, 0, 0, 0.15)',
    },
    glassEffect: {
      background: 'rgba(250, 247, 242, 0.9)',
      border: '1px solid rgba(139, 105, 20, 0.15)',
      backdropBlur: 'blur(12px)',
    },
  },
}

export const defaultTheme: ThemeType = 'minimal'

export const themeList = Object.values(themes)
