import { describe, it, expect, beforeEach } from "vite-plus/test";
import { ref, defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { useFocusTrap } from "./useFocusTrap";

describe("useFocusTrap", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should trap focus within container", () => {
    const container = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    button1.textContent = "Button 1";
    button2.textContent = "Button 2";

    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    const containerRef = ref(container);
    const isActive = ref(true);

    let trapFocusFn: ReturnType<typeof useFocusTrap>["trapFocus"];

    const Wrapper = defineComponent({
      setup() {
        const { trapFocus } = useFocusTrap(containerRef, isActive);
        trapFocusFn = trapFocus;
        return () => h("div");
      },
    });

    mount(Wrapper, { attachTo: document.body });
    trapFocusFn!();

    expect(document.activeElement).toBe(button1);
  });

  it("should restore focus when released", () => {
    const outsideButton = document.createElement("button");
    outsideButton.textContent = "Outside";
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const container = document.createElement("div");
    const insideButton = document.createElement("button");
    insideButton.textContent = "Inside";
    container.appendChild(insideButton);
    document.body.appendChild(container);

    const containerRef = ref(container);
    const isActive = ref(true);

    let trapFocusFn: ReturnType<typeof useFocusTrap>["trapFocus"];
    let releaseFocusFn: ReturnType<typeof useFocusTrap>["releaseFocus"];

    const Wrapper = defineComponent({
      setup() {
        const { trapFocus, releaseFocus } = useFocusTrap(containerRef, isActive);
        trapFocusFn = trapFocus;
        releaseFocusFn = releaseFocus;
        return () => h("div");
      },
    });

    mount(Wrapper, { attachTo: document.body });

    trapFocusFn!();
    expect(document.activeElement).toBe(insideButton);

    releaseFocusFn!();
    expect(document.activeElement).toBe(outsideButton);
  });
});
