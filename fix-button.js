const fs = require('fs');
const lines = fs.readFileSync('src/components/profile/HeroSection.tsx', 'utf8').split('\n');
const newButton = [
  '',
  '            {/* 简历模版按钮 */}',
  '            <motion.button',
  '              whileHover={{ scale: 1.02 }}',
  '              whileTap={{ scale: 0.98 }}',
  "              onClick={() => navigate('/resume-templates')}",
  '              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all opacity-60 hover:opacity-80"',
  '              style={{',
  "                backgroundColor: 'transparent',",
  '                color: themeConfig.colors.text',
  '              }}',
  '              title="简历模版"',
  '            >',
  '              <Sparkles size={16} />',
  '              <span>模版</span>',
  '            </motion.button>'
];
lines.splice(423, 0, ...newButton);
fs.writeFileSync('src/components/profile/HeroSection.tsx', lines.join('\n'), 'utf8');
console.log('template button added');
