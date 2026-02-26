import type { RAGContext } from '../components/ai/types'

//模拟的资产数据
const mockAssetData = {
  learning: [
    {
      id: 'learn-1',
      title: 'React Hooks完全指南',
      content: 'React Hooks是React 16.8引入的新特性，让我们可以在函数组件中使用state和其他React特性。常用的Hooks包括useState、useEffect、useContext等。',
      tags: ['React', '前端', 'JavaScript'],
      category: '技术教程'
    },
    {
      id: 'learn-2',
      title: 'TypeScript进阶技巧',
      content: 'TypeScript是JavaScript的超集，添加了静态类型检查。高级特性包括泛型、条件类型、映射类型等，能显著提升代码质量和开发体验。',
      tags: ['TypeScript', '前端', '编程'],
      category: '技术教程'
    }
  ],
  life: [
    {
      id: 'life-1',
      title: '深圳旅行日记',
      content: '在深圳度过了美好的一周，参观了世界之窗、欢乐谷等景点。深圳的现代化程度令人印象深刻，科技氛围浓厚。',
      tags: ['旅行', '深圳', '生活'],
      category: '旅行记录'
    }
  ],
  entertainment: [
    {
      id: 'ent-1',
      title: '最近听的音乐',
      content: '最近在循环播放一些轻音乐和电子音乐，特别喜欢Lo-fi hip hop类型。音乐能帮助我放松和专注工作。',
      tags: ['音乐', 'Lo-fi', '放松'],
      category: '音乐收藏'
    }
  ]
}

//简单的关键词提取
const extractKeywords = (text: string): string[] => {
  const stopWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']
  const cleanText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '')
  return cleanText
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.includes(word))
    .map(word => word.toLowerCase())
}

//计算文本相似度
const calculateSimilarity = (query: string, content: string): number => {
  const queryKeywords = extractKeywords(query)
  const contentKeywords = extractKeywords(content)
  
  if (queryKeywords.length === 0) return 0
  
  const matches = queryKeywords.filter(keyword => 
    contentKeywords.some(contentWord => 
      contentWord.includes(keyword) || keyword.includes(contentWord)
    )
  )
  
  return matches.length / queryKeywords.length
}

// RAG引擎核心类
export class RAGEngine {
  private index: Map<string, any[]> = new Map()

  constructor() {
    this.buildIndex()
  }

  //构建索引
  private buildIndex() {
    Object.entries(mockAssetData).forEach(([module, items]) => {
      this.index.set(module, items)
    })
  }

  //检索相关内容
  public search(query: string, topK: number = 3): RAGContext {
    const results: Array<{ content: string, module: string, similarity: number }> = []
    
    this.index.forEach((items, module) => {
      items.forEach(item => {
        const similarity = calculateSimilarity(query, item.content + ' ' + item.title)
        if (similarity > 0.1) {
          results.push({
            content: `${item.title}: ${item.content}`,
            module,
            similarity
          })
        }
      })
    })

    results.sort((a, b) => b.similarity - a.similarity)
    const topResults = results.slice(0, topK)

    return {
      relevantContent: topResults.map(r => r.content),
      sourceModules: [...new Set(topResults.map(r => r.module as any))],
      confidence: topResults.length > 0 ? topResults[0].similarity : 0
    }
  }

  // 生成基于检索的回复
  public generateResponse(query: string): string {
    const context = this.search(query)
    
    if (context.relevantContent.length === 0) {
      return this.getFallbackResponse(query)
    }

    const queryLower = query.toLowerCase()
    
    if (queryLower.includes('推荐') || queryLower.includes('建议')) {
      return this.generateRecommendationResponse(context)
    }
    
    if (queryLower.includes('怎么') || queryLower.includes('如何')) {
      return this.generateHowToResponse(context)
    }
    
    if (queryLower.includes('什么') || queryLower.includes('介绍')) {
      return this.generateInfoResponse(context)
    }

    return this.generateGeneralResponse(context)
  }

  private getFallbackResponse(query: string): string {
    const responses = [
      `关于"${query}"，我需要更多信息才能为您提供准确的回答。`,
      `我没有找到与"${query}"直接相关的内容，您能提供更具体的描述吗？`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private generateRecommendationResponse(context: RAGContext): string {
    const recommendations = context.relevantContent.slice(0, 2)
    const recList = recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n\n')
    return `基于您的兴趣，我推荐以下内容：

${recList}

这些内容来自${context.sourceModules.join('和')}模块，希望能对您有帮助！`
  }

  private generateHowToResponse(context: RAGContext): string {
    return `关于您的问题，我找到以下相关信息：

${context.relevantContent[0]}

希望这些信息能帮到您！`
  }

  private generateInfoResponse(context: RAGContext): string {
    const contentList = context.relevantContent.map((content, i) => `${i + 1}. ${content}`).join('\n\n')
    return `让我为您介绍一下相关的内容：

${contentList}

这些信息来自${context.sourceModules.join('和')}模块，置信度为${(context.confidence * 100).toFixed(1)}%。`
  }

  private generateGeneralResponse(context: RAGContext): string {
    const mainContent = context.relevantContent[0]
    const additionalContent = context.relevantContent.slice(1, 3)
    
    let response = `根据您的查询，我找到以下相关信息：\n\n${mainContent}`
    
    if (additionalContent.length > 0) {
      const addList = additionalContent.map(content => `• ${content}`).join('\n')
      response += `\n\n我还发现了相关内容：\n${addList}`
    }
    
    response += `\n\n信息来源：${context.sourceModules.join('、')}模块`
    
    if (context.confidence < 0.5) {
      response += `\n\n提示：搜索结果的相关性较低，建议您提供更具体的查询关键词。`
    }
    
    return response
  }
}

//导出单例实例
export const ragEngine = new RAGEngine()