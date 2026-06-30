const fs = require('fs');
const lines = fs.readFileSync('src/components/profile/HeroSection.tsx', 'utf8').split('\n');
lines[279] = '  zhihu: { icon: () => <span className="text-lg">知</span>, color: \'#0066FF\' },';
fs.writeFileSync('src/components/profile/HeroSection.tsx', lines.join('\n'), 'utf8');
console.log('zhihu fixed');
