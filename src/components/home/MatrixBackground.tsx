import { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+{}|:<>?~日出而作日落而息天地玄黄宇宙洪荒'.split('');
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start at random positions above the screen
    }

    // Cyberpunk color palette: Green, Cyan, Purple, Neon
    const matrixColors = ['#00ff00', '#00ffff', '#cc00ff', '#00ffcc', '#ff00ff'];
    let lastDrawTime = 0;
    const fps = 20; // Lower frame rate for slower fall
    const interval = 1000 / fps;

    const draw = (time: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (time - lastDrawTime < interval) return;
      lastDrawTime = time;

      // Semi-transparent dark background to create trailing effect
      // Use standard composite operation for trailing
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        
        // Use green predominantly, with cyan and purple occasionally
        const isAccent = Math.random() > 0.8;
        const color = isAccent 
          ? matrixColors[Math.floor(Math.random() * (matrixColors.length - 1)) + 1]
          : matrixColors[0];
          
        ctx.fillStyle = color;
        
        // Neon glow effect
        ctx.shadowBlur = isAccent ? 15 : 5;
        ctx.shadowColor = color;
        
        // Draw character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset shadow for next operations
        ctx.shadowBlur = 0;

        // Reset drop to top randomly to keep continuous flow
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      const newColumns = Math.floor(width / fontSize);
      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) {
          drops[i] = Math.random() * -100;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
