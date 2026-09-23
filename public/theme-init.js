function initTheme() {
  try {
    const stored = localStorage.getItem("archquest-theme");
    const isDark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) document.documentElement.classList.add("dark");
    return true;
  } catch (error) {
    console.error("Failed to initialize theme", error);
    return false;
  }
}

initTheme();
