function addReview() {
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  const reviewsList = document.querySelector(".reviews-list");

  if (name === "" || message === "") {
    alert("Please fill in all fields.");
    return;
  }

  const reviewCard = document.createElement("div");
  reviewCard.classList.add("review-card");

  reviewCard.innerHTML = `
    <strong>${name}</strong>
    <p>${message}</p>
  `;

  reviewsList.appendChild(reviewCard);

  document.getElementById("name").value = "";
  document.getElementById("message").value = "";
}
