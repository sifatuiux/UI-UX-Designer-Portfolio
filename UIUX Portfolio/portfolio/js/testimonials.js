// Testimonial data — index number and star rating are generated automatically,
// just add/remove objects here to change what's shown.
const TESTIMONIALS = [
  {
    quote: "Sifat turned our store concept into a clean, polished experience that felt much easier to trust and navigate.",
    name: "Rohan Mehta",
    role: "Founder & Store Owner",
    avatar: "images/testimonials/Rohan.jpg",
    rating: 5,
  },
  {
    quote: "He has a strong visual instinct and knows when to simplify. The final direction felt refined without losing the personality of the brand.",
    name: "Oliver Bennett",
    role: "Creative Director",
    avatar: "images/testimonials/Oliver.jpg",
    rating: 5,
  },
  {
    quote: "He understood the brand quickly and translated its personality into a website that felt elegant, simple, and easy to use.",
    name: "Samira Ahmed",
    role: "Founder of Dhaka Coffee",
    avatar: "images/testimonials/Samira.jpg",
    rating: 5,
  },
  {
    quote: "The design wasn't just nice to look at — it made the product easier to use and gave the brand a genuinely professional presence.",
    name: "Daniel Carter",
    role: "Brand & Marketing Lead",
    avatar: "images/testimonials/Daniel.jpg",
    rating: 5,
  },
  {
    quote: "Communication was clear from day one, timelines were realistic, and the final product matched the initial vision almost exactly.",
    name: "Lukas Schneider",
    role: "Marketing Director, Woodora",
    avatar: "images/testimonials/Lukas.jpg",
    rating: 5,
  },
  {
    quote: "Our app's retention improved noticeably after the redesign. Small interaction details made a bigger difference than I expected going in.",
    name: "Emily Parker",
    role: "Co-founder, Rayvue",
    avatar: "images/testimonials/Emily.jpg",
    rating: 5,
  },
  {
    quote: "Professional, responsive, and genuinely invested in getting the details right. I'd work with them again on any future project.",
    name: "Mahin Chowdhury",
    role: "Owner, Coffee Dhaka",
    avatar: "images/testimonials/Mahin.jpg",
    rating: 5,
  },
];

const track = document.getElementById("testimonialsTrack");
const prevBtn = document.getElementById("testimonialsPrev");
const nextBtn = document.getElementById("testimonialsNext");
const counter = document.getElementById("testimonialsCounter");

const STAR_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0.5l1.9 4.2 4.5.4-3.4 3 1 4.5L7 10.3 3 12.6l1-4.5-3.4-3 4.5-.4L7 .5z"/></svg>`;

function testimonialCardTemplate(t, index) {
  const stars = STAR_SVG.repeat(t.rating);
  const num = String(index + 1).padStart(2, "0");
  return `
    <div class="testimonial-card">
      <div class="testimonial-top">
        <span class="testimonial-index">${num}</span>
        <div class="testimonial-stars">${stars}</div>
      </div>
      <img class="testimonial-quote-icon" src="images/Quotered.svg" alt="" data-red="images/Quotered.svg" data-white="images/Quotewhite.svg">
      <p class="testimonial-text">${t.quote}</p>
      <div class="testimonial-divider"></div>
      <div class="testimonial-person">
        <img class="testimonial-avatar" src="${t.avatar}" alt="${t.name}">
        <div>
          <p class="testimonial-name">${t.name}</p>
          <p class="testimonial-role">${t.role}</p>
        </div>
      </div>
    </div>
  `;
}

track.innerHTML = TESTIMONIALS.map(testimonialCardTemplate).join("");

// scroll.js's own comment says dynamically-rendered sections should call
// this after re-rendering, so any .reveal elements added later get picked
// up too. Harmless no-op today (only the track container itself is
// .reveal, not individual cards) — kept here to be safe/future-proof.
if (window.ScrollMotion && typeof window.ScrollMotion.refresh === "function") {
  window.ScrollMotion.refresh();
}

const total = TESTIMONIALS.length;
counter.innerHTML = `01<span class="testimonials-counter-total">/${String(total).padStart(2, "0")}</span>`;

function scrollByCard(direction) {
  const card = track.querySelector(".testimonial-card");
  if (!card) return;
  track.scrollBy({ left: direction * card.offsetWidth, behavior: "smooth" });
}

prevBtn.addEventListener("click", () => scrollByCard(-1));
nextBtn.addEventListener("click", () => scrollByCard(1));

// keep the "03 / 07" counter and disabled arrow states in sync with actual scroll position
function updateCounter() {
  const card = track.querySelector(".testimonial-card");
  if (!card) return;
  const cardWidth = card.offsetWidth;
  const currentIndex = Math.round(track.scrollLeft / cardWidth) + 1;
  const clamped = Math.min(Math.max(currentIndex, 1), total);

  counter.innerHTML = `${String(clamped).padStart(2, "0")}<span class="testimonials-counter-total">/${String(total).padStart(2, "0")}</span>`;
  prevBtn.disabled = clamped === 1;
  nextBtn.disabled = clamped === total;
}

let scrollTimer;
track.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(updateCounter, 100);
});

updateCounter();

// swap the quote icon between red/white on hover, since it's now an <img>
// (CSS `color` can't recolor an SVG loaded via <img src="...">)
document.querySelectorAll(".testimonial-card").forEach((card) => {
  const icon = card.querySelector(".testimonial-quote-icon");
  if (!icon) return;

  card.addEventListener("mouseenter", () => {
    icon.src = icon.dataset.white;
  });
  card.addEventListener("mouseleave", () => {
    icon.src = icon.dataset.red;
  });
});