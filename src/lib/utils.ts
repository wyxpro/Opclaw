import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 触发触觉反馈（震动）
 * @param style 震动样式：light, medium, heavy, success, warning, error
 */
export function triggerHaptic(style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    switch (style) {
      case 'light':
        window.navigator.vibrate(10);
        break;
      case 'medium':
        window.navigator.vibrate(20);
        break;
      case 'heavy':
        window.navigator.vibrate(50);
        break;
      case 'success':
        window.navigator.vibrate([10, 30, 10]);
        break;
      case 'warning':
        window.navigator.vibrate([20, 50, 20]);
        break;
      case 'error':
        window.navigator.vibrate([50, 100, 50]);
        break;
      default:
        window.navigator.vibrate(10);
    }
  }
}
