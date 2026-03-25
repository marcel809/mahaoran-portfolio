(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const toastEl = document.getElementById("toast");
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  // Theme toggle (persisted)
  const themeToggleBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialTheme = savedTheme || (prefersLight ? "light" : "dark");
  document.documentElement.dataset.theme = initialTheme;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
      showToast(next === "light" ? "已切换到浅色主题" : "已切换到深色主题");
    });
  }

  // Smooth scroll for internal anchors
  function handleAnchorClick(e) {
    const a = e.target && e.target.closest ? e.target.closest("a[href^='#']") : null;
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  document.addEventListener("click", handleAnchorClick);

  // Copy email
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const emailValueEl = document.getElementById("emailValue");
  const email = emailValueEl ? (emailValueEl.textContent || "").trim() : "";

  async function copyText(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      // ignore and fallback
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return !!ok;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      const ok = await copyText(email);
      showToast(ok ? "邮箱已复制到剪贴板" : "复制失败，请手动复制邮箱");
    });
  }

  // Contact form (front-end only)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get("name") || "").trim();
      const message = String(fd.get("message") || "").trim();
      if (!name || !message) {
        showToast("请填写姓名与留言内容");
        return;
      }
      showToast("已收到你的留言（示例：未真实发送）");
      contactForm.reset();
    });
  }
})();

