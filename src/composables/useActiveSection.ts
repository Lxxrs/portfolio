import { ref, onMounted, onUnmounted } from 'vue';

export function useActiveSection(sectionIds: string[]) {
  const activeSection = ref<string>('');

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    }, {
      threshold: 0.5 // Trigger when 50% of the section is visible
    });

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer?.observe(element);
    });
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { activeSection };
}
