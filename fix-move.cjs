const fs = require('fs');
const lines = fs.readFileSync('src/components/profile/HeroSection.tsx', 'utf8').split('\n');
// 找到"简历模版按钮"的位置并移除
const btnStart = lines.findIndex(l => l.includes('简历模版按钮'));
const btnEnd = lines.findIndex((l, i) => i > btnStart && l.includes('</motion.button>'));
const btnLines = lines.splice(btnStart, btnEnd - btnStart + 1);
// 找到</div>的位置（简历按钮组的闭合标签）
const divIdx = lines.findIndex((l, i) => i > 420 && l.trim() === '</div>');
// 在</div>之前插入按钮
lines.splice(divIdx, 0, ...btnLines);
fs.writeFileSync('src/components/profile/HeroSection.tsx', lines.join('\n'), 'utf8');
console.log('button moved inside div');
