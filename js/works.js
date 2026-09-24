// ===== Project data =====
const PROJECTS = [
  { title: "Aethel - Timepiece Co.",          industry: "Luxury Retail", filterType: "website",   image: "images/case_studies/Aethel.jpg",        link: "aethel.html" },
  { title: "Oculyn - VR Store",               industry: "Tech Retail",   filterType: "website",   image: "images/case_studies/Oculyn.jpg",        link: "oculyn.html" },
  { title: "Resello - Admin Platform",        industry: "E-Commerce",    filterType: "dashboard", image: "images/case_studies/Resello.jpg",       link: "resello.html" },
  { title: "Real-Deal Properties",            industry: "Real Estate",   filterType: "website",   image: "images/case_studies/Realdeal.jpg",      link: "realdeal.html" },
  { title: "Quick Bite - Food delivery App",  industry: "Restaurant",    filterType: "app",       image: "images/case_studies/Quickbite.jpg",     link: "quickbite.html" },
  { title: "Quite - Mindful Living",          industry: "Wellness",      filterType: "website",   image: "images/case_studies/Quite.jpg",         link: "quite.html" },
  { title: "Ray-Vue Trading Journal",         industry: "Fintech",       filterType: "website",   image: "images/case_studies/Rayvue.jpg",        link: "rayvue.html" },
  { title: "Woodora - Furniture Co.",         industry: "E-Commerce",    filterType: "website",   image: "images/case_studies/Woodora.jpg",       link: "woodora.html" },
  { title: "CSE Alumni - Student Management", industry: "Community",     filterType: "website",   image: "images/case_studies/CUCSEAA.jpg",       link: "cucseaa.html" },
  { title: "CUCSEAA - Management Admin",      industry: "Community",     filterType: "dashboard", image: "images/case_studies/CUCSEAAAdmin.jpg",  link: "cucseaaadmin.html" },
  { title: "Coffee Dhaka - Cafe",             industry: "Hospitality",   filterType: "website",   image: "images/case_studies/Coffeedhaka.jpg",   link: "coffeedhaka.html" },
  { title: "Fresh Finds - Grocery Shop",      industry: "E-Commerce",    filterType: "app",       image: "images/case_studies/Freshfinds.jpg",    link: "freshfind.html" },
  { title: "Designer Portfolio Site",         industry: "Personal",      filterType: "website",   image: "images/case_studies/Portfolio.jpg",     link: "designer-portfolio.html" },
  { title: "Verdura Plant Shop",              industry: "E-Commerce",    filterType: "website",   image: "images/case_studies/Verdura.jpg",       link: "verdura.html" },
  { title: "Nexcent Tech - IT Agency",        industry: "Portfolio",     filterType: "website",   image: "images/case_studies/Nexcent.jpg",       link: "nexcent.html" },
  { title: "Caretap - Medicine reminder",     industry: "Treatment",     filterType: "website",   image: "images/case_studies/Caretap.jpg",       link: "caretap.html" },
];

const TYPE_LABELS = { website: "Web", app: "App", dashboard: "Dashboard" };

// Mobile (<=1024px): horizontal-scroll carousel replaces pagination,
// so every filtered project loads upfront — no "Load More" needed.
const IS_MOBILE_VIEW = window.matchMedia("(max-width: 1024px)").matches;
const INITIAL_COUNT = IS_MOBILE_VIEW ? Infinity : 9;
const LOAD_STEP = 3;

const grid = document.getElementById("workGrid");
const filterBtns = document.querySelectorAll(".filter-btn");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let activeFilter = "all";
let visibleCount = INITIAL_COUNT;

function updateFilterCounts() {
  const counts = { all: PROJECTS.length, website: 0, app: 0, dashboard: 0 };
  PROJECTS.forEach((p) => {
    if (counts[p.filterType] !== undefined) counts[p.filterType]++;
  });
  filterBtns.forEach((btn) => {
    const filter = btn.dataset.filter;
    const countSpan = btn.querySelector(".count");
    if (countSpan && counts[filter] !== undefined) {
      countSpan.textContent = `(${counts[filter]})`;
    }
  });
}

function getFiltered() {
  return activeFilter === "all"
    ? PROJECTS
    : PROJECTS.filter((p) => p.filterType === activeFilter);
}

function workCardTemplate(p, index) {
  const delay = (index % 3) * 100;
  return `
    <a class="work-card reveal" data-reveal="up" style="--reveal-delay: ${delay}ms;" href="${p.link}">
      <div class="work-image">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <span class="work-arrow" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
      <div class="work-body">
        <h3 class="work-title">${p.title}</h3>
        <p class="work-category">${p.industry} • ${TYPE_LABELS[p.filterType]}</p>
      </div>
    </a>
  `;
}

function render() {
  const filtered = getFiltered();
  const visible = filtered.slice(0, visibleCount);
  if (grid) {
    grid.innerHTML = visible.map(workCardTemplate).join("");
    grid.scrollLeft = 0;
  }
  if (loadMoreBtn) {
    loadMoreBtn.style.display = visibleCount >= filtered.length ? "none" : "inline-block";
  }
  if (window.ScrollMotion) window.ScrollMotion.refresh();
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const currentBtn = e.target.closest(".filter-btn");
    if (!currentBtn || currentBtn.classList.contains("active")) return;
    filterBtns.forEach((b) => b.classList.remove("active"));
    currentBtn.classList.add("active");
    activeFilter = currentBtn.dataset.filter;
    visibleCount = INITIAL_COUNT;
    if (grid) {
      grid.classList.add("is-filtering");
      setTimeout(() => {
        render();
        grid.classList.remove("is-filtering");
      }, 200);
    } else {
      render();
    }
  });
});

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    visibleCount += LOAD_STEP;
    render();
  });
}

updateFilterCounts();
render();