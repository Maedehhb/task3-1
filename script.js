"use strict";

// Questions
const questions = [
    {
        question: "HTML مخفف چیست؟",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Multi Language",
            "Home Tool Markup Language"
        ],
        answer: "Hyper Text Markup Language",
        category: "HTML"
    },
    {
        question: "کدام زبان برای استایل‌دهی صفحات وب استفاده می‌شود؟",
        options: ["HTML", "CSS", "JavaScript", "Python"],
        answer: "CSS",
        category: "CSS"
    },
    {
        question: "کدام زبان برای ایجاد تعامل در صفحات وب استفاده می‌شود؟",
        options: ["HTML", "CSS", "JavaScript", "SQL"],
        answer: "JavaScript",
        category: "JavaScript"
    },
    {
        question: "کدام کلمه برای تعریف متغیر ثابت استفاده می‌شود؟",
        options: ["let", "var", "const", "change"],
        answer: "const",
        category: "JavaScript"
    },
    {
        question: "کدام متد یک مقدار را به انتهای آرایه اضافه می‌کند؟",
        options: ["pop()", "push()", "shift()", "remove()"],
        answer: "push()",
        category: "JavaScript"
    }
];

// DOM Elements
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const progressElement = document.getElementById("progress");
const messageElement = document.getElementById("message");
const resultElement = document.getElementById("result");

const submitButton = document.getElementById("submit-btn");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");

// Search input
const searchBox = document.createElement("input");
searchBox.type = "search";
searchBox.id = "search-input";
searchBox.placeholder = "جست‌وجوی سؤال...";
searchBox.setAttribute("aria-label", "جست‌وجوی سؤال");

searchBox.style.cssText =
    "width:100%;padding:12px;margin:10px 0;" +
    "border:1px solid #e4cfd3;border-radius:8px;" +
    "font-family:inherit;";

// Category filter
const filterBox = document.createElement("select");
filterBox.id = "category-filter";
filterBox.setAttribute("aria-label", "فیلتر دسته‌بندی");

filterBox.style.cssText =
    "width:100%;padding:12px;margin-bottom:15px;" +
    "border:1px solid #e4cfd3;border-radius:8px;" +
    "font-family:inherit;";

filterBox.innerHTML = `
    <option value="all">همه دسته‌ها</option>
    <option value="HTML">HTML</option>
    <option value="CSS">CSS</option>
    <option value="JavaScript">JavaScript</option>
`;

progressElement.before(filterBox);
progressElement.before(searchBox);

// LocalStorage keys
const RESULTS_KEY = "quizResults";
const PROGRESS_KEY = "quizProgress";

// Quiz state
let quizQuestions = [...questions];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let quizFinished = false;

// Read JSON safely
function readStorage(key, fallback) {
    try {
        const data = localStorage.getItem(key);

        if (data === null) {
            return fallback;
        }

        return JSON.parse(data);
    } catch (error) {
        console.error("خطا در خواندن اطلاعات:", error);
        return fallback;
    }
}

// Save data safely
function writeStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("خطا در ذخیره اطلاعات:", error);
        return false;
    }
}

// Load saved results
function loadResults() {
    const data = readStorage(RESULTS_KEY, []);

    if (!Array.isArray(data)) {
        return [];
    }

    return data.filter(item =>
        item &&
        Number.isFinite(item.score) &&
        Number.isFinite(item.total) &&
        typeof item.date === "string"
    );
}

let savedResults = loadResults();
function saveProgress() {
    const progress = {
        currentQuestion,
        score,
        selectedAnswer,
        answered,
        quizFinished,
        searchTerm: searchBox.value,
        category: filterBox.value
    };

    const saved = writeStorage(PROGRESS_KEY, progress);

    if (!saved) {
        messageElement.textContent =
            "ذخیره وضعیت آزمون انجام نشد.";
    }
}

// Restore the previous quiz state
function restoreProgress() {
    const data = readStorage(PROGRESS_KEY, null);

    if (!data || typeof data !== "object") {
        return;
    }

    searchBox.value =
        typeof data.searchTerm === "string"
            ? data.searchTerm
            : "";

    const validCategories = ["all", "HTML", "CSS", "JavaScript"];

    filterBox.value = validCategories.includes(data.category)
        ? data.category
        : "all";

    updateFilteredQuestions();

    if (quizQuestions.length === 0) {
        return;
    }

    if (
        Number.isInteger(data.currentQuestion) &&
        data.currentQuestion >= 0 &&
        data.currentQuestion < quizQuestions.length
    ) {
        currentQuestion = data.currentQuestion;
    }

    if (
        Number.isInteger(data.score) &&
        data.score >= 0 &&
        data.score <= quizQuestions.length
    ) {
        score = data.score;
    }

    const current = quizQuestions[currentQuestion];

    selectedAnswer =
        typeof data.selectedAnswer === "string" &&
        current.options.includes(data.selectedAnswer)
            ? data.selectedAnswer
            : null;

    answered = data.answered === true && selectedAnswer !== null;
    quizFinished = data.quizFinished === true;
}

// Save completed result only once per completion
function saveResult() {
    savedResults.push({
        score,
        total: quizQuestions.length,
        date: new Date().toLocaleString("fa-IR")
    });

    if (!writeStorage(RESULTS_KEY, savedResults)) {
        savedResults.pop();

        messageElement.textContent =
            "ذخیره نتیجه ناموفق بود.";
    }
}

// Show the most recent saved result
function showPreviousResult() {
    if (savedResults.length === 0) {
        resultElement.textContent = "";
        return;
    }

    const lastResult = savedResults[savedResults.length - 1];

    resultElement.textContent =
        `آخرین نتیجه ذخیره‌شده: ${lastResult.score} از ` +
        `${lastResult.total} | ${lastResult.date}`;
}

// Apply search and category filter
function updateFilteredQuestions() {
    const searchTerm = searchBox.value.trim().toLowerCase();
    const category = filterBox.value;

    quizQuestions = questions.filter(item => {
        const matchesSearch =
            item.question.toLowerCase().includes(searchTerm) ||
            item.options.some(option =>
                option.toLowerCase().includes(searchTerm)
            );

        const matchesCategory =
            category === "all" || item.category === category;

        return matchesSearch && matchesCategory;
    });
}

// Display a question
function showQuestion() {
    if (quizQuestions.length === 0) {
        questionElement.textContent = "سؤالی پیدا نشد.";
        optionsElement.replaceChildren();

        progressElement.textContent = "۰ سؤال";
        messageElement.textContent =
            "عبارت جست‌وجو یا دسته‌بندی را تغییر بده.";

        submitButton.hidden = true;
        nextButton.hidden = true;
        restartButton.hidden = true;

        resultElement.textContent = "";
        return;
    }

    const current = quizQuestions[currentQuestion];

    progressElement.textContent =
        `سؤال ${currentQuestion + 1} از ${quizQuestions.length}`;

    questionElement.textContent = current.question;
    optionsElement.replaceChildren();
    messageElement.textContent = "";

    current.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.className = "option";
        const radio = document.createElement("input");

        radio.type = "radio";

        radio.name = "answer";

        radio.value = option;

        radio.id = `option-${index}`;

        radio.checked = selectedAnswer === option;

        radio.disabled = answered;

        radio.addEventListener("change", () => {

            selectedAnswer = radio.value;

            saveProgress();

        });

        const text = document.createElement("span");

        text.textContent = option;

        label.append(radio, text);

        optionsElement.appendChild(label);

    });

    submitButton.hidden = false;

    submitButton.disabled = answered;

    nextButton.hidden = !answered;

    restartButton.hidden = true;

    if (answered) {

        messageElement.textContent =

            selectedAnswer === current.answer

                ? "آفرین! پاسخ درست است."

                : `پاسخ درست: ${current.answer}`;

    }

    showPreviousResult();

}
function checkAnswer() {
    if (answered || quizFinished) {
        return;
    }

    if (selectedAnswer === null) {
        messageElement.textContent =
            "لطفاً قبل از ثبت، یک گزینه انتخاب کن.";
        return;
    }

    const current = quizQuestions[currentQuestion];

    if (selectedAnswer === current.answer) {
        score++;
        messageElement.textContent = "آفرین! پاسخ درست است.";
    } else {
        messageElement.textContent =
            `پاسخ اشتباه است. جواب درست: ${current.answer}`;
    }

    answered = true;

    saveProgress();
    showQuestion();
}

function nextQuestion() {
    if (!answered || quizFinished) {
        return;
    }

    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        selectedAnswer = null;
        answered = false;

        saveProgress();
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    if (quizFinished || quizQuestions.length === 0) {
        return;
    }

    quizFinished = true;

    questionElement.textContent = "آزمون تمام شد!";
    optionsElement.replaceChildren();
    progressElement.textContent = "پایان آزمون";

    messageElement.textContent =
        score === quizQuestions.length
            ? "عالی بود! همه پاسخ‌ها درست بودند."
            : "آزمون به پایان رسید. می‌توانی دوباره تمرین کنی.";

    resultElement.textContent =
        `امتیاز این آزمون: ${score} از ${quizQuestions.length}`;

    submitButton.hidden = true;
    nextButton.hidden = true;
    restartButton.hidden = false;

    saveResult();
    saveProgress();
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    answered = false;
    quizFinished = false;

    updateFilteredQuestions();

    if (quizQuestions.length === 0) {
        showQuestion();
        return;
    }

    saveProgress();
    showQuestion();
}

// Search and filter reset the current attempt
function filterQuestions() {
    updateFilteredQuestions();

    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    answered = false;
    quizFinished = false;

    saveProgress();
    showQuestion();
}

// Restore a completed quiz without saving its result twice
function showFinishedQuiz() {
    questionElement.textContent = "آزمون تمام شده است!";
    optionsElement.replaceChildren();
    progressElement.textContent = "پایان آزمون";

    messageElement.textContent =
        `امتیاز شما: ${score} از ${quizQuestions.length}`;

    resultElement.textContent =
        `امتیاز این آزمون: ${score} از ${quizQuestions.length}`;

    submitButton.hidden = true;
    nextButton.hidden = true;
    restartButton.hidden = false;
}

// Event listeners
submitButton.addEventListener("click", checkAnswer);
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);

searchBox.addEventListener("input", filterQuestions);
filterBox.addEventListener("change", filterQuestions);

// Start application
try {
    restoreProgress();

    if (quizQuestions.length > 0 && quizFinished) {
        showFinishedQuiz();
        showPreviousResult();
    } else {
        showQuestion();
    }
} catch (error) {
    console.error("خطا در اجرای آزمون:", error);

    messageElement.textContent =
        "خطایی رخ داده است. صفحه را دوباره بارگذاری کن.";
}