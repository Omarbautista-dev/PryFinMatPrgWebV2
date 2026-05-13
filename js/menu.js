document.addEventListener("DOMContentLoaded", () => {
  fetch("components/menu.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("menu-container").innerHTML = data;

      const sidebar = document.getElementById("sidebar");
      const toggleBtn = document.getElementById("toggle-btn");
      const overlay = document.getElementById("overlay");

      // ===== RESTAURAR ESTADO =====

      const sidebarState = localStorage.getItem("sidebar");

      if (sidebarState === "open") {
        sidebar.classList.add("active");
        overlay.classList.add("active");
      }

      // ===== ABRIR / CERRAR =====

      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");

        // GUARDAR ESTADO
        if (sidebar.classList.contains("active")) {
          localStorage.setItem("sidebar", "open");
        } else {
          localStorage.setItem("sidebar", "closed");
        }
      });

      // ===== CERRAR CON OVERLAY =====

      overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");

        localStorage.setItem("sidebar", "closed");
      });

      // ===== SUBMENUS =====

      const submenuToggles = document.querySelectorAll(".submenu-toggle");

      submenuToggles.forEach((toggle, index) => {
        const submenu = toggle.nextElementSibling;

        // RESTAURAR SUBMENU
        const submenuState = localStorage.getItem("submenu-" + index);

        if (submenuState === "open") {
          submenu.classList.add("active");
        }

        toggle.addEventListener("click", () => {
          submenu.classList.toggle("active");

          // GUARDAR ESTADO
          if (submenu.classList.contains("active")) {
            localStorage.setItem("submenu-" + index, "open");
          } else {
            localStorage.setItem("submenu-" + index, "closed");
          }
        });
      });
    });
});
