import { describe, it, expect, beforeEach } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    // Reset DOM class list
    document.documentElement.classList.remove('dark');
  });

  it('should initialize with dark mode by default', () => {
    const { isDark } = useTheme();
    expect(isDark.value).toBe(true);
  });

  it('should toggle theme', () => {
    const { isDark, toggleTheme } = useTheme();
    
    // Initial state (dark)
    expect(isDark.value).toBe(true);
    
    // Toggle to light
    toggleTheme();
    expect(isDark.value).toBe(false);
    
    // Toggle back to dark
    toggleTheme();
    expect(isDark.value).toBe(true);
  });
});
