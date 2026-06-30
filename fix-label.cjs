const fs = require('fs');
const lines = fs.readFileSync('src/components/profile/HeroSection.tsx', 'utf8').split('\n');
lines[938] = '                  label="个人简介"';
fs.writeFileSync('src/components/profile/HeroSection.tsx', lines.join('\n'), 'utf8');
console.log('fixed');
