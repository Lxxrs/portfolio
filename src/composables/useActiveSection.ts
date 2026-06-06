import { ref, onMounted, onUnmounted } from "vue";

export function useActiveSection(sectionIds: string[]) {
  const activeSection = ref<string>("");

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id;
          }
        });
      },
      {
        // A section is "active" when any part of it is in the top 10%–middle
        // band of the viewport. This works for short bottom sections (e.g. a
        // Contact section that never reaches 50% visibility when the footer
        // fills the rest of the fold) and for tall sections alike.
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      },
    );

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
