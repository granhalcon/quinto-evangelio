(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector(".menu-button");
  const navPanel = document.querySelector(".nav-panel");
  const searchButton = document.querySelector(".search-button");
  const searchForm = document.querySelector(".global-search");
  const searchInput = document.querySelector("#global-search-input");
  const themeButton = document.querySelector(".theme-button");
  const themeMenu = document.querySelector(".theme-menu");
  const themeSelect = document.querySelector("#theme-select");
  const bookNavigation = document.querySelector(".book-navigation--mobile");

  const setExpanded = (button, expanded) => {
    button.setAttribute("aria-expanded", String(expanded));
  };

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    setExpanded(menuButton, !expanded);
    navPanel.classList.toggle("nav-panel--open", !expanded);
  });

  searchButton.addEventListener("click", () => {
    const expanded = searchButton.getAttribute("aria-expanded") === "true";
    setExpanded(searchButton, !expanded);
    searchForm.hidden = expanded;
    themeMenu.hidden = true;
    setExpanded(themeButton, false);
    if (!expanded) searchInput.focus();
  });

  themeButton.addEventListener("click", () => {
    const expanded = themeButton.getAttribute("aria-expanded") === "true";
    setExpanded(themeButton, !expanded);
    themeMenu.hidden = expanded;
    searchForm.hidden = true;
    setExpanded(searchButton, false);
    if (!expanded) themeSelect.focus();
  });

  themeSelect.value = root.dataset.theme;
  themeSelect.addEventListener("change", () => {
    root.dataset.theme = themeSelect.value;
    localStorage.setItem("circulo-theme", themeSelect.value);
  });

  if (bookNavigation) {
    const summary = bookNavigation.querySelector("summary");
    const content = bookNavigation.querySelector(".book-navigation__body");
    let animation;

    summary.addEventListener("click", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      animation?.cancel();

      if (!bookNavigation.open) {
        bookNavigation.open = true;
        animation = content.animate(
          [
            { height: "0", opacity: 0, transform: "translateY(-.35rem)" },
            { height: `${content.scrollHeight}px`, opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 280, easing: "ease-out" },
        );
      } else {
        animation = content.animate(
          [
            { height: `${content.offsetHeight}px`, opacity: 1, transform: "translateY(0)" },
            { height: "0", opacity: 0, transform: "translateY(-.35rem)" },
          ],
          { duration: 220, easing: "ease-in" },
        );
        animation.addEventListener("finish", () => {
          bookNavigation.open = false;
        }, { once: true });
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (
      !themeMenu.hidden &&
      !themeMenu.contains(event.target) &&
      !themeButton.contains(event.target)
    ) {
      themeMenu.hidden = true;
      setExpanded(themeButton, false);
    }

    if (
      !searchForm.hidden &&
      !searchForm.contains(event.target) &&
      !searchButton.contains(event.target)
    ) {
      searchForm.hidden = true;
      setExpanded(searchButton, false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (!searchForm.hidden) {
      searchForm.hidden = true;
      setExpanded(searchButton, false);
      searchButton.focus();
    }

    if (!themeMenu.hidden) {
      themeMenu.hidden = true;
      setExpanded(themeButton, false);
      themeButton.focus();
    }

    if (navPanel.classList.contains("nav-panel--open")) {
      navPanel.classList.remove("nav-panel--open");
      setExpanded(menuButton, false);
      menuButton.focus();
    }
  });
})();
