import { ref, onMounted, onUnmounted } from 'vue';

const CHARS = "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+-=[]{}|;':,./<>?";

export function useScramble(text: string, speed: number = 40, autoStart: boolean = true) {
  const displayText = ref(text); // 'ref' makes it reactive
  const isAnimating = ref(false);
  let intervalId: number | null = null; // Standard JS variable is fine here

  const triggerAnimation = () => {
    if (isAnimating.value) return;

    isAnimating.value = true;
    let iteration = 0;

    if (intervalId) clearInterval(intervalId);

    intervalId = window.setInterval(() => {
      displayText.value = text
        .split("")
        .map((letter, index) => {
          if (letter === " ") return " ";
          if (index < iteration) return text[index];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      if (iteration >= text.length) {
        if (intervalId) clearInterval(intervalId);
        isAnimating.value = false;
        displayText.value = text;
      }

      iteration += 1 / 3;
    }, speed);
  };

  onMounted(() => {
    if (autoStart) triggerAnimation();
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return { displayText, triggerAnimation };
}
