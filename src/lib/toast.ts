let container: HTMLDivElement | null = null

function ensureContainer() {
  if (container) return container
  container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '50%'
  container.style.left = '50%'
  container.style.transform = 'translate(-50%, -50%)'
  container.style.zIndex = '999999'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.alignItems = 'center'
  container.style.justifyContent = 'center'
  container.style.pointerEvents = 'none'
  document.body.appendChild(container)
  return container
}

export function showToast(message: string) {
  const el = document.createElement('div')
  
  // 创建图标和文本容器
  el.style.display = 'flex'
  el.style.alignItems = 'center'
  el.style.gap = '12px'
  el.style.padding = '16px 24px'
  el.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(20, 184, 166, 0.95) 100%)'
  el.style.color = '#fff'
  el.style.borderRadius = '16px'
  el.style.boxShadow = '0 20px 60px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
  el.style.backdropFilter = 'blur(20px)'
  el.style.fontSize = '16px'
  el.style.fontWeight = '600'
  el.style.letterSpacing = '0.5px'
  el.style.pointerEvents = 'auto'
  el.style.opacity = '0'
  el.style.transform = 'scale(0.9) translateY(-20px)'
  el.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  
  // 添加成功图标
  const iconSvg = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `
  const iconDiv = document.createElement('div')
  iconDiv.innerHTML = iconSvg
  iconDiv.style.flexShrink = '0'
  iconDiv.style.display = 'flex'
  iconDiv.style.alignItems = 'center'
  iconDiv.style.justifyContent = 'center'
  
  // 添加文本
  const textSpan = document.createElement('span')
  textSpan.textContent = message
  
  el.appendChild(iconDiv)
  el.appendChild(textSpan)
  
  ensureContainer().appendChild(el)
  
  // 触发动画
  requestAnimationFrame(() => {
    el.style.opacity = '1'
    el.style.transform = 'scale(1) translateY(0)'
  })
  
  setTimeout(() => {
    el.style.transition = 'all 0.3s ease'
    el.style.opacity = '0'
    el.style.transform = 'scale(0.9) translateY(20px)'
    setTimeout(() => el.remove(), 300)
  }, 2500)
}
