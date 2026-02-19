
// question

const questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "Describe a challenge you solved.",
    "What are your strengths and weaknesses?"
];

let currentQuestionIndex = -1;
let interviewStarted = false;
let interviewFinished = false;

// selecting
const questionBtn = document.getElementById("questionbtn");
const questionText = document.getElementById("question");
const submitBtn = document.getElementById("submitBtn");


// interview flow

questionBtn.onclick = () => {

    if (interviewFinished) return;

    if (!interviewStarted) {
        interviewStarted = true;
        startStopwatch();
        questionBtn.textContent = "Next Question";
    }

    currentQuestionIndex++;

    questionText.innerText = questions[currentQuestionIndex];
    document.getElementById("answer").value = "";

    // If second last
    if (currentQuestionIndex === questions.length - 2) {
        questionBtn.textContent = "Last Question";
    }

    // If last question
    if (currentQuestionIndex === questions.length - 1) {
        questionBtn.textContent = "Interview Finished";
        questionBtn.disabled = true;
        interviewFinished = true;
    }
};


// submit answer

submitBtn.onclick = () => {

    const text = document.getElementById("answer").value.trim();

    if (!interviewStarted) {
        alert("Please start the interview first.");
        return;
    }

    if (text === "") {
        alert("Please answer the question before submitting.");
        return;
    }

    const words = text.split(/\s+/);
    const wordCount = words.length;

    // 1️⃣ Minimum words check
    if (wordCount < 5) {
        alert("Answer too short. Please provide a meaningful response.");
        return;
    }

    // 2️⃣ Valid English word ratio check
    const validWordRatio = words.filter(word =>
        /^[a-zA-Z]+$/.test(word)
    ).length / wordCount;

    if (validWordRatio < 0.6) {
        alert("Your answer seems invalid. Please write a proper English sentence.");
        return;
    }

    // 3️⃣ Relevance check
    const currentQuestion = questions[currentQuestionIndex].toLowerCase();
    const lowerText = text.toLowerCase();

    let requiredKeywords = [];

    if (currentQuestion.includes("yourself")) {
        requiredKeywords = ["i", "am", "my"];
    }
    else if (currentQuestion.includes("hire")) {
        requiredKeywords = ["skill", "experience", "strength", "ability", "contribute"];
    }
    else if (currentQuestion.includes("challenge")) {
        requiredKeywords = ["problem", "challenge", "solve", "solution", "experience"];
    }
    else if (currentQuestion.includes("strength")) {
        requiredKeywords = ["strength", "weakness", "improve", "skill"];
    }

    const keywordMatch = requiredKeywords.some(keyword =>
        lowerText.includes(keyword)
    );

    if (!keywordMatch) {
        alert("Your answer does not seem relevant to the question.");
        return;
    }

    // STOP stopwatch only on submit
    stopStopwatch();

    // logiv for words

    const fillerWords = ["um", "uh", "like", "you know", "basically"];
    let fillerCount = 0;

    fillerWords.forEach(filler => {
        const regex = new RegExp(`\\b${filler}\\b`, "gi");
        const matches = text.match(regex);
        if (matches) fillerCount += matches.length;
    });

    let score = 0;

    if (wordCount < 10) {
        score = 4;
    } else if (wordCount < 20) {
        score = 6;
    } else if (wordCount < 35) {
        score = 8;
    } else {
        score = 9.5;
    }

    score -= fillerCount * 0.5;

    if (score < 0) score = 0;
    if (score > 10) score = 10;

    score = score.toFixed(1);

    // feedback score

    let feedbackMessage = "";

    if (score >= 9) {
        feedbackMessage = "🔥 Excellent answer! Very confident and well-structured.";
    }
    else if (score >= 7) {
        feedbackMessage = "✅ Good answer! Try adding more specific examples.";
    }
    else if (score >= 5) {
        feedbackMessage = "⚠️ Decent attempt. Improve clarity and structure.";
    }
    else {
        feedbackMessage = "❌ Weak answer. Expand your thoughts and reduce filler words.";
    }

    // feedbackMessage += `\n\nWord Count: ${wordCount}`;
    // feedbackMessage += `\nFiller Words: ${fillerCount}`;

    document.getElementById("feedback").innerText = feedbackMessage;
    document.getElementById("Score").innerText = score + "/10";

    document.querySelector(".result").classList.add("show");
};

// stopwatch

let seconds = 0;
let minutes = 0;
let hours = 0;
let stopwatchInterval = null;

function updateStopwatch() {
    seconds++;

    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }

    if (minutes === 60) {
        minutes = 0;
        hours++;
    }

    const h = hours < 10 ? "0" + hours : hours;
    const m = minutes < 10 ? "0" + minutes : minutes;
    const s = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("clock").textContent = `${h}:${m}:${s}`;
}

function startStopwatch() {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(updateStopwatch, 1000);
    }
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

// recording

let recognition;
let isRecording = false;

document.getElementById("recordBtn").onclick = () => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
    }

    if (!isRecording) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            document.getElementById("answer").value = transcript;
        };

        recognition.start();
        isRecording = true;
        document.getElementById("recordBtn").textContent = "Stop Recording";
        document.getElementById("recordBtn").classList.add("recording");

    } else {
        recognition.stop();
        isRecording = false;
        document.getElementById("recordBtn").textContent = "Record Voice";
        document.getElementById("recordBtn").classList.remove("recording");
    }
};
