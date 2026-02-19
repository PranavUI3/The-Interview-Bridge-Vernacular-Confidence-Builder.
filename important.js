const questions = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Why should we hire you?",
  "Describe a challenging situation you faced.",
  "Where do you see yourself in 5 years?",
  "Why do you want to work for our company?",
  "How do you handle pressure and stress?",
  "Explain a project you are proud of.",
  "What makes you different from other candidates?",
  "Do you have any questions for us?"
];

const container = document.querySelector(".questions");

questions.forEach((q, index) => {
  const card = document.createElement("div");
  card.classList.add("question-card");
  card.innerHTML = `<strong>Q${index + 1}:</strong> ${q}`;
  container.appendChild(card);
});
