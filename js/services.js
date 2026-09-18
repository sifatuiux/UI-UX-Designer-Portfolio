
/* ============== Modal open/close ============== */

const serviceItems = document.querySelectorAll(".service-item");
const modal = document.getElementById("serviceModal");
const modalNumber = document.getElementById("serviceModalNumber");
const modalTitle = document.getElementById("serviceModalTitle");
const modalDesc = document.getElementById("serviceModalDesc");
const modalList = document.getElementById("serviceModalList");

function openModal(item) {
  const number = item.querySelector(".service-number").textContent;
  const includes = item.dataset.includes.split(",").map((s) => s.trim());

  modalNumber.textContent = number;
  modalTitle.textContent = item.dataset.title;
  modalDesc.textContent = item.dataset.desc;
  modalList.innerHTML = includes.map((i) => `<li>${i}</li>`).join("");

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // stop background scroll while modal is open
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

serviceItems.forEach((item) => {
  item.addEventListener("click", () => openModal(item));
});

modal.querySelectorAll("[data-modal-close]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});