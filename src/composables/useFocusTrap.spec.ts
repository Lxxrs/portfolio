import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should trap focus within container', () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    
    button1.textContent = 'Button 1';
    button2.textContent = 'Button 2';
    
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    const containerRef = ref(container);
    const isActive = ref(true);
    
    const { trapFocus } = useFocusTrap(containerRef, isActive);
    trapFocus();

    expect(document.activeElement).toBe(button1);
  });

  it('should restore focus when released', () => {
    const outsideButton = document.createElement('button');
    outsideButton.textContent = 'Outside';
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const container = document.createElement('div');
    const insideButton = document.createElement('button');
    insideButton.textContent = 'Inside';
    container.appendChild(insideButton);
    document.body.appendChild(container);

    const containerRef = ref(container);
    const isActive = ref(true);
    
    const { trapFocus, releaseFocus } = useFocusTrap(containerRef, isActive);
    
    trapFocus();
    expect(document.activeElement).toBe(insideButton);
    
    releaseFocus();
    expect(document.activeElement).toBe(outsideButton);
  });
});
