// ================= ROUNDS =================
const rounds = {
  HR: [
    "Tell me about yourself.",
    "Why should we hire you?"
  ],
  Behavioral: [
    "Describe a challenge you solved.",
    "What are your strengths and weaknesses?"
  ]
};

let currentQuestionIndex = -1;
let selectedRound = "HR";
let questions = rounds[selectedRound];

// ================= ELEMENTS =================
const questionBtn = document.getElementById("questionbtn");
const questionText = document.getElementById("question");
const submitBtn = document.getElementById("submitBtn");
const tipBox = document.getElementById("tip");

// ================= STOPWATCH =================
let timerInterval;
let startTime = 0;

function startTimer() {
  startTime = new Date().getTime();

  timerInterval = setInterval(() => {
    let now = new Date().getTime();
    let diff = Math.floor((now - startTime) / 1000);

    let hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
    let mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    let secs = String(diff % 60).padStart(2, '0');

    document.getElementById("clock").innerText = `${hrs}:${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// ================= ROUND CHANGE =================
document.getElementById("roundSelect").onchange = function () {
  selectedRound = this.value;
  questions = rounds[selectedRound];
  resetInterview();
};

function resetInterview() {
  currentQuestionIndex = -1;
  questionText.innerText = "Click to begin your mock interview";
  tipBox.innerText = "";
  document.getElementById("feedback").innerText = "Waiting for submission...";
  document.getElementById("Score").innerText = "0/10";
  document.getElementById("clock").innerText = "00:00:00";
  questionBtn.disabled = false;
  questionBtn.textContent = "Start Interview";
  stopTimer();
}

// ================= INTERVIEW FLOW =================
questionBtn.onclick = () => {
  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    questionText.innerText = "Interview Completed 🎉";
    questionBtn.disabled = true;
    stopTimer();
    return;
  }

  questionText.innerText = questions[currentQuestionIndex];
  document.getElementById("answer").value = "";

  startTimer(); // ⏱ START TIMER HERE
  showTip(questions[currentQuestionIndex]);
};

// ================= VALIDATION FUNCTIONS =================

// Check meaningful answer
function isMeaningful(text) {
  if (text.length < 20) return false;

  // Check if mostly letters
  let letters = text.match(/[a-zA-Z]/g);
  if (!letters || letters.length < text.length * 0.6) return false;

  return true;
}

// Check if answer matches question
function matchesQuestion(answer, question) {
  answer = answer.toLowerCase();

  if (question.includes("yourself")) {
    return answer.includes("i am") || answer.includes("my background");
  }

  if (question.includes("hire")) {
    return answer.includes("skill") || answer.includes("experience") || answer.includes("value");
  }

  if (question.includes("challenge")) {
    return answer.includes("challenge") || answer.includes("problem") || answer.includes("situation");
  }

  if (question.includes("strength")) {
    return answer.includes("strength") || answer.includes("weakness");
  }

  return false;
}

// ================= SUBMIT ANSWER =================
submitBtn.onclick = () => {
  const text = document.getElementById("answer").value.trim();

  if (!text) {
    alert("Please provide your response.");
    return;
  }

  // ❌ RANDOM TEXT CHECK
  if (!isMeaningful(text)) {
    alert("⚠ Please enter a meaningful answer related to the question.");
    return;
  }

  // ❌ QUESTION MATCH CHECK
  if (!matchesQuestion(text, questions[currentQuestionIndex])) {
    alert("⚠ Your answer does not match the question asked.");
    return;
  }

  stopTimer(); // ⏹ STOP TIMER HERE

  const words = text.split(/\s+/);
  const wordCount = words.length;

  let score = 0;
  if (wordCount < 10) score = 5;
  else if (wordCount < 20) score = 7;
  else score = 9;

  score = score.toFixed(1);

  let feedback = "Good effort! You can improve by adding more clarity and specific examples.";
  let improvedExample = generateImprovedExample(questions[currentQuestionIndex]);

  document.getElementById("feedback").innerText =
    feedback + "\n\nSuggested Structure Example:\n" + improvedExample;

  document.getElementById("Score").innerText = score + "/10";
};

// ================= COACHING TIPS =================
function showTip(question) {
  if (question.includes("yourself")) {
    tipBox.innerText = "Tip: Start with education, skills, experience, and career goals.";
  } else if (question.includes("hire")) {
    tipBox.innerText = "Tip: Mention your strengths, achievements, and value you bring.";
  } else if (question.includes("challenge")) {
    tipBox.innerText = "Tip: Use the STAR method (Situation, Task, Action, Result).";
  } else if (question.includes("strength")) {
    tipBox.innerText = "Tip: Mention strengths with example and a weakness you're improving.";
  }
}

// ================= IMPROVED ANSWER TEMPLATES =================
function generateImprovedExample(question) {
  if (question.includes("yourself")) {
    return "I am a Computer Science student with strong skills in web development and AI. I have worked on multiple projects and aim to build impactful technology solutions.";
  }
  if (question.includes("hire")) {
    return "You should hire me because I bring strong technical skills, adaptability, and a results-driven mindset. I am committed to continuous learning and growth.";
  }
  if (question.includes("challenge")) {
    return "In a recent project, I faced difficulty in user validation. I analyzed the issue, improved the logic, and enhanced user experience successfully.";
  }
  if (question.includes("strength")) {
    return "One of my strengths is problem-solving, and I am currently improving my public speaking skills through regular practice.";
  }
  return "";
}

// ================= VOICE RECOGNITION =================
let recognition;
let isRecording = false;

document.getElementById("recordBtn").onclick = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported.");
    return;
  }

  if (!isRecording) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      document.getElementById("answer").value = transcript;
    };

    recognition.start();
    isRecording = true;
    document.getElementById("recordBtn").textContent = "Stop Recording";
  } else {
    recognition.stop();
    isRecording = false;
    document.getElementById("recordBtn").textContent = "Record Voice";
  }
};
